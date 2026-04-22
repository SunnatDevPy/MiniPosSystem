from datetime import datetime

from pydantic import BaseModel


class SaleItemCreate(BaseModel):
    product_id: int
    qty: float
    price_override: float | None = None


class SaleCreate(BaseModel):
    cashier_name: str
    payment_type: str = "cash"
    items: list[SaleItemCreate]


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
