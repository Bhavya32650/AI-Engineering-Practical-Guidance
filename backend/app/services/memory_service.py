
from uuid import uuid4

# Store conversations in memory
chat_sessions = {}


def create_session():
    session_id = str(uuid4())
    chat_sessions[session_id] = []
    return session_id


def get_history(session_id):
    if session_id not in chat_sessions:
        raise ValueError("Session not found")

    return chat_sessions[session_id].copy()


def save_message(session_id, role, content):
    if session_id not in chat_sessions:
        raise ValueError("Session not found")

    if role not in ("user", "assistant"):
        raise ValueError("Invalid message role")

    chat_sessions[session_id].append({
        "role": role,
        "content": content
    })
