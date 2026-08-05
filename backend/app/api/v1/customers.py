from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, or_, desc
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.models import Customer, Ticket, User
from app.schemas.schemas import CustomerCreate, CustomerUpdate, CustomerResponse
from app.api.deps import get_current_user, require_permission

router = APIRouter()

@router.get("/", response_model=List[CustomerResponse])
async def list_customers(
    search: Optional[str] = None,
    company: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Customer).where(Customer.organization_id == current_user.organization_id)

    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(
                Customer.name.ilike(pattern),
                Customer.email.ilike(pattern),
                Customer.company.ilike(pattern)
            )
        )
    if company:
        query = query.where(Customer.company.ilike(f"%{company}%"))

    query = query.order_by(desc(Customer.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    customers = result.scalars().all()

    # Calculate ticket counts
    response = []
    for cust in customers:
        t_count = await db.execute(
            select(func.count(Ticket.id)).where(Ticket.customer_id == cust.id)
        )
        c_dict = CustomerResponse.model_validate(cust).model_dump()
        c_dict["ticket_count"] = t_count.scalar() or 0
        response.append(CustomerResponse(**c_dict))

    return response

@router.post("/", response_model=CustomerResponse)
async def create_customer(
    payload: CustomerCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check duplicate email in org
    existing = await db.execute(
        select(Customer).where(
            Customer.email == payload.email,
            Customer.organization_id == current_user.organization_id
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Customer with this email already exists in organization")

    customer = Customer(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        company=payload.company,
        notes=payload.notes,
        organization_id=current_user.organization_id
    )
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer

@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.organization_id == current_user.organization_id
        )
    )
    customer = res.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    t_count = await db.execute(
        select(func.count(Ticket.id)).where(Ticket.customer_id == customer.id)
    )
    c_dict = CustomerResponse.model_validate(customer).model_dump()
    c_dict["ticket_count"] = t_count.scalar() or 0
    return CustomerResponse(**c_dict)

@router.patch("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: str,
    payload: CustomerUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.organization_id == current_user.organization_id
        )
    )
    customer = res.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(customer, k, v)

    await db.commit()
    await db.refresh(customer)
    return customer

@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_user: User = Depends(require_permission("manage_users")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.organization_id == current_user.organization_id
        )
    )
    customer = res.scalars().first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    await db.delete(customer)
    await db.commit()
    return {"message": "Customer deleted successfully"}
