import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .api.v1.auth import router as auth_router
from .api.v1.dashboard import router as dashboard_router

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
)

# ─── CORS ────────────────────────────────────────────────────────────────────────

origins = json.loads(settings.CORS_ORIGINS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── API Routes ──────────────────────────────────────────────────────────────────

app.include_router(auth_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "sta-backend"}


@app.get("/")
async def root():
    return {"message": "Smart Trade Africa API", "docs": "/api/docs"}
