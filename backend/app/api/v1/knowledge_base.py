import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, desc

from app.core.database import get_db
from app.models.models import KBCategory, KBArticle, User
from app.schemas.schemas import (
    KBCategoryCreate, KBArticleCreate, KBArticleUpdate, KBArticleResponse
)
from app.api.deps import get_current_user, require_permission

router = APIRouter()

# Public Categories list
@router.get("/categories")
async def list_categories(
    org_id: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    target_org_id = current_user.organization_id if current_user else org_id
    if not target_org_id:
        # Fallback to first available organization if public call
        org_res = await db.execute(select(KBCategory.organization_id).limit(1))
        target_org_id = org_res.scalar()

    query = select(KBCategory).where(KBCategory.organization_id == target_org_id)
    res = await db.execute(query)
    categories = res.scalars().all()
    return categories

@router.post("/categories")
async def create_category(
    payload: KBCategoryCreate,
    current_user: User = Depends(require_permission("manage_tickets")),
    db: AsyncSession = Depends(get_db)
):
    slug = re.sub(r'[^a-z0-9]', '-', payload.name.lower()).strip('-')
    category = KBCategory(
        name=payload.name,
        slug=slug,
        description=payload.description,
        icon=payload.icon or "folder",
        organization_id=current_user.organization_id
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

@router.get("/articles", response_model=List[KBArticleResponse])
async def list_articles(
    category_id: Optional[str] = None,
    search: Optional[str] = None,
    is_published: Optional[bool] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(KBArticle)
    if current_user:
        query = query.where(KBArticle.organization_id == current_user.organization_id)
    if category_id:
        query = query.where(KBArticle.category_id == category_id)
    if is_published is not None:
        query = query.where(KBArticle.is_published == is_published)
    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(
                KBArticle.title.ilike(pattern),
                KBArticle.content.ilike(pattern)
            )
        )

    query = query.order_by(desc(KBArticle.updated_at))
    res = await db.execute(query)
    return res.scalars().all()

@router.post("/articles", response_model=KBArticleResponse)
async def create_article(
    payload: KBArticleCreate,
    current_user: User = Depends(require_permission("manage_tickets")),
    db: AsyncSession = Depends(get_db)
):
    slug = re.sub(r'[^a-z0-9]', '-', payload.title.lower()).strip('-')
    article = KBArticle(
        title=payload.title,
        slug=f"{slug}-{payload.category_id[:4]}",
        content=payload.content,
        category_id=payload.category_id,
        is_published=payload.is_published,
        organization_id=current_user.organization_id
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return article

@router.patch("/articles/{article_id}", response_model=KBArticleResponse)
async def update_article(
    article_id: str,
    payload: KBArticleUpdate,
    current_user: User = Depends(require_permission("manage_tickets")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(KBArticle).where(
            KBArticle.id == article_id,
            KBArticle.organization_id == current_user.organization_id
        )
    )
    article = res.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(article, k, v)

    await db.commit()
    await db.refresh(article)
    return article

@router.post("/articles/{article_id}/helpful")
async def mark_helpful(article_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(KBArticle).where(KBArticle.id == article_id))
    article = res.scalars().first()
    if article:
        article.helpful_count += 1
        await db.commit()
    return {"message": "Feedback recorded"}

@router.delete("/articles/{article_id}")
async def delete_article(
    article_id: str,
    current_user: User = Depends(require_permission("manage_tickets")),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(KBArticle).where(
            KBArticle.id == article_id,
            KBArticle.organization_id == current_user.organization_id
        )
    )
    article = res.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    await db.delete(article)
    await db.commit()
    return {"message": "Article deleted successfully"}
