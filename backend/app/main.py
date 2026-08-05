import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import init_db
from app.api.v1 import (
    auth, tickets, customers, live_chat, knowledge_base,
    team, reports, notifications, billing, settings as settings_api, attachments
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Production-ready B2B Customer Support Management SaaS API (SupportFlow)"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Flexible for development and production containers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static folder
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SupportFlow API Engine",
        "version": settings.VERSION
    }

# Register Routers
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=f"{api_prefix}/auth", tags=["Auth"])
app.include_router(tickets.router, prefix=f"{api_prefix}/tickets", tags=["Tickets"])
app.include_router(customers.router, prefix=f"{api_prefix}/customers", tags=["Customers"])
app.include_router(live_chat.router, prefix=f"{api_prefix}/live-chat", tags=["Live Chat"])
app.include_router(knowledge_base.router, prefix=f"{api_prefix}/knowledge-base", tags=["Knowledge Base"])
app.include_router(team.router, prefix=f"{api_prefix}/team", tags=["Team"])
app.include_router(reports.router, prefix=f"{api_prefix}/reports", tags=["Reports & Analytics"])
app.include_router(notifications.router, prefix=f"{api_prefix}/notifications", tags=["Notifications"])
app.include_router(billing.router, prefix=f"{api_prefix}/billing", tags=["Billing"])
app.include_router(settings_api.router, prefix=f"{api_prefix}/settings", tags=["Settings"])
app.include_router(attachments.router, prefix=f"{api_prefix}/attachments", tags=["Attachments"])
