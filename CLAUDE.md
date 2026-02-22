# Smart Trade Africa (STA) — Project Conventions

## Overview
STA is a digital trade platform for Africa. It integrates tax collection, payment processing, automated ledgers, cross-FX settlement, blockchain security, supply chain tracking, and CBDC-ready trade finance.

## Tech Stack
- **Frontend**: React 19.2 + TypeScript 5.9 + Vite 7 + MUI 7 + Zustand 5 + React Query 5 + Recharts 3 + React Router 7
- **Backend**: Python 3.12 + FastAPI 0.115+ + SQLAlchemy 2 (async) + Alembic + Pydantic v2
- **Database**: PostgreSQL 16 (schema-per-tenant, async via asyncpg)
- **Cache**: Redis 7 (configured, not yet used)
- **Auth**: JWT (python-jose) + bcrypt (passlib)
- **Containers**: Docker + docker-compose
- **Deployment**: Railway (backend + frontend + Postgres + Redis), docker-compose (full stack)

## Project Structure
```
sta.com/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, route registration
│   │   ├── seed.py          # DB seeder (9 countries, 9 orgs, 9 users)
│   │   ├── api/v1/          # Route handlers (auth.py, dashboard.py)
│   │   ├── core/            # config.py, database.py, security.py
│   │   ├── models/          # SQLAlchemy models (7 files)
│   │   ├── schemas/         # Pydantic schemas (auth.py)
│   │   ├── services/        # Business logic (empty)
│   │   └── engine/          # Calculation engines (empty)
│   ├── tests/               # (empty)
│   ├── alembic/             # Migrations (empty, uses create_all)
│   ├── Dockerfile           # Python 3.12 slim
│   ├── pyproject.toml       # Dependencies
│   ├── railway.toml         # Railway deployment config
│   ├── run.py               # Railway-compatible entrypoint (reads PORT from env)
│   ├── start.sh             # Shell entrypoint (fallback)
│   └── Procfile             # Railway web process
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── App.tsx          # Router, lazy routes, QueryClient
│   │   ├── main.tsx         # React 19 entry point
│   │   ├── api/             # client.ts (Axios), endpoints.ts
│   │   ├── components/layout/ # AppLayout, ProtectedRoute, Sidebar, TopNav
│   │   ├── pages/           # 77 pages across 12 modules
│   │   ├── stores/          # authStore.ts, appStore.ts (Zustand)
│   │   ├── theme/           # theme.ts (MUI black/gold)
│   │   ├── types/           # index.ts (all TypeScript interfaces)
│   │   ├── i18n/            # i18next setup (en/sw/fr)
│   │   ├── hooks/           # (empty)
│   │   ├── utils/           # (empty)
│   │   └── constants/       # (empty)
│   ├── .env                 # VITE_API_URL, VITE_MOCK_AUTH
│   ├── package.json
│   └── vite.config.ts
├── landing/                  # Static landing page
│   └── index.html           # Black/gold hero page
├── docker-compose.yml        # PostgreSQL 16, Redis 7, backend, frontend
└── CLAUDE.md
```

## Design System
- Theme: Black/gold dark theme
- Fonts: Outfit (body, weights 300-700) + Lora (headings, weights 400-700)
- Primary: `#D4AF37` (gold), Light: `#F0D060`, Dark: `#B8962E`
- Background: `#0a0a0a` (default), `#111111` (paper/cards)
- Text: `#f0f0f0` (primary), `#b0b0b0` (secondary)
- Status: Error `#EF4444`, Success `#22C55E`, Warning `#E6A817`, Info `#3B82F6`
- Framework: MUI with `sx` prop styling (NO Tailwind)
- Cards: Blur backdrop (20px), gold border (0.15 alpha), rounded 16px
- Buttons: Rounded (50px), font-weight 600, text-transform none
- Reference: `landing/index.html` for visual language

## Architecture Patterns
- Lazy-loaded routes with `React.lazy()` + `Suspense` (code splitting)
- `ProtectedRoute` wrapper with role-based guards
- Schema-per-tenant PostgreSQL isolation (planned)
- Zustand for client state (auth, app UI), React Query for server state (5min staleTime)
- JWT auth with access tokens (60min expiry), stored in localStorage
- Axios interceptors: auto-attach JWT, auto-logout on 401, retry 502/503/504
- Mock auth mode: `VITE_MOCK_AUTH=true` with 5 predefined dev users
- MUI DataGrid for tabular data
- Recharts for visualizations
- i18next for en/sw/fr translations

## User Roles & Access
| Role | Modules |
|------|---------|
| super_admin | All modules |
| govt_admin | trade, tax, payments, ledger, supply_chain, customs, analytics |
| govt_analyst | trade, tax, analytics |
| bank_officer | payments, ledger, FX settlement |
| trader | trade, tax, payments, ledger, supply_chain, insurance, cbdc |
| logistics_officer | supply_chain |
| customs_officer | trade, customs |
| insurance_agent | insurance |
| auditor | ledger, audit trail |

Role groups used in route guards: ADMIN, GOVT, BANK, TRADER_ROLES, CUSTOMS, LOGISTICS, INSURANCE, AUDITOR_ROLES

## Backend Models (all use UUID PKs + datetime tracking)
- **core.py**: Country, Organization, User, AuditLog
- **trade.py**: Trader, TradeDocument (9 status states), TradeItem, HSCode
- **tax.py**: TaxAssessment, TaxPayment, DutyRate, TaxExemption
- **payment.py**: Currency, ExchangeRate, Payment, FXSettlement
- **ledger.py**: LedgerAccount, LedgerJournal, LedgerEntry (double-entry)
- **supply_chain.py**: Shipment, ShipmentEvent, Warehouse, CustomsClearance
- **insurance.py**: InsurancePolicy, InsuranceClaim

## Backend API Endpoints (implemented)
- `POST /api/v1/auth/login` — Email + password → JWT + UserResponse
- `GET /api/v1/auth/me` — Current user (with eager-loaded org + country)
- `GET /api/v1/dashboard/summary` — Mock stats
- `GET /api/v1/dashboard/stats` — Mock time-series
- `GET /api/health` — Health check

## Test Users (password: `password123`)
- admin@sta.africa (super_admin), govt@kra.go.ke (govt_admin)
- analyst@kra.go.ke (govt_analyst), officer@kcb.co.ke (bank_officer)
- trader@nairobiexports.co.ke (trader), ops@kenyalogistics.co.ke (logistics_officer)
- officer@kpa.go.ke (customs_officer), agent@jubilee.co.ke (insurance_agent)
- auditor@kra.go.ke (auditor)

## Commands
- Frontend dev: `cd frontend && npm run dev` (port 5173)
- Frontend build: `cd frontend && npm run build`
- Frontend lint: `cd frontend && npm run lint`
- Backend dev: `cd backend && uvicorn app.main:app --reload` (port 8000)
- Backend seed: `cd backend && python -m app.seed`
- Backend tests: `cd backend && pytest`
- Full stack: `docker-compose up` (or `docker-compose up --build`)
- API docs: http://localhost:8000/api/docs (Swagger, debug mode only)

## Naming Conventions
- Page files: PascalCase (e.g., `TaxDashboardPage.tsx`)
- Components: PascalCase (e.g., `SidebarContent.tsx`)
- API endpoints: snake_case (e.g., `/api/v1/trade_documents`)
- Database tables: snake_case
- Python classes: PascalCase
- Zustand stores: camelCase (e.g., `authStore.ts`)
- TypeScript types: PascalCase interfaces in `types/index.ts`

## Schema Conventions
- Pydantic schemas: Create/Update/Response variants per model
- Pagination: `PaginatedResponse<T>` with items, total, page, size, pages
- All mutations should trigger audit log entries

## Railway Deployment

### Project Info
- **Project**: sta (ID: `7cc8ea08-1297-4e91-a600-ea489040f538`)
- **Backend service**: BackEnd (ID: `2f754f0a-1fda-45ab-9538-04d8ede45793`)
- **Public URL**: https://sta-production.up.railway.app
- **Health check**: https://sta-production.up.railway.app/api/health
- **Repo**: https://github.com/ezekielkenbrightai/sta (auto-deploys on push)

### Railway CLI Usage
- **Link project**: `cd sta.com && railway link` (select sta project)
- **Deploy from local**: `railway up --service BackEnd --detach`
- **View logs**: `railway logs --service BackEnd`
- **View logs for specific deploy**: `railway logs --service BackEnd <deployment-id>`
- **Set env var**: `railway variables set "KEY=value" --service BackEnd`
- **List env vars**: `railway variables --service BackEnd`
- **Delete env var**: `railway variables delete KEY --service BackEnd`
- **IMPORTANT**: If `RAILWAY_TOKEN` env var is set, it overrides user auth. Run `unset RAILWAY_TOKEN` first to use user auth token (stored in `~/.railway/config.json`).

### Railway Services (STA project)
| Service | Internal Domain | Purpose |
|---------|----------------|---------|
| BackEnd | sta.railway.internal | FastAPI API server |
| Postgres | postgres.railway.internal:5432 | PostgreSQL 16 database |
| Redis | redis.railway.internal:6379 | Redis cache |
| FrontEnd | tradeafricanow.com | React SPA (Vite build + serve) |

### Backend Environment Variables (Railway)
| Variable | Value / Notes |
|----------|--------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:***@postgres.railway.internal:5432/railway` — MUST include `+asyncpg` driver |
| `REDIS_URL` | `redis://default:***@redis.railway.internal:6379` |
| `CORS_ORIGINS` | JSON array of allowed origins (include Railway public URL + custom domain) |
| `SECRET_KEY` | Generated hex token for JWT signing |
| `ENVIRONMENT` | `production` |
| `PORT` | Auto-set by Railway — do NOT set manually |

### Critical Railway Lessons Learned
1. **Railway rewrites `--port` flags**: Any `--port <value>` in start commands gets silently replaced with `--port $PORT`, but Railway does NOT shell-expand `$PORT`. This means uvicorn's `--port` flag always receives the literal string `$PORT` and crashes. **Solution**: Use `python run.py` which reads PORT via `os.environ.get("PORT", "8000")` — no `--port` flag at all.
2. **DATABASE_URL must use `+asyncpg` driver**: Railway's Postgres service provides `postgresql://...` but SQLAlchemy async requires `postgresql+asyncpg://...`. Set this manually on the BackEnd service.
3. **Railway reference variables can be empty**: When you add Postgres/Redis and reference their vars (e.g., `${{Postgres.DATABASE_URL}}`), the reference can resolve to empty if the services aren't fully provisioned. Always verify with `railway variables --service BackEnd`.
4. **`RAILWAY_TOKEN` env var overrides user auth**: If a project-scoped token is set as `RAILWAY_TOKEN` in your shell environment, it overrides the user auth token in `~/.railway/config.json`. This can point the CLI to a different project. Always `unset RAILWAY_TOKEN` when switching between projects.
5. **Use `railway up --service BackEnd --detach` for manual deploys**: GitHub auto-deploys may not trigger for every push. Manual deploy from local files ensures the latest code is deployed.
6. **Pydantic `EmailStr` requires `pydantic[email]`**: The `email-validator` package must be installed. Use `pydantic[email]>=2.10.0` in pyproject.toml instead of bare `pydantic`.
7. **Check deploy logs per deployment ID**: `railway logs --service BackEnd` shows latest active deploy. Use `railway logs --service BackEnd <deploy-id>` to see logs for a specific deploy (the ID is returned by `railway up`).
8. **Never commit Railway tokens**: Railway auth tokens are stored in `~/.railway/config.json`. The `.gitignore` includes `.railway/` and `railway-token.txt`. Never set `RAILWAY_TOKEN` in committed files.
9. **Frontend builds use `tsc -b` (strict)**: Vite's `npm run build` runs `tsc -b && vite build`. The `-b` flag uses project references mode which is stricter than `tsc --noEmit`. Always run `npm run build` locally before pushing to catch type errors that `tsc --noEmit` misses.
10. **Frontend FrontEnd service uses `npx serve`**: Railway auto-detects the Vite build and runs `npx serve dist` on port 8080. The custom domain is `tradeafricanow.com`.

## Frontend Pages (77 total across 12 modules)
| Module | Pages | Directory |
|--------|-------|-----------|
| Core (Dashboard, Login, Landing) | 3 | `pages/` |
| Trade Documents & Registry | 9 | `pages/trade/` |
| Tax Engine & Administration | 7 | `pages/tax/` |
| Payments & Settlement + Bank | 11 | `pages/payments/` |
| Automated Ledger | 6 | `pages/ledger/` |
| Supply Chain & Logistics | 8 | `pages/supply-chain/` |
| Customs & Port Management | 4 | `pages/customs/` |
| Insurance | 5 | `pages/insurance/` |
| Analytics & Government | 10 | `pages/analytics/` |
| CBDC & Future Finance | 5 | `pages/cbdc/` |
| Admin & Platform Management | 8 | `pages/admin/` |
| Profile & Settings | 1 | `pages/profile/` |

All pages use mock data with realistic East African trade scenarios. No PlaceholderPage routes remain.

## Current Gaps (areas needing implementation)
- Most API endpoints (trade, tax, payments, ledger, supply_chain, customs, insurance)
- Alembic migrations (currently using `create_all`)
- Tests (both frontend and backend)
- Real dashboard data (currently mock/hardcoded on each page)
- Search/filter/pagination on list pages (UI exists, not wired to backend)
- i18n translations (minimal)
- CBDC/blockchain integration (simulated with mock data)
- Audit trail population
- PDF/CSV export functionality (UI exists, not wired)
- Landing page → app integration
