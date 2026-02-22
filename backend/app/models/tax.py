from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..core.database import Base
from .core import utcnow, new_uuid


class TaxAssessment(Base):
    __tablename__ = "tax_assessments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    document_id: Mapped[str] = mapped_column(ForeignKey("trade_documents.id"), nullable=False, index=True)
    customs_duty: Mapped[float] = mapped_column(Float, default=0.0)
    vat: Mapped[float] = mapped_column(Float, default=0.0)
    excise_duty: Mapped[float] = mapped_column(Float, default=0.0)
    withholding_tax: Mapped[float] = mapped_column(Float, default=0.0)
    total_tax: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending, approved, paid, overdue
    assessed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class TaxPayment(Base):
    __tablename__ = "tax_payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    assessment_id: Mapped[str] = mapped_column(ForeignKey("tax_assessments.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    method: Mapped[str] = mapped_column(String(30), default="bank_transfer")  # bank_transfer, mobile_money, card
    reference: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending, completed, failed
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class DutyRate(Base):
    __tablename__ = "duty_rates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    hs_code: Mapped[str] = mapped_column(String(12), nullable=False, index=True)
    country_id: Mapped[str] = mapped_column(ForeignKey("countries.id"), nullable=False)
    rate: Mapped[float] = mapped_column(Float, nullable=False)
    agreement_id: Mapped[str | None] = mapped_column(String(36), nullable=True)  # AfCFTA agreement ref
    effective_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class TaxExemption(Base):
    __tablename__ = "tax_exemptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    trader_id: Mapped[str] = mapped_column(ForeignKey("traders.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # full, partial, specific_duty
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    approved_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
