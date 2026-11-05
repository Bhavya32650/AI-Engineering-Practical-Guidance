
import logging
import os
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from app.schemas.assistant import AssistantResult
from app.schemas.ingestion import (
    IngestionRequest,
    TokenMetadata,
)
from app.services.llm_service import analyze_message
from app.services.response_service import generate_response
from app.utils.token_counter import estimate_tokens


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Enterprise Structured Ingestion Firewall",
    description=(
        "Validates incoming support messages, detects intent, "
        "and generates context-aware AI responses."
    ),
    version="2.0.0",
)

# Allow the local frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

MAX_INPUT_TOKENS = int(os.getenv("MAX_INPUT_TOKENS", "4000"))


@app.get("/health")
def health_check():
    """Check whether the API is running."""
    return {
        "status": "healthy",
        "service": "Enterprise Structured Ingestion Firewall",
    }


@app.post("/api/ingest", response_model=AssistantResult)
def ingest_message(request: IngestionRequest):
    """Detect intent and generate an AI response."""

    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=422,
            detail="Message cannot be empty.",
        )

    token_count = estimate_tokens(message)

    if token_count > MAX_INPUT_TOKENS:
        raise HTTPException(
            status_code=413,
            detail={
                "error": "Input exceeds the token limit.",
                "estimated_input_tokens": token_count,
                "token_limit": MAX_INPUT_TOKENS,
            },
        )

    try:
        # WEEK 1: Detect and classify the user's intent.
        result = analyze_message(message)

        # Add token metadata from Week 1.
        metadata = TokenMetadata(
            estimated_input_tokens=token_count,
            note=(
                "Estimated locally; may differ from provider "
                "token] counts."
            ),
        )

        result = result.model_copy(
            update={"token_metadata": metadata}
        )

        # WEEK 2: Generate a context-aware response using the LLM.
        response_markdown = generate_response(
            result,
            history=[],
            current_message=message,
        )

        # Return both Week 1 and Week 2 results.
        return AssistantResult(
            **result.model_dump(),
            session_id=str(uuid4()),
            response_markdown=response_markdown,
        )

    except ValidationError as error:
        logger.warning(
            "LLM response validation failed: %s", error
        )

        raise HTTPException(
            status_code=502,
            detail="The LLM returned data that failed validation.",
        ) from error

    except Exception as error:
        logger.exception("Message processing failed")

        raise HTTPException(
            status_code=502,
            detail="Unable to process the message using the LLM.",
        ) from error
