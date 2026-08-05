import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.database import get_db
from app.models.models import Attachment, User
from app.schemas.schemas import AttachmentResponse
from app.api.deps import get_current_user

router = APIRouter()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=AttachmentResponse)
async def upload_file(
    file: UploadFile = File(...),
    ticket_id: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Validate MIME types or max size
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    content = await file.read()
    file_size = len(content)

    with open(file_path, "wb") as f:
        f.write(content)

    file_url = f"/static/uploads/{unique_filename}"

    attachment = Attachment(
        ticket_id=ticket_id,
        filename=file.filename,
        file_url=file_url,
        file_size=file_size,
        mime_type=file.content_type or "application/octet-stream"
    )
    db.add(attachment)
    await db.commit()
    await db.refresh(attachment)
    return attachment
