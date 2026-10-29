
import logging
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from app.schemas.ingestion import (
    IngestionRequest,
    IngestionResult,
    TokenMetadata,
)
from app.services.llm_service import analyze_message
from app.utils.token_counter import estimate_tokens


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Enterprise Structured Ingestion Firewall",
    description=(
        "Validates incoming support messages and converts them "
        "into structured, validated JSON using an LLM."
    ),
    version="1.0.0",
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


@app.post("/api/ingest", response_model=IngestionResult)
def ingest_message(request: IngestionRequest):
    """Validate, classify, and return structured JSON."""

    token_count = estimate_tokens(request.message)

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
        result = analyze_message(request.message)

        metadata = TokenMetadata(
            estimated_input_tokens=token_count,
            note=(
                "Estimated locally; may differ from provider "
                "token counts."
            ),
        )

        result = result.model_copy(
            update={"token_metadata": metadata}
        )

        return result

    except ValidationError as error:
        logger.warning(
            "LLM response validation failed: %s", error
        )
        raise HTTPException(
            status_code=502,
            detail="The LLM returned data that failed validation.",
        ) from error

    except Exception as error:
        logger.exception("Message ingestion failed")
        raise HTTPException(
            status_code=502,
            detail="Unable to process the message using the LLM.",
        ) from error
