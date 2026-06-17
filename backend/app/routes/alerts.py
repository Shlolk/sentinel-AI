from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Project, Alert
from app.schemas.schemas import AlertResponse
from app.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/{project_id}", response_model=List[AlertResponse])
def get_alerts(
    project_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.query(Alert).filter(Alert.project_id == project_id).order_by(Alert.created_at.desc()).all()
