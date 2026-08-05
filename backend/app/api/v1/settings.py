from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.models import Organization, User
from app.schemas.schemas import OrganizationResponse, OrganizationUpdate
from app.api.deps import get_current_user, require_permission

router = APIRouter()

@router.get("/organization", response_model=OrganizationResponse)
async def get_organization_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    org = res.scalars().first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org

@router.patch("/organization", response_model=OrganizationResponse)
async def update_organization_settings(
    payload: OrganizationUpdate,
    current_user: User = Depends(require_permission("settings_access")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Organization).where(Organization.id == current_user.organization_id)
    )
    org = res.scalars().first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(org, k, v)

    await db.commit()
    await db.refresh(org)
    return org
