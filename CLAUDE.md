# Smart Trade Africa (STA) — Project Conventions

## Overview
STA is a digital trade platform for Africa. It integrates tax collection, payment processing, automated ledgers, cross-FX settlement, blockchain security, supply chain tracking, and CBDC-ready trade finance.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 7 + MUI 7 + Zustand + React Query + Recharts
- **Backend**: Python + FastAPI + SQLAlchemy 2 + Alembic + Pydantic v2
- **Database**: PostgreSQL 16 (schema-per-tenant)
- **Cache**: Redis 7
- **Containers**: Docker + docker-compose

## Design System
- Theme: Black/gold dark theme (updated from green/gold)
- Fonts: Outfit (body) + Lora (headings)
- Primary accent: `#D4AF37` (gold)
- Background: `#0a0a0a` (near-black)
- Framework: MUI with `sx` prop styling (no Tailwind)
- Reference: `landing/index.html` for visual language

## Architecture Patterns (from ifrs17engine prototype)
- Lazy-loaded routes with code splitting
- ProtectedRoute with role-based access (9 roles)
- Schema-per-tenant PostgreSQL isolation
- Zustand for client state, React Query for server state
- JWT auth with refresh tokens
- Axios interceptor for API client
- MUI DataGrid for tabular data
- Recharts for visualizations
- i18next for en/sw/fr translations

## User Roles
super_admin, govt_admin, govt_analyst, bank_officer, trader, logistics_officer, customs_officer, insurance_agent, auditor

## Commands
- Frontend dev: `cd frontend && npm run dev`
- Backend dev: `cd backend && uvicorn app.main:app --reload`
- Full stack: `docker-compose up`
- Frontend tests: `cd frontend && npm test`
- Backend tests: `cd backend && pytest`

## Conventions
- All pages lazy-loaded via React.lazy()
- Page files: PascalCase (e.g., TaxDashboardPage.tsx)
- API endpoints: snake_case (e.g., /api/v1/trade_documents)
- Database models: snake_case tables, PascalCase Python classes
- Pydantic schemas mirror SQLAlchemy models with Create/Update/Response variants
- Every mutation triggers an audit log entry
