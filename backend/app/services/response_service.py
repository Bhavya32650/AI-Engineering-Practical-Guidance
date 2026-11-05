import json
from groq import Groq

from app.config import GROQ_API_KEY, GROQ_MODEL
from app.schemas.ingestion import IngestionResult

RESPONSE_SYSTEM_PROMPT = """
You are a helpful customer-support assistant.
Write a clear, practical answer in Markdown.
Use the current intent analysis and conversation history.
If context is insufficient, ask one short clarifying question.
Do not invent account, order, or payment data.
Return only the Markdown answer, without JSON.
""".strip()


def generate_response(
    intent_result: IngestionResult,
    history: list[dict[str, str]] | None = None,
    current_message: str | None = None,
) -> str:

    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is missing.")

    intent_context = {
        "intent": intent_result.intent,
        "summary": intent_result.summary,
        "risk_profile": intent_result.risk_profile,
        "priority": intent_result.priority,
        "requires_action": intent_result.requires_action,
    }

    messages = [
        {"role": "system", "content": RESPONSE_SYSTEM_PROMPT}
    ]

    messages.extend(history or [])

    messages.append({
        "role": "user",
        "content": (
            f"Current message:\n{current_message or intent_result.summary}\n\n"
            f"Current intent analysis:\n"
            f"{json.dumps(intent_context, ensure_ascii=False)}"
        ),
    })

    client = Groq(api_key=GROQ_API_KEY)

    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.3,
        max_tokens=1200,
        messages=messages,
    )

    answer = completion.choices[0].message.content

    if not answer or not answer.strip():
        raise ValueError("The LLM returned an empty response.")

    return answer.strip()