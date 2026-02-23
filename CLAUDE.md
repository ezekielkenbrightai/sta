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
│   │   ├── seed.py          # DB seeder (9 countries, 10 orgs, 11 users)
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
│   │   ├── pages/           # 99 pages across 16 modules
│   │   ├── stores/          # authStore.ts, appStore.ts (Zustand)
│   │   ├── theme/           # theme.ts (MUI black/gold)
│   │   ├── types/           # index.ts (all TypeScript interfaces)
│   │   ├── i18n/            # i18next setup (en/sw/fr)
│   │   ├── hooks/           # (empty)
│   │   ├── utils/           # (empty)
│   │   ├── constants/       # africaMapPaths.ts (SVG country paths)
│   │   └── pages/explore/   # Intra-African Trade Explorer (public, no auth)
│   ├── .env                 # VITE_API_URL, VITE_MOCK_AUTH (gitignored, local dev only)
│   ├── .env.production      # VITE_API_URL, VITE_MOCK_AUTH (tracked in git, used by Railway)
│   ├── package.json
│   └── vite.config.ts
├── landing/                  # Static landing page
│   └── index.html           # Black/gold hero page
├── docs/                     # Research & documentation
│   └── intra-african-trade-data.md  # Trade data sources, bilateral flows, RECs
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
- Public routes (no auth): `/login`, `/explore` — rendered outside `AppLayout`
- Schema-per-tenant PostgreSQL isolation (planned)
- Zustand for client state (auth, app UI), React Query for server state (5min staleTime)
- JWT auth with access tokens (60min expiry), stored in localStorage
- Axios interceptors: auto-attach JWT, auto-logout on 401, retry 502/503/504
- Mock auth mode: `VITE_MOCK_AUTH=true` with 12 predefined dev users (all roles)
- MUI DataGrid for tabular data
- Recharts for visualizations
- Inline SVG maps with no external dependencies (see `/explore` page)
- IntersectionObserver-based scroll-reveal animations
- i18next for en/sw/fr translations

## User Roles & Access
| Role | Modules |
|------|---------|
| super_admin | All modules |
| govt_admin | trade, tax, payments, ledger, supply_chain, customs, insurance, analytics, cbdc, afcfta, compliance |
| govt_analyst | trade, tax, analytics |
| bank_officer | payments, ledger |
| trader | trade, tax, payments, ledger, supply_chain, insurance, cbdc |
| logistics_officer | supply_chain |
| customs_officer | trade, customs |
| insurance_agent | insurance |
| auditor | trade, tax, payments, ledger, supply_chain, customs, insurance, analytics, compliance |
| compliance_officer | compliance, trade |
| afcfta_admin | trade, tax, analytics, customs, afcfta |
| ps_trade | executive, trade, tax, payments, analytics, customs, supply_chain, compliance, cbdc |

Route guard role arrays (App.tsx):
- `ADMIN` = super_admin, govt_admin
- `SUPER` = super_admin
- `TAX_VIEW` = super_admin, govt_admin, govt_analyst, trader, auditor
- `ANALYTICS_VIEW` = super_admin, govt_admin, govt_analyst, auditor
- `BANK` = super_admin, bank_officer
- `TRADER_ROLES` = super_admin, trader, customs_officer, govt_admin
- `CUSTOMS` = super_admin, customs_officer, govt_admin, auditor
- `LOGISTICS` = super_admin, logistics_officer, trader
- `INSURANCE` = super_admin, insurance_agent, trader
- `AUDITOR_ROLES` = super_admin, auditor, govt_admin, govt_analyst
- `COMPLIANCE` = super_admin, compliance_officer, govt_admin, auditor
- `AFCFTA` = super_admin, afcfta_admin, govt_admin, govt_analyst
- `PS_EXECUTIVE` = super_admin, ps_trade

**CRITICAL**: Route-level `roles` arrays MUST match `ROLE_MODULES` in layoutConstants.ts. If a role has module access in `ROLE_MODULES`, it MUST be included in the route's role array — otherwise the sidebar shows the module but the route redirects the user away.

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

### Backend DB Users (seed.py)
- admin@sta.africa (super_admin), govt@kra.go.ke (govt_admin)
- analyst@kra.go.ke (govt_analyst), officer@kcb.co.ke (bank_officer)
- trader@nairobiexports.co.ke (trader), ops@kenyalogistics.co.ke (logistics_officer)
- officer@kpa.go.ke (customs_officer), agent@jubilee.co.ke (insurance_agent)
- auditor@deloitte.com (auditor), afcfta@au.int (afcfta_admin)

### Frontend Mock Users (authStore.ts DEV_USERS — used when VITE_MOCK_AUTH=true)
- trader@nairobiexports.co.ke (trader, John Kipchoge, Nairobi Exports Ltd)
- admin@sta.africa (super_admin, Platform Admin)
- govt@kra.go.ke (govt_admin, Jane Mwangi, Kenya Revenue Authority)
- officer@kcb.co.ke (bank_officer, Sarah Kamau, KCB Bank)
- agent@apa.co.ke (insurance_agent, Grace Oduya, APA Insurance)
- analyst@kra.go.ke (govt_analyst, David Ochieng, Kenya Revenue Authority)
- customs@kpa.go.ke (customs_officer, Peter Njoroge, Kenya Ports Authority)
- logistics@bollore.co.ke (logistics_officer, Amina Hassan, Bolloré Logistics Kenya)
- auditor@oag.go.ke (auditor, Michael Wekesa, Office of the Auditor General)
- compliance@frc.go.ke (compliance_officer, Faith Njeri, Financial Reporting Centre)
- afcfta@au.int (afcfta_admin, Wamkele Mene, AfCFTA Secretariat)
- ps@trade.go.ke (ps_trade, PS Trade, Ministry of Trade)

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
11. **`tsc -b` errors on unused variables (TS6133)**: If you add a new role array but stop using an old one, `tsc -b` will fail with "declared but its value is never read." Always remove unused consts.
12. **Recharts `Formatter` type**: Never add explicit type annotations to Recharts formatter callbacks. Use `formatter={(value) => ...}` NOT `formatter={(value: number) => ...}`. Recharts types include `undefined` in the union and TypeScript inference handles it.
13. **`.env.production` must be tracked in git**: `.env` is gitignored (local dev), but `.env.production` must be committed so Railway has `VITE_MOCK_AUTH=true` at build time. Added `!frontend/.env.production` exception in `.gitignore`.
14. **localStorage "undefined" string bug**: `localStorage.setItem('key', undefined)` stores the literal string `"undefined"`, which `!!` evaluates as truthy. The `getValidToken()` function in authStore guards against this.
15. **Null-safe property access on user/module**: Always add fallback defaults when calling `.replace()` on values that could be null — e.g., `(selectedModule || 'trade').replace(...)` and `(user.role || 'trader').replace(...)`.
16. **Worktree merge conflicts**: When developing on a worktree branch and merging to main, parallel commits on main (e.g., from another worktree) cause conflicts. Always `git pull origin main --no-edit` before pushing main, and resolve conflicts by keeping both sides (ours + theirs) since they're usually additive features.
17. **Executive module palette convention**: The `pages/executive/` module uses a distinct deep-navy palette (`#0B1426` / `#0F1D35`) instead of the standard `#0a0a0a` / `#111111` black theme. This is intentional to create visual authority for government executive users. Future authority-level modules can follow this pattern with their own distinct palettes.
18. **Adding a new role checklist**: When adding a new user role, update ALL of these in order: (1) `DEV_USERS` in authStore.ts, (2) `ROLE_MODULES` in layoutConstants.ts, (3) `DEFAULT_MODULE` in layoutConstants.ts, (4) `MODULE_NAV` for the new module, (5) `defaultLandingPage()` in ProtectedRoute.tsx, (6) route role array const in App.tsx, (7) `<Route>` definitions in App.tsx, (8) `PATH_TO_MODULE` in appStore.ts if new path prefix, (9) `DEMO_ACCOUNTS` in LoginPage.tsx, (10) `MODULES` array in layoutConstants.ts if new module.
19. **Recharts Tooltip dark theme visibility**: When using Recharts on a dark background, the default Tooltip text is black and invisible. Always add `itemStyle={{ color: '#f0f0f0' }}` and `labelStyle={{ color: '#D4AF37', fontWeight: 600 }}` alongside `contentStyle` for dark-themed charts.
20. **Inline SVG maps over mapping libraries**: For clickable country maps, use inline SVG `<path>` elements instead of Leaflet/Mapbox/D3. This avoids heavy dependencies, works with React state natively, and keeps the bundle small (~17 kB gzipped for 54 African countries). Source: flekschas/simple-world-map (MIT License) for Natural Earth 110m simplified paths.
21. **SVG animated arcs for trade flows**: Use SVG quadratic bezier curves (`Q` path command) with `stroke-dasharray` + `<animate attributeName="stroke-dashoffset">` for flowing trade arc animations. No JS animation libraries needed — pure SVG + CSS.

## Research Documents
- **PS Trade mandate & global benchmarks**: [`docs/ps-trade-research.md`](docs/ps-trade-research.md) — Comprehensive research on PS Trade responsibilities, KPIs, global trade ministry digital systems (Singapore TradeNet, UK DBT, US Commerce, EU DG Trade), African regional context, and authority-level dashboard features.
- **Intra-African trade data & sources**: [`docs/intra-african-trade-data.md`](docs/intra-african-trade-data.md) — UN COMTRADE, Afreximbank, Trade Map (ITC), WITS data: bilateral flows (65+ country pairs), annual trends, top exporters, RECs, product categories, corridors.

## Frontend Pages (100 total across 16 modules)
| Module | Pages | Directory |
|--------|-------|-----------|
| Core (Dashboard, Login, Landing) | 3 | `pages/` |
| **Explore (Intra-African Trade Map)** | **1** | **`pages/explore/`** |
| Trade Documents & Registry | 9 | `pages/trade/` |
| Tax Engine & Administration | 7 | `pages/tax/` |
| Payments & Settlement + Bank | 11 | `pages/payments/` |
| Automated Ledger | 6 | `pages/ledger/` |
| Supply Chain & Logistics | 8 | `pages/supply-chain/` |
| Customs & Port Management | 4 | `pages/customs/` |
| Insurance | 5 | `pages/insurance/` |
| Analytics & Government | 10 | `pages/analytics/` |
| CBDC & Future Finance | 5 | `pages/cbdc/` |
| Compliance & KYC | 8 | `pages/compliance/` |
| AfCFTA Hub | 8 | `pages/afcfta/` |
| Executive (PS Trade) | 6 | `pages/executive/` |
| Admin & Platform Management | 8 | `pages/admin/` |
| Profile & Settings | 1 | `pages/profile/` |

### Page Re-export Pattern
When pages are shared across modules (e.g., AfCFTA pages accessible from both analytics and afcfta routes), the **canonical** file lives in the primary module directory and the secondary location re-exports it:
```typescript
// pages/afcfta/AfCFTAProgressPage.tsx (re-export)
export { default } from '../analytics/AfCFTAProgressPage';
```
This keeps a single source of truth while both route paths work. When naming lazy imports in App.tsx, suffix with `Hub` to avoid conflicts (e.g., `AfCFTAProgressPageHub` for the afcfta route vs `AfCFTAProgressPage` for the analytics route).

All pages use mock data with realistic African trade scenarios (Africa-to-Africa only). No PlaceholderPage routes remain.

## Current Gaps (areas needing implementation)
- Most API endpoints (trade, tax, payments, ledger, supply_chain, customs, insurance)
- Alembic migrations (currently using `create_all`)
- Tests (both frontend and backend — zero tests exist)
- Real dashboard data (currently mock/hardcoded on each page)
- Search/filter/pagination on list pages (UI exists, not wired to backend)
- i18n translations (minimal — i18next setup exists for en/sw/fr)
- CBDC/blockchain integration (simulated with mock data)
- Audit trail population
- PDF/CSV export functionality (UI exists, not wired)
- Landing page → app integration
- Real-time features (WebSocket notifications, live shipment tracking)

## Key Code Structure Notes

### Auth Flow (authStore.ts)
- `getValidToken()` guards against `"undefined"` / `"null"` string tokens in localStorage
- Mock mode: `DEV_USERS[email]` lookup, fallback to trader; stores `mock_user_email` for session restore
- Real mode: POST `/auth/login` → `access_token` + `user` response
- `loadFromStorage()` called on app mount → restores user from token

### Module System (appStore.ts + layoutConstants.ts)
- `ROLE_MODULES` defines which modules each role can access (source of truth)
- `MODULE_NAV` defines sidebar nav items per module (with per-item role filters)
- `DEFAULT_MODULE` maps each role to its landing module
- `moduleFromPath()` extracts module ID from URL path (special case: `/dashboard` → `trade`)
- `ModuleSelector` dropdown in TopNavBar lets users switch modules

### Route Protection (App.tsx + ProtectedRoute.tsx)
- `P` component wraps `ProtectedRoute` with `Suspense` fallback
- `ProtectedRoute` checks: isAuthLoading → spinner, !isAuthenticated → /login, role mismatch → defaultLandingPage(role)
- `defaultLandingPage(role)` maps each role to its home route (e.g., trader → /dashboard, bank_officer → /payments/dashboard)

### Login Page (LoginPage.tsx)
- Demo account chips (visible when `VITE_MOCK_AUTH=true`) — click to auto-fill email + password
- `initForRole(role)` on login sets the correct default module for the user's role

### Explore Page — Intra-African Trade Map (`/explore`)
- **Public route** (no auth, no AppLayout) — lazy-loaded via `React.lazy()`
- **Data sources**: UN COMTRADE, Afreximbank, Trade Map (ITC), WITS — see [`docs/intra-african-trade-data.md`](docs/intra-african-trade-data.md)
- **Components** (`pages/explore/components/`):
  - `AfricaMap.tsx` — Inline SVG with 54 clickable country `<path>` elements; paths in `constants/africaMapPaths.ts`
  - `TradeFlowArcs.tsx` — Animated SVG bezier arcs from selected country to trading partners
  - `CountryDetailPanel.tsx` — Flag, REC chips, exports/imports, top 5 partners, trade balance, products
  - `TradeGrowthChart.tsx` — Recharts AreaChart: 2016-2024 intra-African trade trend ($130B → $220B)
  - `TopExportersChart.tsx` — Recharts horizontal BarChart: top 10 intra-African exporters
  - `StatCard.tsx` — Reusable glassmorphic KPI card
- **Data layer** (`pages/explore/data/`):
  - `tradeData.ts` — 65+ bilateral flows, annual trends, top exporters, 7 RECs, product categories, corridors
  - `countryMetadata.ts` — 54 countries with ISO codes, flag emojis, SVG centroids, REC memberships
- **Key patterns**: IntersectionObserver scroll-reveal (`useReveal` hook), clickable trade corridors auto-select origin country, map responsive resize

### Executive Module (pages/executive/)
- Uses a distinct deep-navy color palette (`EX` object) — NOT the standard MUI theme colors
- Each page overrides layout padding with `mx: -3, mt: -3, mb: -3` to fill the full viewport
- `ExecCard` reusable component wraps all cards with navy gradient background, gold border, optional gold top-bar glow
- Government seal/crest in header with "Office of the Permanent Secretary" branding
- "Classified — For Official Use Only" footer on every page
- All Recharts tooltips use consistent navy/gold styling
- `LIVE` indicator with CSS pulse animation

## Related Documents
- [`MEMORY.md`](MEMORY.md) — Session learnings, technical decisions, patterns, and bugs found
- [`docs/intra-african-trade-data.md`](docs/intra-african-trade-data.md) — Intra-African trade research data, sources, and URLs
