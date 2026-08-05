# SupportFlow - B2B Customer Support Management SaaS

SupportFlow is a production-ready, high-performance **B2B Customer Support Management SaaS platform** engineered for businesses. Designed to rival leading platforms like Zendesk, Freshdesk, Help Scout, and Intercom, it delivers a modern, minimal UI, real-time live chat WebSockets, ticket management, customer CRM profiles, a public knowledge base engine, role-based access control (RBAC), and executive analytics.

> **Note**: This application is built strictly using traditional software engineering best practices. It does NOT rely on AI models, chatbots, or unverified LLM responses.

---

## 🌟 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Engine**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Icons & Visuals**: Lucide Icons, Recharts Analytics Charts
- **State & Data**: TanStack Query, React Hook Form, Zod

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL (SQLAlchemy async ORM + asyncpg / SQLite fallback for instant local dev)
- **Real-Time Stream**: WebSockets & Redis Pub/Sub
- **Security**: JWT Authentication, Bcrypt Password Hashing, RBAC Middleware
- **Containerization**: Docker & Docker Compose

---

## 🚀 Key Modules & Features

1. **Landing Page**:
   - Modern hero section (*"Customer Support Made Simple."*)
   - Interactive SaaS preview graphic
   - Features grid, 3-step walkthrough, pricing plan toggles, social proof testimonials, FAQ, contact form, and footer (*"Built by Youssef Manssouri"*).

2. **Authentication**:
   - Organization onboarding & agent login flow
   - Password reset request & email verification simulation
   - Pre-populated demo credentials button (`admin@supportflow.io` / `password123`)

3. **Support Dashboard Overview**:
   - KPI telemetry (Open, Pending, Closed tickets, Avg SLA Response Time, CSAT scores)
   - Recharts visual volume trends & category breakdown graphs
   - Real-time activity timeline and agent workload distribution

4. **Omnichannel Ticket Engine**:
   - Statuses: `Open`, `Pending`, `Waiting for Customer`, `Resolved`, `Closed`
   - Priorities: `Low`, `Medium`, `High`, `Urgent`
   - Functions: Create, Edit, Delete, Reassign, Merge tickets, Internal notes thread, File attachments, Bulk status updates, and search filters.

5. **Customer CRM Profiles**:
   - Customer Directory with company details & contact metadata
   - Historical ticket timeline and internal account notes

6. **Live Chat Console & Embedded Widget**:
   - Website customer chat widget (`FloatingWidget.tsx`) connected to agents
   - Instant typing indicators and online/offline status
   - Agent-to-agent chat transfer and one-click convert chat session to support ticket.

7. **Knowledge Base Documentation**:
   - Category tree management
   - Rich Markdown article editor with live draft/published state toggles
   - Telemetry views & helpfulness feedback rating.

8. **Team & Role-Based Access Control (RBAC)**:
   - Roles: `Owner`, `Admin`, `Agent`, `Viewer`
   - Member invite modal & fine-grained permission matrix editor.

9. **Executive Analytics & Reports**:
   - Daily ticket volume bar charts, SLA response compliance, CSAT rating breakdown, and agent workload performance.

10. **Billing & Stripe Integration**:
    - Subscription plans (`Free`, `Pro`, `Enterprise`)
    - Monthly and annual billing cycle toggles
    - Seat allocations progress bars and downloadable invoice history.

11. **Organization Settings**:
    - Custom brand accent color picker, logo upload, email settings, notification preferences, and session security policies.

---

## 🛠️ Quick Local Setup Instructions

### Backend Setup (FastAPI & SQLite / Postgres)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # On Windows
pip install -r requirements.txt
pip install aiosqlite

# Seed database with initial demo data (tickets, agents, customers, KB)
python seed.py

# Run FastAPI development server
uvicorn app.main:app --reload --port 8000
```

FastAPI interactive Swagger API documentation will be available at `http://localhost:8000/docs`.

### Frontend Setup (Next.js 16 & React 19)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🐳 Docker Deployment

To launch the complete production stack (PostgreSQL, Redis, FastAPI backend, and Next.js frontend) with one command:

```bash
docker-compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8000/api/v1`
- **Swagger OpenAPI Docs**: `http://localhost:8000/docs`

---

## 👤 Author & Attribution

**Built by Youssef Manssouri**
