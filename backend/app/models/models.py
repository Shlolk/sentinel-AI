from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    domain = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    overall_risk_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="projects")
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    assumptions = relationship("Assumption", back_populates="project", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="project", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="project", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="documents")


class Assumption(Base):
    __tablename__ = "assumptions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assumption = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    health_score = Column(Integer, nullable=True)
    status = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="assumptions")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    severity = Column(String(50), nullable=True)
    confidence = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="alerts")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    recommendation = Column(Text, nullable=True)
    expected_risk_reduction = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="recommendations")
