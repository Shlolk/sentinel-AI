from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserSyncRequest, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/sync", response_model=UserResponse)
def sync_user(req: UserSyncRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.firebase_uid == req.firebase_uid).first()
    if user:
        user.email = req.email
        db.commit()
        db.refresh(user)
        return user

    user = User(firebase_uid=req.firebase_uid, email=req.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
