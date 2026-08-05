from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from app.models.models import RoleEnum, TicketStatusEnum, TicketPriorityEnum

# Auth Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignUpRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    organization_name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

# User & Org Schemas
class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    organization_id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    brand_color: str
    support_email: Optional[str] = None

    class Config:
        from_attributes = True

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    brand_color: Optional[str] = None
    support_email: Optional[str] = None
    logo_url: Optional[str] = None

# Customer Schemas
class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None

class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    ticket_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Ticket Schemas
class TicketCreate(BaseModel):
    subject: str
    description: str
    category: str = "General Support"
    priority: TicketPriorityEnum = TicketPriorityEnum.MEDIUM
    customer_id: str
    assigned_agent_id: Optional[str] = None

class TicketUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[TicketPriorityEnum] = None
    status: Optional[TicketStatusEnum] = None
    assigned_agent_id: Optional[str] = None

class TicketMergeRequest(BaseModel):
    target_ticket_id: str
    source_ticket_ids: List[str]

class TicketMessageCreate(BaseModel):
    message: str
    sender_type: str = "agent" # agent or customer

class InternalNoteCreate(BaseModel):
    note_text: str

class AttachmentResponse(BaseModel):
    id: str
    filename: str
    file_url: str
    file_size: int
    mime_type: str
    created_at: datetime

    class Config:
        from_attributes = True

class TicketMessageResponse(BaseModel):
    id: str
    ticket_id: str
    sender_type: str
    sender_id: str
    sender_name: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class InternalNoteResponse(BaseModel):
    id: str
    ticket_id: str
    user_id: str
    user_name: str
    note_text: str
    created_at: datetime

    class Config:
        from_attributes = True

class TicketResponse(BaseModel):
    id: str
    ticket_number: int
    subject: str
    description: str
    category: str
    priority: str
    status: str
    organization_id: str
    customer_id: str
    assigned_agent_id: Optional[str] = None
    csat_rating: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    customer: Optional[CustomerResponse] = None
    assigned_agent: Optional[UserResponse] = None
    messages: List[TicketMessageResponse] = []
    internal_notes: List[InternalNoteResponse] = []
    attachments: List[AttachmentResponse] = []

    class Config:
        from_attributes = True

# Knowledge Base Schemas
class KBCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "folder"

class KBArticleCreate(BaseModel):
    title: str
    content: str
    category_id: str
    is_published: bool = True

class KBArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[str] = None
    is_published: Optional[bool] = None

class KBArticleResponse(BaseModel):
    id: str
    title: str
    slug: str
    content: str
    is_published: bool
    views_count: int
    helpful_count: int
    category_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Team Member Schemas
class TeamMemberInvite(BaseModel):
    email: EmailStr
    full_name: str
    role: RoleEnum = RoleEnum.AGENT

class TeamMemberRoleUpdate(BaseModel):
    role: RoleEnum

# Live Chat Schemas
class LiveChatSessionResponse(BaseModel):
    id: str
    customer_name: str
    customer_email: str
    assigned_agent_id: Optional[str] = None
    status: str
    created_at: datetime

class LiveChatMessageResponse(BaseModel):
    id: str
    session_id: str
    sender_type: str
    sender_name: str
    message: str
    created_at: datetime

# Reports & Metrics Schemas
class OverviewMetricsResponse(BaseModel):
    open_tickets: int
    closed_tickets: int
    pending_tickets: int
    avg_response_time_minutes: float
    csat_score: float
    tickets_today: int
    resolution_rate: float
    tickets_trend: List[dict]
    category_breakdown: List[dict]
    agent_workload: List[dict]

# Notification Schema
class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Billing Schemas
class SubscriptionResponse(BaseModel):
    plan_name: str
    billing_cycle: str
    status: str
    agent_seats: int
    monthly_tickets_limit: int
    current_period_end: Optional[datetime] = None

class PlanChangeRequest(BaseModel):
    plan_name: str
    billing_cycle: str
