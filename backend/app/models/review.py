from pydantic import BaseModel, ConfigDict
from typing import Optional, List


class ReviewCategory(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    category: str
    rating: int


class Review(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    status: str
    rating: Optional[int]
    publicReview: str
    submittedAt: str
    guestName: str
    listingName: str
    channel: Optional[str] = None
    hidden: bool = False
    reviewCategory: List[ReviewCategory]
    
class ReviewResponse(BaseModel):
    status: str
    result: List[Review]
