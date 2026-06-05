from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models import MeetingStatus, Priority, ActionItemStatus


# User schemas
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None


class UserCreate(UserBase):
    password: Optional[str] = None


class User(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Meeting schemas
class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    meeting_date: datetime
    duration: Optional[int] = None


class MeetingCreate(MeetingBase):
    pass


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    meeting_date: Optional[datetime] = None
    duration: Optional[int] = None
    status: Optional[MeetingStatus] = None
    transcription: Optional[str] = None
    summary: Optional[str] = None


class Meeting(MeetingBase):
    id: str
    user_id: str
    status: MeetingStatus
    transcription: Optional[str] = None
    summary: Optional[str] = None
    audio_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    action_items: List["ActionItem"] = []

    class Config:
        from_attributes = True


# Action Item schemas
class ActionItemBase(BaseModel):
    content: str
    assignee: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: Priority = Priority.MEDIUM


class ActionItemCreate(ActionItemBase):
    meeting_id: str


class ActionItemUpdate(BaseModel):
    content: Optional[str] = None
    assignee: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: Optional[Priority] = None
    status: Optional[ActionItemStatus] = None
    synced_to: Optional[str] = None
    external_id: Optional[str] = None


class ActionItem(ActionItemBase):
    id: str
    meeting_id: str
    status: ActionItemStatus
    synced_to: Optional[str] = None
    external_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# User Settings schemas
class UserSettingsBase(BaseModel):
    email_notifications: bool = True
    daily_digest: bool = False
    auto_join_calendar_events: bool = False
    preferred_ai_model: str = "gpt-4"
    email_signature: Optional[str] = None


class UserSettingsCreate(UserSettingsBase):
    user_id: str


class UserSettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    daily_digest: Optional[bool] = None
    auto_join_calendar_events: Optional[bool] = None
    preferred_ai_model: Optional[str] = None
    email_signature: Optional[str] = None


class UserSettings(UserSettingsBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Process Meeting schemas
class ProcessMeetingRequest(BaseModel):
    meeting_id: str
    user_id: str
    audio_url: Optional[str] = None
    audio_data: Optional[str] = None  # Base64 encoded audio
    quality: str = "high"
    language: str = "en"


class ProcessMeetingResponse(BaseModel):
    success: bool
    meeting_id: str
    transcription: Optional[str] = None
    summary: Optional[str] = None
    action_items_count: int = 0
    message: str


# Email schemas
class EmailActionItemsRequest(BaseModel):
    meeting_id: str
    recipient_emails: List[str]
    include_summary: bool = True
    include_transcription: bool = False
    message: Optional[str] = None


class EmailActionItemsResponse(BaseModel):
    success: bool
    sent_count: int
    message: str
