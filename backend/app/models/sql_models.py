from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from ..db import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    publicReview: Mapped[str] = mapped_column(String, nullable=False)
    submittedAt: Mapped[str] = mapped_column(String(32), nullable=False)
    guestName: Mapped[str] = mapped_column(String(200), nullable=False)
    listingName: Mapped[str] = mapped_column(String(200), nullable=False)
    channel: Mapped[str | None] = mapped_column(String(50), nullable=True)
    hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # Name this relationship to match Pydantic Review.reviewCategory
    reviewCategory: Mapped[list["ReviewCategory"]] = relationship(
        back_populates="review",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class ReviewCategory(Base):
    __tablename__ = "review_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    review_id: Mapped[int] = mapped_column(ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)

    review: Mapped[Review] = relationship(back_populates="reviewCategory")
