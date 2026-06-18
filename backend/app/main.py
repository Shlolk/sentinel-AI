from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, SessionLocal, Base
from app.config import get_settings

from app.routes import users, projects, documents, assumptions, dashboard, alerts, recommendations, copilot

settings = get_settings()

app = FastAPI(
    title="Sentinel AI API",
    description="Backend for Sentinel AI — assumption intelligence platform",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "https://sentinel-ai-frontend.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(projects.router)
app.include_router(documents.router)
app.include_router(assumptions.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)
app.include_router(recommendations.router)
app.include_router(copilot.router)


@app.get("/health")
def health_check():
    db_status = "disconnected"
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
            db_status = "connected"
    except Exception:
        db_status = "disconnected"
    return {"status": "healthy", "database": db_status}
