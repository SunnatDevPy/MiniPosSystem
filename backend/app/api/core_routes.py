"""Core POS routes: health, products, stock, sales."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.utils import write_audit_log
from app.db import get_db
from app.models.entities import Product, Sale, SaleItem, StockMovement
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate, StockAdjust
from app.schemas.sale import SaleCreate, SaleOut

router = APIRouter()


@router.get("/health")
def health():
    """Liveness endpoint for monitoring."""
    return {"status": "ok", "service": "mini-pos"}


@router.post("/products", response_model=ProductOut)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    if payload.barcode:
        barcode_exists = db.scalar(select(Product).where(Product.barcode == payload.barcode))
        if barcode_exists:
            raise HTTPException(status_code=400, detail="Product with this barcode already exists")

    # Artikul is generated automatically as numeric sequence starting from 1000.
    existing_artikuls = db.scalars(select(Product.artikul).where(Product.artikul.is_not(None))).all()
    max_num = 999
    for art in existing_artikuls:
        if isinstance(art, str) and art.isdigit():
            max_num = max(max_num, int(art))

    obj = Product(**payload.model_dump(), sku=f"AUTO-{max_num + 1}")
    db.add(obj)
    db.flush()
    obj.artikul = str(max_num + 1)
    write_audit_log(db, actor="system", action="create", entity="product", details=f"artikul={obj.artikul}")
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
    if payload.barcode:
        barcode_exists = db.scalar(select(Product).where(Product.barcode == payload.barcode, Product.id != product_id))
        if barcode_exists:
            raise HTTPException(status_code=400, detail="Product with this barcode already exists")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    if product.artikul and not str(product.artikul).isdigit():
        # Keep artikul numeric-only invariant.
        product.artikul = "".join(ch for ch in str(product.artikul) if ch.isdigit()) or str(product.id + 999)
    write_audit_log(db, actor="system", action="update", entity="product", entity_id=str(product.id))
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete product only when stock is exactly zero."""
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if float(product.stock_qty or 0) != 0:
        raise HTTPException(status_code=400, detail="Cannot delete product while stock is not zero")
    db.delete(product)
    write_audit_log(db, actor="system", action="delete", entity="product", entity_id=str(product_id))
    db.commit()
    return {"ok": True, "id": product_id}


@router.post("/stock/adjust", response_model=ProductOut)
def adjust_stock(payload: StockAdjust, db: Session = Depends(get_db)):
    product = db.get(Product, payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    new_qty = product.stock_qty + payload.qty_delta
    if new_qty < 0:
        raise HTTPException(status_code=400, detail="Not enough stock")
    product.stock_qty = new_qty
    db.add(
        StockMovement(
            product_id=product.id,
            qty_delta=payload.qty_delta,
            reason=payload.reason,
            note=payload.note,
        )
    )
    write_audit_log(
        db,
        actor="system",
        action="adjust",
        entity="stock",
        entity_id=str(product.id),
        details=f"delta={payload.qty_delta},reason={payload.reason}",
    )
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
        if row.qty == 0:
            raise HTTPException(status_code=400, detail="Qty cannot be zero")
        if row.qty > 0 and product.stock_qty < row.qty:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")

        unit_price = round(float(row.price_override), 2) if row.price_override is not None else round(float(product.sell_price), 2)
        product.stock_qty -= row.qty
        line_total = round(unit_price * row.qty, 2)
        total += line_total
        db.add(
            StockMovement(
                product_id=product.id,
                qty_delta=-row.qty,
                reason="sale",
                note=f"sale_id={sale.id}",
            )
        )
        db.add(
            SaleItem(
                sale_id=sale.id,
                product_id=product.id,
                qty=row.qty,
                price=unit_price,
                line_total=line_total,
            )
        )

    sale.total_amount = round(total, 2)
    write_audit_log(
        db,
        actor=payload.cashier_name,
        action="create",
        entity="sale",
        entity_id=str(sale.id),
        details=f"items={len(payload.items)},total={sale.total_amount}",
    )
    db.commit()
    return db.scalar(select(Sale).options(joinedload(Sale.items)).where(Sale.id == sale.id))


@router.get("/sales")
def list_sales(
    db: Session = Depends(get_db),
    limit: int = 200,
    from_dt: datetime | None = None,
    to_dt: datetime | None = None,
):
    """List recent checks with line items for admin checks screen."""
    safe_limit = max(1, min(limit, 1000))
    q = select(Sale).options(joinedload(Sale.items))
    if from_dt is not None:
        q = q.where(Sale.created_at >= from_dt)
    if to_dt is not None:
        q = q.where(Sale.created_at <= to_dt)
    rows = db.scalars(q.order_by(Sale.created_at.desc()).limit(safe_limit)).all()
    return [
        {
            "id": s.id,
            "cashier_name": s.cashier_name,
            "payment_type": s.payment_type,
            "total_amount": float(s.total_amount),
            "created_at": s.created_at.isoformat(),
            "items": [
                {
                    "product_id": i.product_id,
                    "qty": float(i.qty),
                    "price": float(i.price),
                    "line_total": float(i.line_total),
                }
                for i in s.items
            ],
        }
        for s in rows
    ]
