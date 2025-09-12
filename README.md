# TheFlex Reviews

A full‑stack reviews dashboard that aggregates and manages guest/host reviews. The backend is a FastAPI service with SQLite via SQLAlchemy and optional integrations to Hostaway and Google Business Profile. The frontend is a Vite + React (TypeScript) single‑page app.

## Tech Stack
- Backend
  - FastAPI, Uvicorn
  - SQLAlchemy (SQLite by default)
  - httpx (optional, for external API calls)
  - google-auth (optional, for Google Business Profile)
- Frontend
  - React (TypeScript) + Vite
  - Axios
- Tooling
  - Python 3.10+
  - Node.js 18+

## Repository Structure
- `backend/`
  - `app/main.py`: FastAPI app entrypoint
  - `app/api/reviews.py`: Reviews API routes and optional external connectors
  - `app/models/`: SQLAlchemy ORM + Pydantic schemas
  - `app/mock_reviews.json`: Seed data loaded on startup
  - `requirements.txt`: Python dependencies
- `frontend/`
  - Vite + React app (TypeScript)
  - `vite.config.ts`: dev proxy for `/api` to `http://localhost:8000`

## Run Locally

### 1) Backend (FastAPI)
From the `backend/` directory:

```bash
# Python 3.10+
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run FastAPI (default: http://localhost:8000)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Notes:
- The database is SQLite by default and will be created as `backend/theflex.db`.
- On startup the app creates tables and seeds from `app/mock_reviews.json`.
- Optional external providers (Hostaway, Google) are guarded; if env vars are not set, they are skipped.
- Authorization: Hide/Show endpoints require a bearer token; default token is `theflex-demo`.

Example requests:
```bash
# Public (non-hidden) reviews
curl http://localhost:8000/api/reviews/hostaway

# Include hidden
curl -H "Authorization: Bearer theflex-demo" \
  "http://localhost:8000/api/reviews/hostaway?include_hidden=true"

# Hide / Show
curl -X PATCH -H "Authorization: Bearer theflex-demo" \
  http://localhost:8000/api/reviews/7453/hide

curl -X PATCH -H "Authorization: Bearer theflex-demo" \
  http://localhost:8000/api/reviews/7453/show
```

Optional environment variables (all are safe to omit):
- `DASHBOARD_TOKEN` – bearer token for hide/show (default: `theflex-demo`)
- Hostaway (skip if not configured):
  - `HOSTAWAY_CLIENT_ID`
  - `HOSTAWAY_CLIENT_SECRET`
  - `HOSTAWAY_AUTH_URL` (default included)
  - `HOSTAWAY_API_URL` (default included)
- Google Business Profile (skip if not configured):
  - `GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID`
  - `GOOGLE_SERVICE_ACCOUNT_JSON` (preferred; paste JSON)
  - or provide a `backend/app/service_account.json` file and leave JSON env unset

### 2) Frontend (Vite + React)
From the `frontend/` directory:

```bash
npm install
npm run dev # default: http://localhost:3000
```

Notes:
- During local dev, Vite proxies `/api` to `http://localhost:8000` (see `vite.config.ts`).
- Alternatively, you can set `VITE_API_BASE_URL` in a `.env` file to fully qualify API calls.

## Deployment (Recommended)
- Backend: Render (FastAPI)
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - If you want persistence with SQLite, add a Render Disk and point `DATABASE_URL=sqlite:////var/data/theflex.db`
  - Leave external provider env vars unset to skip remote fetches (safe)
- Frontend: Vercel (Vite)
  - Build command: `npm ci && npm run build`
  - Output directory: `dist`
  - Set `VITE_API_BASE_URL` to your Render backend URL (e.g., `https://<your-be>.onrender.com/api`)

## License
MIT
