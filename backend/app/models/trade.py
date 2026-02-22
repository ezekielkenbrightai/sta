from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base
from .core import utcnow, new_uuid


class Trader(Base):
    __tablename__ = "traders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    registration_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # importer, exporter, both
    status: Mapped[str] = mapped_column(String(30), default="active")  # active, suspended, inactive
    organization_id: Mapped[str | None] = mapped_column(ForeignKey("organizations.id"), nullable=True)
    country_id: Mapped[str] = mapped_column(ForeignKey("countries.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    documents: Mapped[list["TradeDocument"]] = relationship(back_populates="trader")


class TradeDocument(Base):
    __tablename__ = "trade_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    reference_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # import, export, transit, re_export
    status: Mapped[str] = mapped_column(
        String(30), default="draft"
    )  # draft, submitted, under_review, verified, assessed, paid, cleared, completed, rejected
    trader_id: Mapped[str] = mapped_column(ForeignKey("traders.id"), nullable=False)
    origin_country_id: Mapped[str] = mapped_column(ForeignKey("countries.id"), nullable=False)
    destination_country_id: Mapped[str] = mapped_column(ForeignKey("countries.id"), nullable=False)
    total_value: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    incoterms: Mapped[str] = mapped_column(String(10), default="CIF")
    shipping_method: Mapped[str] = mapped_column(String(30), default="sea")  # sea, air, road, rail
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    trader: Mapped["Trader"] = relationship(back_populates="documents")
    items: Mapped[list["TradeItem"]] = relationship(back_populates="document", cascade="all, delete-orphan")


class TradeItem(Base):
    __tablename__ = "trade_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    document_id: Mapped[str] = mapped_column(ForeignKey("trade_documents.id"), nullable=False)
    hs_code: Mapped[str] = mapped_column(String(12), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(20), default="kg")
    unit_value: Mapped[float] = mapped_column(Float, nullable=False)
    total_value: Mapped[float] = mapped_column(Float, nullable=False)
    origin_country: Mapped[str] = mapped_column(String(3), nullable=False)

    document: Mapped["TradeDocument"] = relationship(back_populates="items")


class HSCode(Base):
    __tablename__ = "hs_codes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    code: Mapped[str] = mapped_column(String(12), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    duty_rate: Mapped[float] = mapped_column(Float, default=0.0)  # percentage
    chapter: Mapped[int] = mapped_column(Integer, nullable=False)
    section: Mapped[str] = mapped_column(String(10), nullable=False)
