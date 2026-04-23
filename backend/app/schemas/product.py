from pydantic import BaseModel, Field, field_validator


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    barcode: str | None = Field(default=None, max_length=80)
    category: str = Field(default="General", min_length=2, max_length=80)
    unit: str = "kg"
    buy_price: float = Field(0, ge=0)
    sell_price: float = Field(..., gt=0)
    stock_qty: float = Field(0, ge=0)
    min_stock: float = Field(0, ge=0)

    @field_validator("unit")
    @classmethod
    def validate_unit(cls, value: str) -> str:
        if value not in {"kg", "pcs"}:
            raise ValueError("unit must be 'kg' or 'pcs'")
        return value


class ProductUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=150)
    barcode: str | None = Field(default=None, max_length=80)
    category: str | None = Field(default=None, min_length=2, max_length=80)
    unit: str | None = None
    buy_price: float | None = Field(None, ge=0)
    sell_price: float | None = Field(None, gt=0)
    min_stock: float | None = Field(None, ge=0)

    @field_validator("unit")
    @classmethod
    def validate_unit(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if value not in {"kg", "pcs"}:
            raise ValueError("unit must be 'kg' or 'pcs'")
        return value


class ProductOut(BaseModel):
    id: int
    name: str
    artikul: str
    barcode: str | None = None
    category: str
    unit: str
    buy_price: float
    sell_price: float
    stock_qty: float
    min_stock: float

    class Config:
        from_attributes = True


class StockAdjust(BaseModel):
    product_id: int
    qty_delta: float = Field(..., description="Plus for incoming, minus for write-off")
    reason: str = Field(default="adjustment", max_length=60)
    note: str | None = Field(default=None, max_length=240)
