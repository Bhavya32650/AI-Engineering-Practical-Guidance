from pydantic import BaseModel, Field
from app.schemas.ingestion import IngestionResult


class TokenUsage(BaseModel):
    input_tokens: int = Field(default=0, ge=0)
    output_tokens: int = Field(default=0, ge=0)
    estimated: bool = False

    @classmethod
    def combine(cls, *usages: dict | None):
        valid_usages = [usage for usage in usages if usage]

        return cls(
            input_tokens=sum(u.get("input_tokens", 0) for u in valid_usages),
            output_tokens=sum(u.get("output_tokens", 0) for u in valid_usages),
            estimated=any(u.get("estimated", False) for u in valid_usages),
        )


class AssistantResult(IngestionResult):
    session_id: str = Field(min_length=1)
    response_markdown: str = Field(min_length=1)
    token_usage: TokenUsage = Field(default_factory=TokenUsage)