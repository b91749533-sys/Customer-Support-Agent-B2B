from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, or_, desc, update, delete
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone

from app.core.database import get_db
from app.models.models import Ticket, TicketMessage, InternalNote, Customer, User, Notification, AuditLog, TicketStatusEnum
from app.schemas.schemas import (
    TicketCreate, TicketUpdate, TicketResponse, TicketMessageCreate, 
    TicketMessageResponse, InternalNoteCreate, InternalNoteResponse, TicketMergeRequest
)
from app.api.deps import get_current_user, require_permission

router = APIRouter()

@router.get("/", response_model=List[TicketResponse])
async def list_tickets(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    assigned_agent_id: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Ticket).where(Ticket.organization_id == current_user.organization_id)

    if status:
        query = query.where(Ticket.status == status)
    if priority:
        query = query.where(Ticket.priority == priority)
    if category:
        query = query.where(Ticket.category == category)
    if assigned_agent_id:
        query = query.where(Ticket.assigned_agent_id == assigned_agent_id)
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Ticket.subject.ilike(search_pattern),
                Ticket.description.ilike(search_pattern),
                Ticket.ticket_number.cast(str).ilike(search_pattern)
            )
        )

    query = query.options(
        selectinload(Ticket.customer),
        selectinload(Ticket.assigned_agent),
        selectinload(Ticket.messages),
        selectinload(Ticket.internal_notes),
        selectinload(Ticket.attachments)
    ).order_by(desc(Ticket.updated_at)).offset(skip).limit(limit)

    result = await db.execute(query)
    tickets = result.scalars().all()
    return tickets

@router.post("/", response_model=TicketResponse)
async def create_ticket(
    payload: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Determine next ticket number
    num_query = select(func.coalesce(func.max(Ticket.ticket_number), 1000)).where(Ticket.organization_id == current_user.organization_id)
    max_num_res = await db.execute(num_query)
    next_num = max_num_res.scalar() + 1

    ticket = Ticket(
        ticket_number=next_num,
        subject=payload.subject,
        description=payload.description,
        category=payload.category,
        priority=payload.priority,
        status=TicketStatusEnum.OPEN.value,
        organization_id=current_user.organization_id,
        customer_id=payload.customer_id,
        assigned_agent_id=payload.assigned_agent_id
    )
    db.add(ticket)
    await db.flush()

    # Initial message thread entry
    msg = TicketMessage(
        ticket_id=ticket.id,
        sender_type="customer",
        sender_id=payload.customer_id,
        sender_name="Customer",
        message=payload.description
    )
    db.add(msg)

    # Send Notification if agent assigned
    if payload.assigned_agent_id:
        notif = Notification(
            user_id=payload.assigned_agent_id,
            title="New Ticket Assigned",
            message=f"Ticket #{next_num} '{payload.subject}' has been assigned to you.",
            link=f"/dashboard/tickets?id={ticket.id}"
        )
        db.add(notif)

    await db.commit()

    # Fetch loaded ticket
    result = await db.execute(
        select(Ticket)
        .where(Ticket.id == ticket.id)
        .options(
            selectinload(Ticket.customer),
            selectinload(Ticket.assigned_agent),
            selectinload(Ticket.messages),
            selectinload(Ticket.internal_notes),
            selectinload(Ticket.attachments)
        )
    )
    return result.scalars().first()

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Ticket).where(
        Ticket.id == ticket_id,
        Ticket.organization_id == current_user.organization_id
    ).options(
        selectinload(Ticket.customer),
        selectinload(Ticket.assigned_agent),
        selectinload(Ticket.messages),
        selectinload(Ticket.internal_notes),
        selectinload(Ticket.attachments)
    )
    result = await db.execute(query)
    ticket = result.scalars().first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: str,
    payload: TicketUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Ticket).where(
        Ticket.id == ticket_id,
        Ticket.organization_id == current_user.organization_id
    )
    result = await db.execute(query)
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    old_agent = ticket.assigned_agent_id
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(ticket, key, value)
    
    ticket.updated_at = datetime.now(timezone.utc)

    # Notify new agent if reassigned
    if payload.assigned_agent_id and payload.assigned_agent_id != old_agent:
        notif = Notification(
            user_id=payload.assigned_agent_id,
            title="Ticket Reassigned",
            message=f"Ticket #{ticket.ticket_number} '{ticket.subject}' was assigned to you by {current_user.full_name}.",
            link=f"/dashboard/tickets?id={ticket.id}"
        )
        db.add(notif)

    await db.commit()

    full_res = await db.execute(
        select(Ticket).where(Ticket.id == ticket.id).options(
            selectinload(Ticket.customer),
            selectinload(Ticket.assigned_agent),
            selectinload(Ticket.messages),
            selectinload(Ticket.internal_notes),
            selectinload(Ticket.attachments)
        )
    )
    return full_res.scalars().first()

@router.delete("/{ticket_id}")
async def delete_ticket(
    ticket_id: str,
    current_user: User = Depends(require_permission("manage_tickets")),
    db: AsyncSession = Depends(get_db)
):
    query = select(Ticket).where(
        Ticket.id == ticket_id,
        Ticket.organization_id == current_user.organization_id
    )
    res = await db.execute(query)
    ticket = res.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    await db.delete(ticket)
    await db.commit()
    return {"message": "Ticket deleted successfully"}

@router.post("/{ticket_id}/messages", response_model=TicketMessageResponse)
async def add_message(
    ticket_id: str,
    payload: TicketMessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ticket_res = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id, Ticket.organization_id == current_user.organization_id)
    )
    ticket = ticket_res.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    msg = TicketMessage(
        ticket_id=ticket.id,
        sender_type=payload.sender_type,
        sender_id=current_user.id if payload.sender_type == "agent" else ticket.customer_id,
        sender_name=current_user.full_name if payload.sender_type == "agent" else "Customer",
        message=payload.message
    )
    db.add(msg)

    # Update status to Pending if agent replies, or Waiting Customer
    if payload.sender_type == "agent" and ticket.status == TicketStatusEnum.OPEN.value:
        ticket.status = TicketStatusEnum.WAITING_CUSTOMER.value
    
    ticket.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(msg)
    return msg

@router.post("/{ticket_id}/internal-notes", response_model=InternalNoteResponse)
async def add_internal_note(
    ticket_id: str,
    payload: InternalNoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    ticket_res = await db.execute(
        select(Ticket).where(Ticket.id == ticket_id, Ticket.organization_id == current_user.organization_id)
    )
    ticket = ticket_res.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    note = InternalNote(
        ticket_id=ticket.id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        note_text=payload.note_text
    )
    db.add(note)
    ticket.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(note)
    return note

@router.post("/merge")
async def merge_tickets(
    payload: TicketMergeRequest,
    current_user: User = Depends(require_permission("manage_tickets")),
    db: AsyncSession = Depends(get_db)
):
    target_res = await db.execute(
        select(Ticket).where(Ticket.id == payload.target_ticket_id, Ticket.organization_id == current_user.organization_id)
    )
    target = target_res.scalars().first()
    if not target:
        raise HTTPException(status_code=404, detail="Target ticket not found")

    for source_id in payload.source_ticket_ids:
        if source_id == payload.target_ticket_id:
            continue
        src_res = await db.execute(
            select(Ticket).where(Ticket.id == source_id, Ticket.organization_id == current_user.organization_id)
        )
        src = src_res.scalars().first()
        if src:
            # Transfer messages & internal notes to target
            await db.execute(
                update(TicketMessage).where(TicketMessage.ticket_id == src.id).values(ticket_id=target.id)
            )
            await db.execute(
                update(InternalNote).where(InternalNote.ticket_id == src.id).values(ticket_id=target.id)
            )
            # Add internal merge note on target
            merge_note = InternalNote(
                ticket_id=target.id,
                user_id=current_user.id,
                user_name=current_user.full_name,
                note_text=f"Merged Ticket #{src.ticket_number} ('{src.subject}') into this ticket."
            )
            db.add(merge_note)
            src.status = TicketStatusEnum.CLOSED.value

    # Audit log
    audit = AuditLog(
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        user_name=current_user.full_name,
        action="TICKET_MERGE",
        resource=f"Ticket #{target.ticket_number}",
        details=f"Merged source ticket IDs: {payload.source_ticket_ids}"
    )
    db.add(audit)
    await db.commit()
    return {"message": "Tickets merged successfully", "target_ticket_id": target.id}
