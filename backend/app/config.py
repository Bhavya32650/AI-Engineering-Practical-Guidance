import os
from pathlib import Path

from dotenv import load_dotenv

# Load backend/.env
BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env")
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

GROQ_MODEL = os.getenv(
    "GROQ_MODEL", "llama-3.3-70b-versatile"
).strip()

# Frontend allowed origins
ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5174",
    "http://127.0.0.1:5175",
    "http://localhost:5175",
    "http://127.0.0.1:5176",
    "http://localhost:5176",
    "http://127.0.0.1:4173",
    "http://localhost:4173",
    "https://ai-engineering-practical-guidance.vercel.app"
]

# Archive retention setting
ARCHIVE_RETENTION_DAYS = int(
    os.getenv("ARCHIVE_RETENTION_DAYS", "30")
)

# Database settings
SQLITE_PATH = str(
    BACKEND_DIR / (
        os.getenv("SQLITE_PATH", "").strip() or "data/chat.db"
    )
)

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
