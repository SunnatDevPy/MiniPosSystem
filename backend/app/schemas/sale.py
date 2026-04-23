from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class SaleItemCreate(BaseModel):
    product_id: int
    qty: float
    price_override: float | None = Field(None, gt=0)


class SaleCreate(BaseModel):
    cashier_name: str = Field(..., min_length=2, max_length=100)
    payment_type: str = "cash"
    items: list[SaleItemCreate]

    @field_validator("payment_type")
    @classmethod
    def validate_payment_type(cls, value: str) -> str:
        if value not in {"cash", "card", "mixed"}:
            raise ValueError("payment_type must be cash, card or mixed")
        return value


class SaleItemOut(BaseModel):
    product_id: int
    qty: float
    price: float
    line_total: float

    class Config:
        from_attributes = True


class SaleOut(BaseModel):
    id: int
    cashier_name: str
    payment_type: str
    total_amount: float
    created_at: datetime
    items: list[SaleItemOut]

    class Config:
        from_attributes = True
