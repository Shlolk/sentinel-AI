from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── User Schemas ──

class UserSyncRequest(BaseModel):
    firebase_uid: str = Field(..., description="Firebase UID")
    email: str = Field(..., description="User email")


class UserResponse(BaseModel):
    id: int
    firebase_uid: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Project Schemas ──

class ProjectCreate(BaseModel):
    name: str
    domain: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    user_id: int
    name: str
    domain: Optional[str] = None
    description: Optional[str] = None
    overall_risk_score: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# ── Document Schemas ──

class DocumentResponse(BaseModel):
    id: int
    project_id: int
    file_name: str
    file_path: Optional[str] = None
    extracted_text: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ── Assumption Schemas ──

class AssumptionResponse(BaseModel):
    id: int
    project_id: int
    assumption: str
    category: Optional[str] = None
    health_score: Optional[int] = None
    status: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ExtractAssumptionsRequest(BaseModel):
    project_id: int


# ── Dashboard Schemas ──

class DashboardResponse(BaseModel):
    total_assumptions: int = 0
    healthy: int = 0
    warning: int = 0
    critical: int = 0
    overall_risk_score: float = 0


# ── Alert Schemas ──

class AlertResponse(BaseModel):
    id: int
    project_id: int
    title: Optional[str] = None
    message: Optional[str] = None
    severity: Optional[str] = None
    confidence: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Recommendation Schemas ──

class RecommendationResponse(BaseModel):
    id: int
    project_id: int
    recommendation: Optional[str] = None
    expected_risk_reduction: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Copilot Schemas ──

class CopilotRequest(BaseModel):
    project_id: int
    question: str


class CopilotResponse(BaseModel):
    answer: str


# ── Health ──

class HealthResponse(BaseModel):
    status: str
    database: str
