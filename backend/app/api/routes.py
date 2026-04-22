from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.models.entities import Product, Sale, SaleItem
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate, StockAdjust
from app.schemas.sale import SaleCreate, SaleOut

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "mini-pos"}


@router.post("/products", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    exists = db.scalar(select(Product).where(Product.sku == payload.sku))
    if exists:
        raise HTTPException(status_code=400, detail="Product with this SKU already exists")
    obj = Product(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/products", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.scalars(select(Product).order_by(Product.name)).all()


@router.patch("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


@router.post("/stock/adjust", response_model=ProductOut)
def adjust_stock(payload: StockAdjust, db: Session = Depends(get_db)):
    product = db.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    new_qty = product.stock_qty + payload.qty_delta
    if new_qty < 0:
        raise HTTPException(status_code=400, detail="Not enough stock")
    product.stock_qty = new_qty
    db.commit()
    db.refresh(product)
    return product


@router.post("/sales", response_model=SaleOut)
def create_sale(payload: SaleCreate, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="At least one item is required")

    sale = Sale(cashier_name=payload.cashier_name, payment_type=payload.payment_type, total_amount=0)
    db.add(sale)
    db.flush()

    total = 0.0
    for row in payload.items:
        product = db.get(Product, row.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {row.product_id} not found")
        if row.qty <= 0:
            raise HTTPException(status_code=400, detail="Qty must be positive")
        if product.stock_qty < row.qty:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")

        product.stock_qty -= row.qty
        line_total = round(product.sell_price * row.qty, 2)
        total += line_total
        db.add(
            SaleItem(
                sale_id=sale.id,
                product_id=product.id,
                qty=row.qty,
                price=product.sell_price,
                line_total=line_total,
            )
        )

    sale.total_amount = round(total, 2)
    db.commit()

    result = db.scalar(select(Sale).options(joinedload(Sale.items)).where(Sale.id == sale.id))
    return result


@router.get("/reports/daily")
def daily_report(day: date | None = None, db: Session = Depends(get_db)):
    target_day = day or datetime.utcnow().date()
    start = datetime.combine(target_day, time.min)
    end = datetime.combine(target_day, time.max)

    sales_count = db.scalar(
        select(func.count(Sale.id)).where(Sale.created_at >= start, Sale.created_at <= end)
    )
    revenue = db.scalar(
        select(func.coalesce(func.sum(Sale.total_amount), 0)).where(
            Sale.created_at >= start, Sale.created_at <= end
        )
    )
    low_stock = db.scalars(select(Product).where(Product.stock_qty <= Product.min_stock)).all()

    return {
        "date": target_day.isoformat(),
        "sales_count": sales_count,
        "revenue": float(revenue),
        "low_stock": [{"id": p.id, "name": p.name, "stock_qty": p.stock_qty} for p in low_stock],
    }
