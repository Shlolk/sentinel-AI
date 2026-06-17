from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Assumption, Project, Document
from app.schemas.schemas import AssumptionResponse, ExtractAssumptionsRequest
from app.dependencies.auth import get_current_user_id
from app.services.gemini_service import extract_assumptions, generate_recommendations
from app.models.models import Recommendation, Alert

router = APIRouter(prefix="/assumptions", tags=["Assumptions"])


@router.post("/extract", response_model=List[AssumptionResponse])
def extract_assumptions_route(
    body: ExtractAssumptionsRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == body.project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    doc = db.query(Document).filter(Document.project_id == body.project_id).order_by(Document.uploaded_at.desc()).first()
    if not doc or not doc.extracted_text:
        raise HTTPException(status_code=400, detail="No document with extracted text found for this project")

    results = extract_assumptions(doc.extracted_text)

    db.query(Assumption).filter(Assumption.project_id == body.project_id).delete()
    saved = []
    for r in results:
        a = Assumption(
            project_id=body.project_id,
            assumption=r["assumption"],
            category=r.get("category"),
            health_score=r.get("health_score"),
            status=r.get("status", "healthy"),
        )
        db.add(a)
        saved.append(a)

    recs = generate_recommendations(results)
    db.query(Recommendation).filter(Recommendation.project_id == body.project_id).delete()
    for r in recs:
        rec = Recommendation(
            project_id=body.project_id,
            recommendation=r.get("title", ""),
            expected_risk_reduction=r.get("expected_risk_reduction"),
        )
        db.add(rec)

    critical_count = sum(1 for r in results if r.get("status") == "critical")
    if critical_count > 0:
        alert = Alert(
            project_id=body.project_id,
            title=f"{critical_count} critical assumption(s) detected",
            message=f"Assumption extraction found {critical_count} critical risk(s) requiring immediate attention.",
            severity="critical",
        )
        db.add(alert)

    db.commit()
    for a in saved:
        db.refresh(a)
    return saved


@router.get("/{project_id}", response_model=List[AssumptionResponse])
def list_assumptions(
    project_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.query(Assumption).filter(Assumption.project_id == project_id).all()
