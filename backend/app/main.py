from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import reviews
from app.db import init_db, SessionLocal, engine
from app.seed import seed_from_json, sync_all_from_json
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://theflex-reviews-cyan.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(reviews.router)


@app.on_event("startup")
def on_startup():
    # Create tables
    init_db()
    # Lightweight migration: add 'channel' column if it doesn't exist yet
    try:
        # Ensure DDL is committed (SQLAlchemy 2.0 uses transactional DDL)
        with engine.begin() as conn:
            # SQLite-only check for existing columns
            rows = conn.exec_driver_sql("PRAGMA table_info(reviews)").fetchall()
            cols = {r[1] for r in rows}
            if "channel" not in cols:
                conn.exec_driver_sql("ALTER TABLE reviews ADD COLUMN channel VARCHAR(50)")
    except Exception:
        # Non-fatal; continue startup even if migration step fails
        pass
    # Seed once if empty
    json_path = os.path.join(os.path.dirname(__file__), "mock_reviews.json")
    with SessionLocal() as db:
        seed_from_json(db, json_path)
        # Fully synchronize DB rows and categories with mock JSON while preserving 'hidden'
        sync_all_from_json(db, json_path)
