import asyncio
import logging
from sqlalchemy.future import select
from datetime import datetime, timedelta, timezone

from app.core.database import async_engine, AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models.models import (
    Organization, User, Customer, Ticket, TicketMessage, InternalNote,
    KBCategory, KBArticle, Subscription, Notification, RoleEnum,
    TicketStatusEnum, TicketPriorityEnum
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        res = await db.execute(select(Organization).where(Organization.slug == "acme-saas"))
        if res.scalars().first():
            logger.info("Database already seeded. Skipping.")
            return

        logger.info("Seeding SupportFlow production database...")

        # 1. Organization
        org = Organization(
            name="Acme SaaS Solutions",
            slug="acme-saas",
            brand_color="#2563eb",
            support_email="support@acmesaas.io"
        )
        db.add(org)
        await db.flush()

        # 2. Users / Agents
        owner = User(
            email="admin@supportflow.io",
            password_hash=get_password_hash("password123"),
            full_name="Youssef Manssouri",
            role=RoleEnum.OWNER.value,
            organization_id=org.id,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
        )
        agent1 = User(
            email="sarah.j@supportflow.io",
            password_hash=get_password_hash("password123"),
            full_name="Sarah Jenkins",
            role=RoleEnum.ADMIN.value,
            organization_id=org.id,
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
        )
        agent2 = User(
            email="alex.m@supportflow.io",
            password_hash=get_password_hash("password123"),
            full_name="Alex Morgan",
            role=RoleEnum.AGENT.value,
            organization_id=org.id,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
        )
        db.add_all([owner, agent1, agent2])
        await db.flush()

        # 3. Subscription
        sub = Subscription(
            organization_id=org.id,
            plan_name="Pro",
            billing_cycle="monthly",
            status="active",
            agent_seats=10,
            monthly_tickets_limit=5000
        )
        db.add(sub)

        # 4. Customers
        c1 = Customer(
            name="David Miller",
            email="david@nexuscorp.com",
            phone="+1 (555) 234-5678",
            company="Nexus Corp",
            notes="Enterprise account. VIP tier support SLA.",
            organization_id=org.id
        )
        c2 = Customer(
            name="Emily Chen",
            email="emily.chen@cloudscale.io",
            phone="+1 (555) 876-5432",
            company="CloudScale Inc",
            notes="Upgraded to Annual Enterprise plan last month.",
            organization_id=org.id
        )
        c3 = Customer(
            name="Marcus Vance",
            email="marcus@logisticsglobal.net",
            phone="+1 (555) 345-6789",
            company="Logistics Global",
            notes="Requires SAML SSO configuration assistance.",
            organization_id=org.id
        )
        db.add_all([c1, c2, c3])
        await db.flush()

        # 5. Tickets
        t1 = Ticket(
            ticket_number=1001,
            subject="Unable to export monthly analytics report to CSV",
            description="When I click on 'Export CSV' in the reports dashboard, the spinner hangs indefinitely and times out after 30 seconds.",
            category="Technical Issue",
            priority=TicketPriorityEnum.HIGH.value,
            status=TicketStatusEnum.OPEN.value,
            organization_id=org.id,
            customer_id=c1.id,
            assigned_agent_id=agent1.id,
            csat_rating=5
        )
        t2 = Ticket(
            ticket_number=1002,
            subject="Billing query: Update invoice tax identification number",
            description="Could you please update invoice #INV-109281 with our EU VAT ID DE39201928? We need a revised copy for tax filing.",
            category="Billing & Account",
            priority=TicketPriorityEnum.MEDIUM.value,
            status=TicketStatusEnum.WAITING_CUSTOMER.value,
            organization_id=org.id,
            customer_id=c2.id,
            assigned_agent_id=agent2.id
        )
        t3 = Ticket(
            ticket_number=1003,
            subject="Webhook integration failing with HTTP 403 Forbidden error",
            description="Our webhooks endpoints for ticket creation events are receiving 403 Forbidden responses since yesterday's API update.",
            category="API Integration",
            priority=TicketPriorityEnum.URGENT.value,
            status=TicketStatusEnum.PENDING.value,
            organization_id=org.id,
            customer_id=c3.id,
            assigned_agent_id=owner.id
        )
        t4 = Ticket(
            ticket_number=1004,
            subject="Requesting custom role permission matrix for auditors",
            description="We would like to grant read-only view access to our financial compliance team without giving ticket edit privileges.",
            category="Feature Request",
            priority=TicketPriorityEnum.LOW.value,
            status=TicketStatusEnum.RESOLVED.value,
            organization_id=org.id,
            customer_id=c1.id,
            assigned_agent_id=agent1.id,
            csat_rating=5
        )
        db.add_all([t1, t2, t3, t4])
        await db.flush()

        # 6. Ticket Messages & Internal Notes
        m1 = TicketMessage(
            ticket_id=t1.id,
            sender_type="customer",
            sender_id=c1.id,
            sender_name=c1.name,
            message="When I click on 'Export CSV' in the reports dashboard, the spinner hangs indefinitely and times out after 30 seconds."
        )
        m2 = TicketMessage(
            ticket_id=t1.id,
            sender_type="agent",
            sender_id=agent1.id,
            sender_name=agent1.full_name,
            message="Hello David! Thanks for reaching out. I'm investigating our backend export service logs right now to trace the timeout."
        )
        note1 = InternalNote(
            ticket_id=t1.id,
            user_id=agent1.id,
            user_name=agent1.full_name,
            note_text="Checked worker logs: timeout is caused by unindexed SQL query on 500k+ date range records. Engineering is releasing patch."
        )
        db.add_all([m1, m2, note1])

        # 7. Knowledge Base Categories & Articles
        cat1 = KBCategory(
            name="Getting Started",
            slug="getting-started",
            description="Essential guides for onboarding your support team onto SupportFlow.",
            icon="rocket",
            organization_id=org.id
        )
        cat2 = KBCategory(
            name="API & Integrations",
            slug="api-integrations",
            description="REST API specs, webhooks authentication, and SDK documentation.",
            icon="code",
            organization_id=org.id
        )
        db.add_all([cat1, cat2])
        await db.flush()

        a1 = KBArticle(
            title="How to configure webhooks for automated ticket routing",
            slug="how-to-configure-webhooks",
            content="""# Webhook Integration Guide

SupportFlow webhooks allow your engineering systems to receive real-time HTTP POST notifications whenever support events occur.

## Setup Steps
1. Navigate to **Settings > Integrations > Webhooks**.
2. Click **Add Webhook Endpoint**.
3. Paste your HTTPS payload URL and select the event triggers (`ticket.created`, `ticket.updated`, `ticket.closed`).
4. Copy your signing secret to verify HMAC signatures in your server middleware.

```python
import hmac, hashlib

def verify_signature(payload, signature, secret):
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```
""",
            is_published=True,
            views_count=342,
            helpful_count=89,
            category_id=cat2.id,
            organization_id=org.id
        )
        a2 = KBArticle(
            title="Managing Team Roles and Fine-Grained Permissions (RBAC)",
            slug="managing-team-roles-rbac",
            content="""# Team Roles & Permissions

SupportFlow features built-in Role-Based Access Control (RBAC) to ensure security and compliance across your business.

## Available Roles
- **Owner**: Full system access including billing, workspace deletion, and team management.
- **Admin**: Complete access to tickets, team configuration, and reports.
- **Agent**: Manage assigned tickets, create internal notes, and update ticket statuses.
- **Viewer**: Read-only access to analytics dashboards and knowledge base articles.
""",
            is_published=True,
            views_count=520,
            helpful_count=145,
            category_id=cat1.id,
            organization_id=org.id
        )
        db.add_all([a1, a2])

        # 8. Notifications
        n1 = Notification(
            user_id=owner.id,
            title="Urgent Ticket Assigned",
            message="Ticket #1003 'Webhook integration failing' requires your urgent review.",
            link=f"/dashboard/tickets?id={t3.id}"
        )
        db.add(n1)

        await db.commit()
        logger.info("Successfully seeded SupportFlow database!")

if __name__ == "__main__":
    asyncio.run(seed())
