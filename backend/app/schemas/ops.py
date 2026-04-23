from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class SupplierCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str | None = Field(default=None, max_length=40)
    address: str | None = Field(default=None, max_length=240)
    note: str | None = Field(default=None, max_length=240)


class SupplierOut(BaseModel):
    id: int
    name: str
    phone: str | None = None
    address: str | None = None
    note: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class PurchaseItemCreate(BaseModel):
    product_id: int
    qty: float = Field(..., gt=0)
    buy_price: float = Field(..., gt=0)


class PurchaseCreate(BaseModel):
    supplier_id: int
    created_by: str = Field(..., min_length=2, max_length=100)
    note: str | None = Field(default=None, max_length=240)
    items: list[PurchaseItemCreate]


class ShiftOpen(BaseModel):
    cashier_name: str = Field(..., min_length=2, max_length=100)
    opening_cash: float = Field(0, ge=0)


class ShiftClose(BaseModel):
    closing_cash: float = Field(..., ge=0)
    note: str | None = Field(default=None, max_length=240)


class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    amount: float = Field(..., gt=0)
    category: str = Field(default="other", max_length=60)
    note: str | None = Field(default=None, max_length=240)
    created_by: str = Field(..., min_length=2, max_length=100)
    shift_id: int | None = None


class ReturnItemCreate(BaseModel):
    product_id: int
    qty: float = Field(..., gt=0)
    reason: str | None = Field(default=None, max_length=120)


class ReturnCreate(BaseModel):
    sale_id: int
    cashier_name: str = Field(..., min_length=2, max_length=100)
    note: str | None = Field(default=None, max_length=240)
    items: list[ReturnItemCreate]


class AuditLogOut(BaseModel):
    id: int
    actor: str
    action: str
    entity: str
    entity_id: str | None = None
    details: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ExportFilter(BaseModel):
    day: datetime | None = None

    @field_validator("day")
    @classmethod
    def normalize_day(cls, value: datetime | None) -> datetime | None:
        return value
