from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.models.models import Subscription, User
from app.schemas.schemas import SubscriptionResponse, PlanChangeRequest
from app.api.deps import get_current_user, require_permission

router = APIRouter()

@router.get("/", response_model=SubscriptionResponse)
async def get_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Subscription).where(Subscription.organization_id == current_user.organization_id)
    )
    sub = res.scalars().first()
    if not sub:
        sub = Subscription(organization_id=current_user.organization_id, plan_name="Pro", billing_cycle="monthly")
        db.add(sub)
        await db.commit()
        await db.refresh(sub)
    return sub

@router.post("/change-plan", response_model=SubscriptionResponse)
async def change_plan(
    payload: PlanChangeRequest,
    current_user: User = Depends(require_permission("billing_access")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Subscription).where(Subscription.organization_id == current_user.organization_id)
    )
    sub = res.scalars().first()
    if not sub:
        sub = Subscription(organization_id=current_user.organization_id)
        db.add(sub)

    sub.plan_name = payload.plan_name
    sub.billing_cycle = payload.billing_cycle

    if payload.plan_name == "Free":
        sub.agent_seats = 2
        sub.monthly_tickets_limit = 100
    elif payload.plan_name == "Pro":
        sub.agent_seats = 10
        sub.monthly_tickets_limit = 2500
    elif payload.plan_name == "Enterprise":
        sub.agent_seats = 50
        sub.monthly_tickets_limit = 100000

    await db.commit()
    await db.refresh(sub)
    return sub

@router.get("/invoices")
async def get_invoices(current_user: User = Depends(get_current_user)):
    return [
        {
            "id": "inv_109281",
            "date": "2026-08-01",
            "amount": "$49.00",
            "status": "Paid",
            "plan": "Pro Plan (Monthly)",
            "pdf_url": "#"
        },
        {
            "id": "inv_108172",
            "date": "2026-07-01",
            "amount": "$49.00",
            "status": "Paid",
            "plan": "Pro Plan (Monthly)",
            "pdf_url": "#"
        },
        {
            "id": "inv_107455",
            "date": "2026-06-01",
            "amount": "$49.00",
            "status": "Paid",
            "plan": "Pro Plan (Monthly)",
            "pdf_url": "#"
        }
    ]
