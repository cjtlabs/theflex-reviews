from dotenv import load_dotenv
import os

load_dotenv()

DEFAULT_SQLITE_URL = "sqlite:///./theflex.db"


def get_database_url() -> str:
    # Prefer DATABASE_URL from environment (e.g., Render). If absent, use local SQLite.
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    return DEFAULT_SQLITE_URL
