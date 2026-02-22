from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from ..core.database import Base
from .core import utcnow, new_uuid


class Currency(Base):
    __tablename__ = "currencies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    code: Mapped[str] = mapped_column(String(3), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    symbol: Mapped[str] = mapped_column(String(10), nullable=False)
    is_african: Mapped[bool] = mapped_column(Boolean, default=True)


class ExchangeRate(Base):
    __tablename__ = "exchange_rates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    from_currency: Mapped[str] = mapped_column(String(3), nullable=False, index=True)
    to_currency: Mapped[str] = mapped_column(String(3), nullable=False, index=True)
    rate: Mapped[float] = mapped_column(Float, nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    from_org_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    to_org_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending, processing, completed, failed
    type: Mapped[str] = mapped_column(String(30), nullable=False)  # tax, trade, settlement
    reference: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class FXSettlement(Base):
    __tablename__ = "fx_settlements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    payment_id: Mapped[str] = mapped_column(ForeignKey("payments.id"), nullable=False)
    source_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    target_currency: Mapped[str] = mapped_column(String(3), nullable=False)
    exchange_rate: Mapped[float] = mapped_column(Float, nullable=False)
    source_amount: Mapped[float] = mapped_column(Float, nullable=False)
    settled_amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="pending")  # pending, processing, settled, failed
    settled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
