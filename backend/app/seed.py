import json
import os
from sqlalchemy.orm import Session
from .models.sql_models import Review, ReviewCategory


def seed_from_json(db: Session, json_path: str) -> int:
    if not os.path.exists(json_path):
        return 0

    # Only seed if there are no reviews
    existing = db.query(Review).count()
    if existing:
        return 0

    with open(json_path, "r", encoding="utf-8") as f:
        payload = json.load(f)
    items = payload.get("result", [])

    count = 0
    for it in items:
        review = Review(
            id=it.get("id"),
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
        for c in it.get("reviewCategory", []) or []:
            review.reviewCategory.append(
                ReviewCategory(
                    category=c.get("category", ""),
                    rating=int(c.get("rating", 0)),
                )
            )
        db.add(review)
        count += 1
    db.commit()
    return count


def sync_public_reviews(db: Session, json_path: str) -> int:
    if not os.path.exists(json_path):
        return 0
    with open(json_path, "r", encoding="utf-8") as f:
        payload = json.load(f)
    items = payload.get("result", [])
    updated = 0
    for it in items:
        rid = it.get("id")
        pr = it.get("publicReview")
        if not rid or not isinstance(pr, str):
            continue
        db_row = db.get(Review, rid)
        if db_row and db_row.publicReview != pr:
            db_row.publicReview = pr
            db.add(db_row)
            updated += 1
    if updated:
        db.commit()
    return updated


def sync_all_from_json(db: Session, json_path: str) -> dict:
    if not os.path.exists(json_path):
        return {"updated": 0, "created": 0}
    with open(json_path, "r", encoding="utf-8") as f:
        payload = json.load(f)
    items = payload.get("result", [])

    updated = 0
    created = 0

    for it in items:
        rid = it.get("id")
        if not rid:
            continue
        row = db.get(Review, rid)
        if row:
            # Preserve admin-controlled 'hidden'
            row.type = it.get("type", row.type)
            row.status = it.get("status", row.status)
            row.rating = it.get("rating")
            row.publicReview = it.get("publicReview", row.publicReview)
            row.submittedAt = it.get("submittedAt", row.submittedAt)
            row.guestName = it.get("guestName", row.guestName)
            row.listingName = it.get("listingName", row.listingName)
            row.channel = it.get("channel", row.channel)

            # Replace categories
            # Delete existing categories
            for c in list(row.reviewCategory or []):
                db.delete(c)
            # Add fresh categories
            for c in (it.get("reviewCategory") or []):
                row.reviewCategory.append(
                    ReviewCategory(
                        category=c.get("category", ""),
                        rating=int(c.get("rating", 0)),
                    )
                )
            db.add(row)
            updated += 1
        else:
            # Create
            row = Review(
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
                row.reviewCategory.append(
                    ReviewCategory(
                        category=c.get("category", ""),
                        rating=int(c.get("rating", 0)),
                    )
                )
            db.add(row)
            created += 1

    if updated or created:
        db.commit()
    return {"updated": updated, "created": created}
