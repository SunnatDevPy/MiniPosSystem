from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str
    sku: str
    unit: str = "kg"
    buy_price: float = 0
    sell_price: float
    stock_qty: float = 0
    min_stock: float = 0


class ProductUpdate(BaseModel):
    name: str | None = None
    unit: str | None = None
    buy_price: float | None = None
    sell_price: float | None = None
    min_stock: float | None = None


class ProductOut(BaseModel):
    id: int
    name: str
    sku: str
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
