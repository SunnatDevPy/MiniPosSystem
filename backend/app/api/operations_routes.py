"""Operational routes: suppliers, purchases, shifts, expenses, returns."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.utils import write_audit_log
from app.db import get_db
from app.models.entities import (
    Expense,
    Product,
    Purchase,
    PurchaseItem,
    Return,
    ReturnItem,
    Sale,
    SaleItem,
    Shift,
    StockMovement,
    Supplier,
)
from app.schemas.ops import ExpenseCreate, PurchaseCreate, ReturnCreate, ShiftClose, ShiftOpen, SupplierCreate

router = APIRouter()


@router.post("/suppliers")
def create_supplier(payload: SupplierCreate, db: Session = Depends(get_db)):
    exists = db.scalar(select(Supplier).where(Supplier.name == payload.name))
    if exists:
        raise HTTPException(status_code=400, detail="Supplier already exists")
    supplier = Supplier(**payload.model_dump())
    db.add(supplier)
    write_audit_log(db, actor="system", action="create", entity="supplier", details=supplier.name)
    db.commit()
    db.refresh(supplier)
    return supplier


@router.get("/suppliers")
def list_suppliers(db: Session = Depends(get_db)):
    return db.scalars(select(Supplier).order_by(Supplier.name)).all()


@router.post("/purchases")
def create_purchase(payload: PurchaseCreate, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Purchase must include items")
    supplier = db.get(Supplier, payload.supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    purchase = Purchase(supplier_id=payload.supplier_id, created_by=payload.created_by, note=payload.note, total_amount=0)
    db.add(purchase)
    db.flush()

    total = 0.0
    for row in payload.items:
        product = db.get(Product, row.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {row.product_id} not found")
        line_total = round(float(row.qty) * float(row.buy_price), 2)
        total += line_total
        product.stock_qty += row.qty
        product.buy_price = row.buy_price
        db.add(PurchaseItem(purchase_id=purchase.id, product_id=row.product_id, qty=row.qty, buy_price=row.buy_price, line_total=line_total))
        db.add(StockMovement(product_id=row.product_id, qty_delta=row.qty, reason="purchase", note=f"purchase_id={purchase.id}"))

    purchase.total_amount = round(total, 2)
    write_audit_log(db, actor=payload.created_by, action="create", entity="purchase", entity_id=str(purchase.id), details=f"supplier_id={payload.supplier_id},total={purchase.total_amount}")
    db.commit()
    return {"id": purchase.id, "total_amount": purchase.total_amount}


@router.get("/purchases")
def list_purchases(db: Session = Depends(get_db), limit: int = 50):
    safe_limit = max(1, min(limit, 200))
    rows = db.execute(
        select(Purchase.id, Purchase.supplier_id, Supplier.name, Purchase.total_amount, Purchase.created_by, Purchase.created_at)
        .join(Supplier, Supplier.id == Purchase.supplier_id)
        .order_by(desc(Purchase.created_at))
        .limit(safe_limit)
    ).all()
    return [{"id": r.id, "supplier_id": r.supplier_id, "supplier_name": r.name, "total_amount": float(r.total_amount), "created_by": r.created_by, "created_at": r.created_at.isoformat()} for r in rows]


@router.post("/shifts/open")
def open_shift(payload: ShiftOpen, db: Session = Depends(get_db)):
    opened = db.scalar(select(Shift).where(Shift.status == "open").limit(1))
    if opened:
        raise HTTPException(status_code=400, detail="Open shift already exists")
    shift = Shift(cashier_name=payload.cashier_name, opening_cash=payload.opening_cash, status="open")
    db.add(shift)
    write_audit_log(db, actor=payload.cashier_name, action="open", entity="shift")
    db.commit()
    db.refresh(shift)
    return shift


@router.get("/shifts/current")
def current_shift(db: Session = Depends(get_db)):
    return db.scalar(select(Shift).where(Shift.status == "open").order_by(desc(Shift.opened_at)).limit(1))


@router.get("/shifts")
def list_shifts(
    db: Session = Depends(get_db),
    limit: int = 200,
    from_dt: datetime | None = None,
    to_dt: datetime | None = None,
):
    """List shifts with optional date range filter."""
    safe_limit = max(1, min(limit, 1000))
    q = select(Shift)
    if from_dt is not None:
        q = q.where(Shift.opened_at >= from_dt)
    if to_dt is not None:
        q = q.where(Shift.opened_at <= to_dt)
    return db.scalars(q.order_by(desc(Shift.opened_at)).limit(safe_limit)).all()


@router.post("/shifts/{shift_id}/close")
def close_shift(shift_id: int, payload: ShiftClose, db: Session = Depends(get_db)):
    shift = db.get(Shift, shift_id)
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    if shift.status != "open":
        raise HTTPException(status_code=400, detail="Shift already closed")
    shift.status = "closed"
    shift.closing_cash = payload.closing_cash
    shift.closed_at = datetime.utcnow()
    shift.note = payload.note
    write_audit_log(db, actor=shift.cashier_name, action="close", entity="shift", entity_id=str(shift.id))
    db.commit()
    db.refresh(shift)
    return shift


@router.post("/expenses")
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    if payload.shift_id is not None and not db.get(Shift, payload.shift_id):
        raise HTTPException(status_code=404, detail="Shift not found")
    expense = Expense(**payload.model_dump())
    db.add(expense)
    write_audit_log(db, actor=payload.created_by, action="create", entity="expense", details=f"amount={payload.amount},category={payload.category}")
    db.commit()
    db.refresh(expense)
    return expense


@router.get("/expenses")
def list_expenses(db: Session = Depends(get_db), limit: int = 100):
    safe_limit = max(1, min(limit, 500))
    return db.scalars(select(Expense).order_by(desc(Expense.created_at)).limit(safe_limit)).all()


@router.post("/returns")
def create_return(payload: ReturnCreate, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Return must include items")
    sale = db.get(Sale, payload.sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    original_items = db.scalars(select(SaleItem).where(SaleItem.sale_id == payload.sale_id)).all()
    item_price = {item.product_id: item.price for item in original_items}
    item_qty = {item.product_id: item.qty for item in original_items}

    ret = Return(sale_id=payload.sale_id, cashier_name=payload.cashier_name, note=payload.note, total_amount=0)
    db.add(ret)
    db.flush()

    total = 0.0
    for row in payload.items:
        product = db.get(Product, row.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {row.product_id} not found")
        if row.product_id not in item_price:
            raise HTTPException(status_code=400, detail=f"Product {row.product_id} absent in original sale")
        if row.qty > abs(item_qty[row.product_id]):
            raise HTTPException(status_code=400, detail=f"Return qty exceeds sold qty for product {row.product_id}")
        price = float(item_price[row.product_id])
        line_total = round(price * row.qty, 2)
        total += line_total
        product.stock_qty += row.qty
        db.add(ReturnItem(return_id=ret.id, product_id=row.product_id, qty=row.qty, price=price, line_total=line_total, reason=row.reason))
        db.add(StockMovement(product_id=row.product_id, qty_delta=row.qty, reason="return", note=f"return_id={ret.id}"))

    ret.total_amount = round(total, 2)
    write_audit_log(db, actor=payload.cashier_name, action="create", entity="return", entity_id=str(ret.id), details=f"sale_id={payload.sale_id},total={ret.total_amount}")
    db.commit()
    return {"id": ret.id, "sale_id": ret.sale_id, "total_amount": ret.total_amount}


@router.get("/returns")
def list_returns(db: Session = Depends(get_db), limit: int = 100):
    safe_limit = max(1, min(limit, 500))
    return db.scalars(select(Return).order_by(desc(Return.created_at)).limit(safe_limit)).all()
