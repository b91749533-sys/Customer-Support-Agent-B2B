import json
from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.core.database import get_db, AsyncSessionLocal
from app.models.models import LiveChatSession, LiveChatMessage, Ticket, TicketStatusEnum, Customer, User
from app.schemas.schemas import LiveChatSessionResponse, LiveChatMessageResponse
from app.api.deps import get_current_user

router = APIRouter()

# In-memory WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        # Maps session_id -> list of WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket):
        if session_id in self.active_connections:
            if websocket in self.active_connections[session_id]:
                self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def broadcast(self, session_id: str, message_data: dict):
        if session_id in self.active_connections:
            for connection in list(self.active_connections[session_id]):
                try:
                    await connection.send_text(json.dumps(message_data))
                except Exception:
                    pass

manager = ConnectionManager()

@router.get("/sessions", response_model=List[LiveChatSessionResponse])
async def list_chat_sessions(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(LiveChatSession).where(LiveChatSession.organization_id == current_user.organization_id)
    if status:
        query = query.where(LiveChatSession.status == status)
    query = query.order_by(desc(LiveChatSession.created_at))
    
    result = await db.execute(query)
    sessions = result.scalars().all()
    return sessions

@router.get("/sessions/{session_id}/messages", response_model=List[LiveChatMessageResponse])
async def get_session_messages(
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(LiveChatMessage)
        .where(LiveChatMessage.session_id == session_id)
        .order_by(LiveChatMessage.created_at)
    )
    messages = res.scalars().all()
    return messages

@router.post("/sessions/start", response_model=LiveChatSessionResponse)
async def start_chat_session(
    customer_name: str,
    customer_email: str,
    organization_id: str,
    db: AsyncSession = Depends(get_db)
):
    session = LiveChatSession(
        customer_name=customer_name,
        customer_email=customer_email,
        organization_id=organization_id,
        status="active"
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

@router.post("/sessions/{session_id}/convert-to-ticket")
async def convert_chat_to_ticket(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session_res = await db.execute(
        select(LiveChatSession).where(LiveChatSession.id == session_id)
    )
    session = session_res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Live chat session not found")

    # Find or create customer
    cust_res = await db.execute(
        select(Customer).where(
            Customer.email == session.customer_email,
            Customer.organization_id == current_user.organization_id
        )
    )
    customer = cust_res.scalars().first()
    if not customer:
        customer = Customer(
            name=session.customer_name,
            email=session.customer_email,
            organization_id=current_user.organization_id
        )
        db.add(customer)
        await db.flush()

    # Fetch chat messages
    msg_res = await db.execute(
        select(LiveChatMessage).where(LiveChatMessage.session_id == session_id).order_by(LiveChatMessage.created_at)
    )
    msgs = msg_res.scalars().all()
    chat_transcript = "\n".join([f"[{m.sender_name} ({m.sender_type})]: {m.message}" for m in msgs])

    ticket = Ticket(
        ticket_number=1000 + int(session_id[:4], 16) % 9000,
        subject=f"Converted Chat from {session.customer_name}",
        description=f"Transcript from Live Chat Session:\n\n{chat_transcript}",
        status=TicketStatusEnum.OPEN.value,
        organization_id=current_user.organization_id,
        customer_id=customer.id,
        assigned_agent_id=current_user.id
    )
    db.add(ticket)

    session.status = "converted"
    await db.commit()
    return {"message": "Chat successfully converted into support ticket", "ticket_id": ticket.id}

@router.websocket("/ws/chat/{session_id}")
async def chat_websocket(websocket: WebSocket, session_id: str):
    await manager.connect(session_id, websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            data = json.loads(data_text)

            # Check if typing indicator event or message event
            msg_type = data.get("type", "message")

            if msg_type == "typing":
                await manager.broadcast(session_id, {
                    "type": "typing",
                    "sender_name": data.get("sender_name", "User"),
                    "is_typing": data.get("is_typing", True)
                })
            elif msg_type == "message":
                sender_type = data.get("sender_type", "customer")
                sender_name = data.get("sender_name", "Anonymous")
                message_body = data.get("message", "")

                if message_body.strip():
                    async with AsyncSessionLocal() as db:
                        chat_msg = LiveChatMessage(
                            session_id=session_id,
                            sender_type=sender_type,
                            sender_name=sender_name,
                            message=message_body
                        )
                        db.add(chat_msg)
                        await db.commit()

                    await manager.broadcast(session_id, {
                        "type": "message",
                        "sender_type": sender_type,
                        "sender_name": sender_name,
                        "message": message_body,
                        "created_at": str(chat_msg.created_at) if 'chat_msg' in locals() else ""
                    })
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
    except Exception:
        manager.disconnect(session_id, websocket)
