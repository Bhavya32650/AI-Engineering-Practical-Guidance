
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


# Allowed intent categories
Intent = Literal[
    "greeting",
    "order_tracking",
    "payment_issue",
    "current_time",
    "general_question",
    "unknown",
]

# Allowed risk levels
RiskProfile = Literal[
    "low",
    "medium",
    "high",
    "unknown",
]

# Allowed priority levels
Priority = Literal[
    "low",
    "medium",
    "high",
]


# Conversation history message
class ChatHistoryMessage(BaseModel):
    role: Literal["user", "assistant"]

    content: str = Field(min_length=1)

    @field_validator("content")
    @classmethod
    def content_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Chat message cannot be blank.")

        return value


# Main API request
class IngestionRequest(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "properties": {
                "session_id": {
                    "anyOf": [
                        {"type": "string", "minLength": 1, "maxLength": 100},
                        {"type": "null"},
                    ],
                    "default": None,
                    "description": "Optional conversation session identifier.",
                },
                "message": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 5000,
                    "description": "The user's original message.",
                    "examples": ["Where is my order?"],
                },
            },
            "required": ["message"],
        },
    )

    session_id: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Optional conversation session identifier.",
    )

    message: str = Field(
        min_length=1,
        max_length=5000,
        description="The user's original message.",
        examples=["Where is my order?"],
    )

    # Internal fields: not displayed in Swagger schema
    incognito: bool = False

    history: list[ChatHistoryMessage] = Field(
        default_factory=list
    )

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Message cannot contain only whitespace.")

        return value


# Token metadata
class TokenMetadata(BaseModel):
    estimated_input_tokens: int = Field(
        default=0,
        ge=0,
    )

    note: str = (
        "Estimated locally; may differ from provider token counts."
    )


# Intent analysis result
class IngestionResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    intent: Intent

    risk_profile: RiskProfile

    priority: Priority

    requires_action: bool

    summary: str = Field(
        min_length=1,
        max_length=500,
    )

    token_metadata: TokenMetadata = Field(
        default_factory=TokenMetadata
    )


# Rename conversation request
class RenameRequest(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=100,
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Title cannot be empty.")

        return value

