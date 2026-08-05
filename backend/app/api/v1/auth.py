from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import re

from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.models import User, Organization, Subscription, RoleEnum
from app.schemas.schemas import LoginRequest, SignUpRequest, TokenResponse, UserResponse, ForgotPasswordRequest
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/signup", response_model=TokenResponse)
async def signup(payload: SignUpRequest, db: AsyncSession = Depends(get_db)):
    # Check if user email exists
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create Organization
    slug = re.sub(r'[^a-z0-9]', '-', payload.organization_name.lower()).strip('-')
    org = Organization(
        name=payload.organization_name,
        slug=f"{slug}-{payload.email.split('@')[0]}"
    )
    db.add(org)
    await db.flush()

    # Create Owner User
    user = User(
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        full_name=payload.full_name,
        role=RoleEnum.OWNER.value,
        organization_id=org.id,
        is_verified=True
    )
    db.add(user)

    # Default Subscription
    sub = Subscription(organization_id=org.id, plan_name="Pro", billing_cycle="monthly")
    db.add(sub)

    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization_id": user.organization_id,
            "organization_name": org.name
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalars().first()
    
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated")

    # Fetch Organization
    org_res = await db.execute(select(Organization).where(Organization.id == user.organization_id))
    org = org_res.scalars().first()

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "organization_id": user.organization_id,
            "organization_name": org.name if org else "SupportFlow"
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    # Simulation for password reset email dispatch
    return {"message": f"Password reset instructions have been dispatched to {payload.email}"}
