import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Document, Project
from app.schemas.schemas import DocumentResponse
from app.dependencies.auth import get_current_user_id
from app.services.document_processor import extract_text_from_file

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx"}

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    project_id: int,
    file: UploadFile = File(...),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}. Allowed: PDF, DOCX")

    safe_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    content = file.file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    extracted = extract_text_from_file(file_path, ext)

    doc = Document(
        project_id=project_id,
        file_name=file.filename or safe_name,
        file_path=file_path,
        extracted_text=extracted,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/{project_id}", response_model=List[DocumentResponse])
def list_documents(
    project_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.query(Document).filter(Document.project_id == project_id).all()
