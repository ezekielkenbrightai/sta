from fastapi import APIRouter, Depends

from ...core.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
async def get_summary(current_user=Depends(get_current_user)):
    """Return dashboard summary stats (placeholder with mock data)."""
    return {
        "active_documents": 1247,
        "tax_collected": 2_400_000_000,
        "tax_currency": "KES",
        "active_shipments": 342,
        "shipments_at_port": 18,
        "fx_settlements_total": 12_800_000,
        "fx_currency": "USD",
        "avg_settlement_time_seconds": 3,
        "traders_registered": 7_200,
        "compliance_rate": 94.2,
    }


@router.get("/stats")
async def get_stats(current_user=Depends(get_current_user)):
    """Return time-series stats for dashboard charts (placeholder)."""
    return {
        "trade_volume_by_month": [
            {"month": "2026-01", "value": 180_000_000},
            {"month": "2026-02", "value": 210_000_000},
        ],
        "tax_revenue_by_category": [
            {"category": "customs_duty", "amount": 1_200_000_000},
            {"category": "vat", "amount": 800_000_000},
            {"category": "excise", "amount": 300_000_000},
            {"category": "withholding", "amount": 100_000_000},
        ],
    }
