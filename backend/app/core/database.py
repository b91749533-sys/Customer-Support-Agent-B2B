import os
import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

# Determine Async Database URI with fallback to SQLite for easy local development without postgres dependencies
DATABASE_URL = settings.SQLALCHEMY_DATABASE_URI

# Use SQLite fallback if USE_SQLITE env var is set or Postgres fails
USE_SQLITE = os.getenv("USE_SQLITE", "true").lower() in ("true", "1", "yes")

if USE_SQLITE:
    sqlite_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "supportflow.db")
    ASYNC_DATABASE_URL = f"sqlite+aiosqlite:///{sqlite_path}"
else:
    ASYNC_DATABASE_URL = DATABASE_URL

engine_kwargs = {}
if "sqlite" in ASYNC_DATABASE_URL:
    engine_kwargs["connect_args"] = {"check_same_thread": False}

async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=False,
    future=True,
    **engine_kwargs
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
