from fastapi import APIRouter, Depends, HTTPException, Header
import os
import zlib
from sqlalchemy.orm import Session, selectinload
from app.db import get_db
from app.models.sql_models import Review as ReviewORM, ReviewCategory as ReviewCategoryORM
from app.models.review import Review, ReviewResponse
from typing import Any, Optional

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


TOKEN = os.getenv("DASHBOARD_TOKEN", "theflex-demo")
# HOSTAWAY API
HOSTAWAY_AUTH_URL = os.getenv("HOSTAWAY_AUTH_URL", "https://api.hostaway.com/v1/accessTokens")
HOSTAWAY_API_URL = os.getenv("HOSTAWAY_API_URL", "https://api.hostaway.com/v1/reviews")
HOSTAWAY_CLIENT_ID = os.getenv("HOSTAWAY_CLIENT_ID", "hostaway")
HOSTAWAY_CLIENT_SECRET = os.getenv("HOSTAWAY_CLIENT_SECRET", "secret")
# GOOGLE REVIEWS API (GOOGLE BUSINESS PROFILE API)
GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID = os.getenv("GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID", "google")
GOOGLE_SERVICE_ACCOUNT_FILE = "service_account.json"
GOOGLE_BUSINESS_PROFILE_API_SCOPES = ["https://www.googleapis.com/auth/business.manage"]


@router.get("/hostaway", response_model=ReviewResponse)
def get_reviews(
    include_hidden: bool = False,
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    # Fetch and upsert external reviews (Hostaway and Google) only when configured
    try:
        combined: list[dict] = []

        # Hostaway: only call if client creds are provided
        hostaway = None
        if os.getenv("HOSTAWAY_CLIENT_ID") and os.getenv("HOSTAWAY_CLIENT_SECRET"):
            hostaway = get_hostaway_reviews()
        if hostaway:
            combined.extend(hostaway)

        # Google: only call if service account credentials are available (env JSON or file)
        google = None
        if os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON") or os.path.exists(GOOGLE_SERVICE_ACCOUNT_FILE):
            google = get_google_business_profile_reviews()
        if google:
            combined.extend(google)

        if combined:
            upsert_reviews_from_normalized(db, combined)
    except Exception:
        # Don't fail the endpoint if external providers are unavailable
        pass

    query = db.query(ReviewORM).options(selectinload(ReviewORM.reviewCategory))
    if include_hidden:
        if authorization != f"Bearer {TOKEN}":
            raise HTTPException(status_code=401, detail="Unauthorized")
    else:
        query = query.filter(ReviewORM.hidden.is_(False))
    rows = query.order_by(ReviewORM.submittedAt.desc()).all()
    return {"status": "success", "result": rows}


@router.patch("/{review_id}/hide", response_model=Review)
def hide_review(
    review_id: int,
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if authorization != f"Bearer {TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    review = db.get(ReviewORM, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.hidden = True
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.patch("/{review_id}/show", response_model=Review)
def show_review(
    review_id: int,
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if authorization != f"Bearer {TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    review = db.get(ReviewORM, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.hidden = False
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_hostaway_access_token() -> str | None:
    try:
        import httpx
        resp = httpx.post(
            HOSTAWAY_AUTH_URL,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "grant_type": "client_credentials",
                "client_id": HOSTAWAY_CLIENT_ID,
                "client_secret": HOSTAWAY_CLIENT_SECRET,
                "scope": "general",
            },
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            return data.get("access_token")
        return None
    except Exception:
        return None


def get_hostaway_reviews():
    try:
        token = get_hostaway_access_token()
        if not token:
            return None

        import httpx
        resp = httpx.get(
            HOSTAWAY_API_URL,
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            return normalize_hostaway_response(data)
        return None
    except Exception:
        return None


def normalize_hostaway_response(data: Any) -> list[dict]:
    """Normalize Hostaway API response to canonical Review dicts."""
    items: list[dict] = []
    if not data:
        return items
    # Try to find the list of reviews in common keys
    candidates: list = []
    if isinstance(data, dict):
        for key in ("result", "results", "data", "reviews", "list"):
            val = data.get(key)
            if isinstance(val, list):
                candidates = val
                break
        if not candidates:
            for val in data.values():
                if isinstance(val, list):
                    candidates = val
                    break
    elif isinstance(data, list):
        candidates = data
    for it in candidates or []:
        if not isinstance(it, dict):
            continue
        rid = it.get("id") or it.get("reviewId") or it.get("reservationId")
        try:
            rid_int = int(rid) if rid is not None else None
        except Exception:
            # skip items without a usable integer id
            continue
        rating_val = it.get("rating") or it.get("overall") or it.get("stars")
        try:
            rating_int = int(rating_val) if rating_val is not None else None
        except Exception:
            rating_int = None
        # Categories can be list or dict
        categories: list[dict] = []
        rc = it.get("reviewCategory") or it.get("categories") or it.get("ratings") or it.get("scores") or {}
        if isinstance(rc, list):
            for c in rc:
                if not isinstance(c, dict):
                    continue
                cat = c.get("category") or c.get("name")
                score = c.get("rating") or c.get("score") or c.get("value")
                if cat is not None and score is not None:
                    try:
                        categories.append({"category": str(cat), "rating": int(score)})
                    except Exception:
                        pass
        elif isinstance(rc, dict):
            for cat, score in rc.items():
                if score is not None:
                    try:
                        categories.append({"category": str(cat), "rating": int(score)})
                    except Exception:
                        pass
        # Fallback specific keys for known categories
        for key in ("cleanliness", "communication", "respect_house_rules", "accuracy", "location", "value", "check_in"):
            if key in it and it.get(key) is not None:
                try:
                    categories.append({"category": key, "rating": int(it.get(key))})
                except Exception:
                    pass
        items.append(
            {
                "id": rid_int,
                "type": it.get("type", "host-to-guest"),
                "status": it.get("status", "published"),
                "rating": rating_int,
                "publicReview": it.get("publicReview") or it.get("comment") or it.get("review") or it.get("text") or "",
                "submittedAt": it.get("submittedAt") or it.get("createdAt") or it.get("createTime") or "",
                "guestName": it.get("guestName") or (it.get("guest") or {}).get("name") or (it.get("reviewer") or {}).get("displayName") or "",
                "listingName": it.get("listingName") or (it.get("listing") or {}).get("name") or it.get("propertyName") or "",
                "channel": it.get("channel") or it.get("source") or "Hostaway",
                "hidden": False,
                "reviewCategory": categories,
            }
        )
    return items


def upsert_reviews_from_normalized(db: Session, items: list[dict]) -> dict:
    """Upsert a list of normalized review dicts into the database.

    Preserves the 'hidden' flag on existing rows and replaces categories to
    match the provided payload. Returns counts of updated and created rows.
    """
    updated = 0
    created = 0
    seen: set[int] = set()

    for it in items or []:
        if not isinstance(it, dict):
            continue
        rid = it.get("id")
        if not isinstance(rid, int):
            # skip items without a proper integer id
            continue
        if rid in seen:
            continue
        seen.add(rid)

        row = db.get(ReviewORM, rid)
        if row:
            # Preserve admin-controlled 'hidden'
            hidden_val = row.hidden
            row.type = it.get("type", row.type)
            row.status = it.get("status", row.status)
            row.rating = it.get("rating")
            row.publicReview = it.get("publicReview", row.publicReview)
            row.submittedAt = it.get("submittedAt", row.submittedAt)
            row.guestName = it.get("guestName", row.guestName)
            row.listingName = it.get("listingName", row.listingName)
            row.channel = it.get("channel", row.channel)

            # Replace categories
            for c in list(row.reviewCategory or []):
                db.delete(c)
            for c in (it.get("reviewCategory") or []):
                try:
                    row.reviewCategory.append(
                        ReviewCategoryORM(
                            category=str(c.get("category", "")),
                            rating=int(c.get("rating", 0)),
                        )
                    )
                except Exception:
                    # skip malformed category entries
                    pass

            row.hidden = hidden_val
            db.add(row)
            updated += 1
        else:
            # Create new row
            row = ReviewORM(
                id=rid,
                type=it.get("type", "host-to-guest"),
                status=it.get("status", "published"),
                rating=it.get("rating"),
                publicReview=it.get("publicReview", ""),
                submittedAt=it.get("submittedAt", ""),
                guestName=it.get("guestName", ""),
                listingName=it.get("listingName", ""),
                channel=it.get("channel"),
                hidden=False,
            )
            for c in (it.get("reviewCategory") or []):
                try:
                    row.reviewCategory.append(
                        ReviewCategoryORM(
                            category=str(c.get("category", "")),
                            rating=int(c.get("rating", 0)),
                        )
                    )
                except Exception:
                    pass
            db.add(row)
            created += 1

    if updated or created:
        db.commit()
    return {"updated": updated, "created": created}


def get_google_service_account_access_token() -> Optional[str]:
    try:
        from google.oauth2 import service_account
        import google.auth.transport.requests
        import json

        json_env = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        if json_env:
            info = json.loads(json_env)
            credentials = service_account.Credentials.from_service_account_info(
                info, scopes=GOOGLE_BUSINESS_PROFILE_API_SCOPES
            )
        else:
            credentials = service_account.Credentials.from_service_account_file(
                GOOGLE_SERVICE_ACCOUNT_FILE, scopes=GOOGLE_BUSINESS_PROFILE_API_SCOPES
            )
        credentials.refresh(google.auth.transport.requests.Request())
        return credentials.token
    except Exception:
        return None


def get_google_business_profile_reviews():
    token = get_google_service_account_access_token()
    if not token:
        return None
    url = f"https://mybusiness.googleapis.com/v4/accounts/{GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID}/locations:batchGetReviews"
    headers = {"Authorization": f"Bearer {token}"}

    # If you know your location IDs, pass them in locationNames
    payload = {"locationNames": []}

    import httpx
    with httpx.Client(timeout=10) as client:
        resp = client.post(url, headers=headers, json=payload)
        resp.raise_for_status()  # raises if status != 2xx
        data = resp.json()
        return normalize_google_response(data)


def normalize_google_response(data: Any) -> list[dict]:
    items: list[dict] = []
    if not data:
        return items

    # 'batchGetReviews' style
    container_keys = ("locationReviews", "locations")
    reviews_key = "reviews"

    def _star_to_int(v: Any) -> Optional[int]:
        if v is None:
            return None
        if isinstance(v, (int, float)):
            try:
                return int(v)
            except Exception:
                return None
        if isinstance(v, str):
            mapping = {
                "ONE": 1,
                "TWO": 2,
                "THREE": 3,
                "FOUR": 4,
                "FIVE": 5,
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5,
            }
            return mapping.get(v.upper())
        return None

    containers = []
    if isinstance(data, dict):
        for ck in container_keys:
            val = data.get(ck)
            if isinstance(val, list):
                containers = val
                break
        if not containers and isinstance(data.get(reviews_key), list):
            # Top-level 'reviews'
            containers = [{"locationName": "", "reviews": data.get(reviews_key)}]
    elif isinstance(data, list):
        containers = data

    for container in containers or []:
        if not isinstance(container, dict):
            continue
        location_name = container.get("locationName") or ""
        for r in (container.get(reviews_key) or []):
            if not isinstance(r, dict):
                continue
            rid = r.get("reviewId") or r.get("name")
            # Derive a stable integer id and namespace Google ids as negative to avoid conflicts
            rid_int: Optional[int] = None
            if isinstance(rid, int):
                rid_int = -abs(rid)
            elif isinstance(rid, str):
                tail = rid.split("/")[-1]
                try:
                    rid_int = -abs(int(tail))
                except Exception:
                    rid_int = -abs(int(zlib.crc32(rid.encode("utf-8"))))
            else:
                continue

            rating_int = _star_to_int(r.get("starRating") or r.get("rating"))
            reviewer = r.get("reviewer") or {}
            items.append(
                {
                    "id": rid_int,
                    "type": "guest-to-host",
                    "status": "published",
                    "rating": rating_int,
                    "publicReview": r.get("comment") or r.get("text") or "",
                    "submittedAt": r.get("createTime") or r.get("updateTime") or "",
                    "guestName": reviewer.get("displayName") or "Google User",
                    "listingName": location_name,
                    "channel": "Google",
                    "hidden": False,
                    "reviewCategory": [],
                }
            )
    return items