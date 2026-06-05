from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from app.database import SessionLocal, engine, Base
from app.routers import process

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ClearNotes API",
    description="AI-powered meeting transcription and action item extraction",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    os.getenv("FRONTEND_URL", "")
]
origins = [o for o in origins if o]  # Remove empty strings

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {
        "message": "Welcome to ClearNotes API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "api": "up",
            "database": "up"
        }
    }


# Include routers
app.include_router(process.router)


@app.get("/api/meetings/{meeting_id}/status")
async def get_meeting_status(meeting_id: str, db: Session = Depends(get_db)):
    """Get the processing status of a meeting"""
    from app.models import Meeting, MeetingStatus

    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    return {
        "meeting_id": meeting.id,
        "status": meeting.status.value,
        "has_transcription": meeting.transcription is not None,
        "has_summary": meeting.summary is not None,
        "action_items_count": len(meeting.action_items)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
