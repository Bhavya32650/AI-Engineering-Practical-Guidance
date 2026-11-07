
import json
from contextlib import asynccontextmanager
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import ValidationError

from app.config import (
    ALLOWED_ORIGINS,
    ARCHIVE_RETENTION_DAYS,
    GROQ_API_KEY,
    GROQ_MODEL,
)

from app.schemas.ingestion import IngestionRequest, RenameRequest
from app.schemas.assistant import AssistantResult, TokenUsage

from app.services.database_service import (
    initialize_database,
    check_database,
    database_kind,
    ensure_conversation,
    add_chat_message,
    get_chat_history,
    list_conversations,
    get_conversation_messages,
    rename_conversation,
    delete_conversation,
    archive_conversation,
    restore_conversation,
    list_archived_conversations,
    purge_expired_archives,
    get_archive_status,
)

from app.services.llm_service import analyze_message
from app.services.response_service import generate_response, stream_response
from app.utils.token_counter import estimate_tokens


USER_ERROR = (
    "The assistant couldn't answer right now. "
    "Please try again in a moment."
)


# Database initialization
@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    purge_expired_archives()
    yield


# FastAPI application
app = FastAPI(
    title="Indigo.ai API",
    description="AI-powered message analysis and contextual assistance.",
    version="4.0.0",
    lifespan=lifespan,
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint - hidden from Swagger
@app.get("/", include_in_schema=False)
def root():
    return {
        "service": app.title,
        "status": "running",
    }


# 1. GET /health
@app.get("/health", tags=["default"])
def health_check(response: Response):
    database_ok = check_database()

    if not database_ok:
        response.status_code = 503

    return {
        "status": "ok" if database_ok else "error",
        "message": "Indigo.ai API is running",
        "database": database_kind(),
        "database_ok": database_ok,
        "groq_api_key_configured": bool(GROQ_API_KEY),
        "model": GROQ_MODEL,
    }


# 2. GET /api/conversations
@app.get("/api/conversations", tags=["default"])
def conversations():
    purge_expired_archives()
    return {
        "items": list_conversations()
    }


# Helper function for session ID validation
def _check_conversation_id(session_id: str) -> None:
    try:
        UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid conversation ID.",
        )


# 3. GET /api/conversations/{session_id}/messages
@app.get(
    "/api/conversations/{session_id}/messages",
    tags=["default"],
)
def conversation_messages(session_id: str):
    _check_conversation_id(session_id)

    return {
        "session_id": session_id,
        "archive": get_archive_status(session_id),
        "items": get_conversation_messages(session_id),
    }


# Archive endpoint - hidden from Swagger
@app.post(
    "/api/conversations/{session_id}/archive",
    include_in_schema=False,
)
def archive(session_id: str):
    _check_conversation_id(session_id)

    if not archive_conversation(session_id):
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    return {
        "session_id": session_id,
        **get_archive_status(session_id),
    }


# Restore endpoint - hidden from Swagger
@app.post(
    "/api/conversations/{session_id}/restore",
    include_in_schema=False,
)
def restore(session_id: str):
    _check_conversation_id(session_id)

    if not restore_conversation(session_id):
        raise HTTPException(
            status_code=404,
            detail="This chat isn't in the archive.",
        )

    return {
        "session_id": session_id,
        "restored": True,
    }


# Rename endpoint - hidden from Swagger
@app.patch(
    "/api/conversations/{session_id}",
    include_in_schema=False,
)
def rename(session_id: str, body: RenameRequest):
    _check_conversation_id(session_id)

    if not rename_conversation(session_id, body.title):
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    return {
        "session_id": session_id,
        "title": body.title,
    }


# Delete endpoint - hidden from Swagger
@app.delete(
    "/api/conversations/{session_id}",
    status_code=204,
    include_in_schema=False,
)
def delete(session_id: str):
    _check_conversation_id(session_id)

    if not delete_conversation(session_id):
        raise HTTPException(
            status_code=404,
            detail="Conversation not found.",
        )

    return Response(status_code=204)


# Load intent analysis and conversation history
def _classify_and_load_history(
    request: IngestionRequest,
    message: str,
    session_id: str,
    usage: dict,
):
    if not request.incognito:
        ensure_conversation(session_id, message[:70])

    result = analyze_message(message, usage=usage)

    result.token_metadata.estimated_input_tokens = estimate_tokens(
        message
    )

    if request.incognito:
        history = [
            turn.model_dump()
            for turn in request.history
        ]
    else:
        history = get_chat_history(session_id)

    return result, history


# Save user and assistant messages
def _save_exchange(
    request: IngestionRequest,
    session_id: str,
    message: str,
    answer: str,
) -> None:
    if request.incognito:
        return

    add_chat_message(session_id, "user", message)
    add_chat_message(session_id, "assistant", answer)


# 4. POST /api/analyze
@app.post(
    "/api/analyze",
    response_model=AssistantResult,
    tags=["default"],
)
def analyze(request: IngestionRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=422,
            detail="Message cannot be empty.",
        )

    session_id = request.session_id or str(uuid4())

    try:
        UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="session_id must be a valid UUID.",
        )

    classify_usage = {}
    reply_usage = {}

    try:
        result, history = _classify_and_load_history(
            request,
            message,
            session_id,
            classify_usage,
        )

        response_markdown = generate_response(
            result,
            history=history,
            current_message=message,
            usage=reply_usage,
        )

        _save_exchange(
            request,
            session_id,
            message,
            response_markdown,
        )

        return AssistantResult(
            **result.model_dump(),
            session_id=session_id,
            response_markdown=response_markdown,
            token_usage=TokenUsage.combine(
                classify_usage,
                reply_usage,
            ),
        )

    except ValidationError as exc:
        print(
            f"Validation failed for session {session_id}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=USER_ERROR,
        ) from exc

    except Exception as exc:
        print(
            f"Request failed for session {session_id}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=USER_ERROR,
        ) from exc


# Streaming helper
def _event(payload: dict) -> str:
    return json.dumps(
        payload,
        ensure_ascii=False,
    ) + "\n"


# Streaming endpoint - hidden from Swagger
@app.post(
    "/api/analyze/stream",
    include_in_schema=False,
)
def analyze_stream(request: IngestionRequest):
    classify_usage = {}
    reply_usage = {}

    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=422,
            detail="Message cannot be empty.",
        )

    session_id = request.session_id or str(uuid4())

    try:
        UUID(session_id)
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="session_id must be a valid UUID.",
        )

    try:
        result, history = _classify_and_load_history(
            request,
            message,
            session_id,
            classify_usage,
        )

    except Exception as exc:
        print(
            f"Classification failed for session {session_id}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=USER_ERROR,
        ) from exc

    def events():
        yield _event({
            "type": "analysis",
            **result.model_dump(),
            "session_id": session_id,
        })

        parts = []

        try:
            for text in stream_response(
                result,
                history=history,
                current_message=message,
                usage=reply_usage,
            ):
                parts.append(text)

                yield _event({
                    "type": "token",
                    "text": text,
                })

            answer = "".join(parts).strip()

            if not answer:
                raise ValueError(
                    "The LLM returned an empty response."
                )

            _save_exchange(
                request,
                session_id,
                message,
                answer,
            )

            token_usage = TokenUsage.combine(
                classify_usage,
                reply_usage,
            )

            yield _event({
                "type": "done",
                "session_id": session_id,
                "token_usage": token_usage.model_dump(),
            })

        except Exception as exc:
            print(
                f"Streaming failed for session {session_id}: {exc}"
            )

            yield _event({
                "type": "error",
                "detail": USER_ERROR,
            })

    return StreamingResponse(
        events(),
        media_type="application/x-ndjson",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
