from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models.models import Project, Assumption, Alert, Recommendation
from app.schemas.schemas import CopilotRequest, CopilotResponse
from app.dependencies.auth import get_current_user_id
from app.services.gemini_service import copilot_chat

router = APIRouter(prefix="/copilot", tags=["Copilot"])


@router.post("/chat", response_model=CopilotResponse)
def chat(
    body: CopilotRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == body.project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    assumptions = db.query(Assumption).filter(Assumption.project_id == body.project_id).all()
    alerts = db.query(Alert).filter(Alert.project_id == body.project_id).all()
    recs = db.query(Recommendation).filter(Recommendation.project_id == body.project_id).all()

    data = {
        "project": {"name": project.name, "domain": project.domain, "description": project.description},
        "assumptions": [{"assumption": a.assumption, "category": a.category, "health_score": a.health_score, "status": a.status} for a in assumptions],
        "alerts": [{"title": a.title, "message": a.message, "severity": a.severity} for a in alerts],
        "recommendations": [{"recommendation": r.recommendation, "expected_risk_reduction": r.expected_risk_reduction} for r in recs],
    }

    answer = copilot_chat(json.dumps(data, indent=2), body.question)
    return CopilotResponse(answer=answer)
