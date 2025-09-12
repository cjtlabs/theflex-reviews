from dotenv import load_dotenv
import os

load_dotenv()

DEFAULT_SQLITE_URL = "sqlite:///./theflex.db"


def get_database_url() -> str:
    # Prefer DATABASE_URL from environment (e.g., Render). If absent, use local SQLite.
    url = os.getenv("DATABASE_URL")
    if url:
        # Normalize common schemes if needed; keep SQLite/path URLs as-is
        if url.startswith("postgres://"):
            # Optional: support postgres if added later; SQLAlchemy 2 style driver
            url = url.replace("postgres://", "postgresql+psycopg://", 1)
        return url
    return DEFAULT_SQLITE_URL
