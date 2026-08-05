from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.models import User, RoleEnum
from app.schemas.schemas import UserResponse, TeamMemberInvite, TeamMemberRoleUpdate
from app.api.deps import get_current_user, require_permission

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def list_team_members(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(User).where(User.organization_id == current_user.organization_id)
    )
    users = res.scalars().all()
    return users

@router.post("/invite", response_model=UserResponse)
async def invite_team_member(
    payload: TeamMemberInvite,
    current_user: User = Depends(require_permission("manage_users")),
    db: AsyncSession = Depends(get_db)
):
    # Check if user already exists
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Default temporary password for invited member
    temp_password = "SupportFlowPass2026!"
    new_user = User(
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role.value,
        password_hash=get_password_hash(temp_password),
        organization_id=current_user.organization_id,
        is_verified=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.patch("/{user_id}/role", response_model=UserResponse)
async def update_member_role(
    user_id: str,
    payload: TeamMemberRoleUpdate,
    current_user: User = Depends(require_permission("manage_users")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(User).where(
            User.id == user_id,
            User.organization_id == current_user.organization_id
        )
    )
    member = res.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    member.role = payload.role.value
    await db.commit()
    await db.refresh(member)
    return member

@router.delete("/{user_id}")
async def remove_team_member(
    user_id: str,
    current_user: User = Depends(require_permission("manage_users")),
    db: AsyncSession = Depends(get_db)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot remove yourself")

    res = await db.execute(
        select(User).where(
            User.id == user_id,
            User.organization_id == current_user.organization_id
        )
    )
    member = res.scalars().first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    await db.delete(member)
    await db.commit()
    return {"message": "Team member removed"}
