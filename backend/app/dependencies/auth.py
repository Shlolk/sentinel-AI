from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.models import User


def get_current_user_id(
    x_firebase_uid: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> int:
    if not x_firebase_uid:
        raise HTTPException(status_code=401, detail="Missing x-firebase-uid header")
    user = db.query(User).filter(User.firebase_uid == x_firebase_uid).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found. Sync user first.")
    return user.id
