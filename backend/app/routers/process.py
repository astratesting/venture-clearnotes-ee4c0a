import base64
import os
from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Meeting, MeetingStatus, ActionItem, ActionItemStatus, Priority, UserSettings
from app.schemas import ProcessMeetingRequest, ProcessMeetingResponse, EmailActionItemsRequest, EmailActionItemsResponse
from app.services import transcription_service, ai_service, email_service

router = APIRouter(prefix="/api/process", tags=["process"])


def verify_api_key(x_api_key: str = Header(...)):
    expected_key = os.getenv("API_KEY", "")
    if not expected_key:
        return True  # No key required in dev
    if x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True


@router.post("/meeting", response_model=ProcessMeetingResponse)
async def process_meeting(
    request: ProcessMeetingRequest,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_api_key)
):
    """
    Process a meeting: transcribe audio, generate summary, and extract action items
    """
    try:
        # Update meeting status to processing
        meeting = db.query(Meeting).filter(Meeting.id == request.meeting_id).first()
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")

        meeting.status = MeetingStatus.PROCESSING
        db.commit()

        # Get user settings
        user_settings = db.query(UserSettings).filter(
            UserSettings.user_id == request.user_id
        ).first()
        settings_dict = {
            "email_notifications": user_settings.email_notifications if user_settings else True,
            "daily_digest": user_settings.daily_digest if user_settings else False,
            "preferred_ai_model": user_settings.preferred_ai_model if user_settings else "gpt-4",
        }

        # Transcribe audio
        audio_data = None
        if request.audio_data:
            audio_data = base64.b64decode(request.audio_data)
        elif request.audio_url:
            # In production, this would download from the provided URL
            # For now, we'll use the provided base64 data
            raise HTTPException(status_code=400, detail="Base64 audio data is required")

        if not audio_data:
            meeting.status = MeetingStatus.FAILED
            db.commit()
            raise HTTPException(status_code=400, detail="No audio data provided")

        transcription = await transcription_service.transcribe_audio(
            audio_data,
            file_name="meeting_audio.mp3",
            language=request.language
        )

        # Update meeting with transcription
        meeting.transcription = transcription
        db.commit()

        # Process with AI
        result = ai_service.process_meeting(transcription, settings_dict)

        # Update meeting with summary
        meeting.summary = result["summary"]

        # Create action items
        for item_data in result["action_items"]:
            action_item = ActionItem(
                meeting_id=meeting.id,
                content=item_data["content"],
                assignee=item_data.get("assignee"),
                priority=Priority(item_data.get("priority", "MEDIUM")),
                status=ActionItemStatus.PENDING
            )
            db.add(action_item)

        meeting.status = MeetingStatus.COMPLETED
        db.commit()

        # Send email notification if enabled
        if settings_dict.get("email_notifications", True):
            # Get user email
            user = meeting.user
            if user and user.email:
                email_service.send_action_items_email(
                    to_emails=[user.email],
                    meeting_title=meeting.title,
                    action_items=result["action_items"],
                    summary=result["summary"],
                    meeting_date=meeting.meeting_date,
                    signature=user_settings.email_signature if user_settings else None
                )

        return ProcessMeetingResponse(
            success=True,
            meeting_id=meeting.id,
            transcription=transcription,
            summary=result["summary"],
            action_items_count=len(result["action_items"]),
            message="Meeting processed successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        # Update meeting status to failed
        meeting = db.query(Meeting).filter(Meeting.id == request.meeting_id).first()
        if meeting:
            meeting.status = MeetingStatus.FAILED
            db.commit()

        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@router.post("/reprocess/{meeting_id}", response_model=ProcessMeetingResponse)
async def reprocess_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_api_key)
):
    """
    Reprocess a meeting using existing transcription
    """
    try:
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")

        if not meeting.transcription:
            raise HTTPException(status_code=400, detail="No transcription available to reprocess")

        # Get user settings
        user_settings = db.query(UserSettings).filter(
            UserSettings.user_id == meeting.user_id
        ).first()
        settings_dict = {
            "preferred_ai_model": user_settings.preferred_ai_model if user_settings else "gpt-4",
        }

        meeting.status = MeetingStatus.PROCESSING
        db.commit()

        # Delete existing action items
        db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).delete()

        # Process with AI
        result = ai_service.process_meeting(meeting.transcription, settings_dict)

        # Update meeting
        meeting.summary = result["summary"]

        # Create new action items
        for item_data in result["action_items"]:
            action_item = ActionItem(
                meeting_id=meeting.id,
                content=item_data["content"],
                assignee=item_data.get("assignee"),
                priority=Priority(item_data.get("priority", "MEDIUM")),
                status=ActionItemStatus.PENDING
            )
            db.add(action_item)

        meeting.status = MeetingStatus.COMPLETED
        db.commit()

        return ProcessMeetingResponse(
            success=True,
            meeting_id=meeting.id,
            summary=result["summary"],
            action_items_count=len(result["action_items"]),
            message="Meeting reprocessed successfully"
        )

    except HTTPException:
        raise
    except Exception as e:
        meeting.status = MeetingStatus.FAILED
        db.commit()
        raise HTTPException(status_code=500, detail=f"Reprocessing failed: {str(e)}")


@router.post("/email-action-items", response_model=EmailActionItemsResponse)
async def email_action_items(
    request: EmailActionItemsRequest,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_api_key)
):
    """
    Send action items via email to specified recipients
    """
    try:
        meeting = db.query(Meeting).filter(Meeting.id == request.meeting_id).first()
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")

        action_items = db.query(ActionItem).filter(
            ActionItem.meeting_id == request.meeting_id
        ).all()

        if not action_items:
            raise HTTPException(status_code=400, detail="No action items to send")

        # Prepare action items data
        items_data = [
            {
                "content": item.content,
                "assignee": item.assignee,
                "priority": item.priority.value,
                "deadline": item.deadline.isoformat() if item.deadline else None
            }
            for item in action_items
        ]

        summary = meeting.summary if request.include_summary else None
        transcription = meeting.transcription if request.include_transcription else None

        success = email_service.send_action_items_email(
            to_emails=request.recipient_emails,
            meeting_title=meeting.title,
            action_items=items_data,
            summary=summary,
            meeting_date=meeting.meeting_date
        )

        if success:
            return EmailActionItemsResponse(
                success=True,
                sent_count=len(request.recipient_emails),
                message=f"Action items sent to {len(request.recipient_emails)} recipient(s)"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")
