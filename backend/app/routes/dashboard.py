from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Project, Assumption
from app.schemas.schemas import DashboardResponse
from app.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/{project_id}", response_model=DashboardResponse)
def get_dashboard(
    project_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    assumptions = db.query(Assumption).filter(Assumption.project_id == project_id).all()
    total = len(assumptions)
    healthy = sum(1 for a in assumptions if a.status == "healthy")
    warning = sum(1 for a in assumptions if a.status == "warning")
    critical = sum(1 for a in assumptions if a.status == "critical")

    scores = [a.health_score for a in assumptions if a.health_score is not None]
    overall_risk_score = round(sum(scores) / len(scores), 1) if scores else 0

    return DashboardResponse(
        total_assumptions=total,
        healthy=healthy,
        warning=warning,
        critical=critical,
        overall_risk_score=overall_risk_score,
    )
