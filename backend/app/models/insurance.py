from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..core.database import Base
from .core import utcnow, new_uuid


class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    document_id: Mapped[str] = mapped_column(ForeignKey("trade_documents.id"), nullable=False)
    provider_org_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    coverage_type: Mapped[str] = mapped_column(String(50), nullable=False)  # all_risk, fpa, war_risk, total_loss
    premium: Mapped[float] = mapped_column(Float, nullable=False)
    coverage_amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="active")  # active, expired, cancelled, claimed
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class InsuranceClaim(Base):
    __tablename__ = "insurance_claims"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    policy_id: Mapped[str] = mapped_column(ForeignKey("insurance_policies.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="filed")  # filed, under_review, approved, rejected, paid
    filed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
