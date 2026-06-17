from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Project
from app.schemas.schemas import ProjectCreate, ProjectResponse
from app.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(body: ProjectCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    project = Project(user_id=user_id, name=body.name, domain=body.domain, description=body.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("", response_model=List[ProjectResponse])
def list_projects(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.user_id == user_id).all()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
