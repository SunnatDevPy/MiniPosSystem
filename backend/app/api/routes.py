from datetime import date, datetime, time, timedelta
from io import BytesIO
from pathlib import Path
import shutil

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from openpyxl import Workbook
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.models.entities import (
    AuditLog,
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
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate, StockAdjust
from app.schemas.sale import SaleCreate, SaleOut

router = APIRouter()


def write_audit_log(
    db: Session,
    *,
    actor: str,
    action: str,
    entity: str,
    entity_id: str | None = None,
    details: str | None = None,
):
    db.add(
        AuditLog(
            actor=actor,
            action=action,
            entity=entity,
            entity_id=entity_id,
            details=details,
        )
    )


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
    write_audit_log(db, actor="system", action="create", entity="product", details=f"sku={payload.sku}")
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
    write_audit_log(db, actor="system", action="update", entity="product", entity_id=str(product.id))
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

        unit_price = (
            round(float(row.price_override), 2)
            if row.price_override is not None
            else round(float(product.sell_price), 2)
        )
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

    result = db.scalar(select(Sale).options(joinedload(Sale.items)).where(Sale.id == sale.id))
    return result


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

    purchase = Purchase(
        supplier_id=payload.supplier_id,
        created_by=payload.created_by,
        note=payload.note,
        total_amount=0,
    )
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
        db.add(
            PurchaseItem(
                purchase_id=purchase.id,
                product_id=row.product_id,
                qty=row.qty,
                buy_price=row.buy_price,
                line_total=line_total,
            )
        )
        db.add(
            StockMovement(
                product_id=row.product_id,
                qty_delta=row.qty,
                reason="purchase",
                note=f"purchase_id={purchase.id}",
            )
        )

    purchase.total_amount = round(total, 2)
    write_audit_log(
        db,
        actor=payload.created_by,
        action="create",
        entity="purchase",
        entity_id=str(purchase.id),
        details=f"supplier_id={payload.supplier_id},total={purchase.total_amount}",
    )
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
    return [
        {
            "id": r.id,
            "supplier_id": r.supplier_id,
            "supplier_name": r.name,
            "total_amount": float(r.total_amount),
            "created_by": r.created_by,
            "created_at": r.created_at.isoformat(),
        }
        for r in rows
    ]


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
    shift = db.scalar(select(Shift).where(Shift.status == "open").order_by(desc(Shift.opened_at)).limit(1))
    return shift


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
    if payload.shift_id is not None:
        shift = db.get(Shift, payload.shift_id)
        if not shift:
            raise HTTPException(status_code=404, detail="Shift not found")
    expense = Expense(**payload.model_dump())
    db.add(expense)
    write_audit_log(
        db,
        actor=payload.created_by,
        action="create",
        entity="expense",
        details=f"amount={payload.amount},category={payload.category}",
    )
    db.commit()
    db.refresh(expense)
    return expense


@router.get("/expenses")
def list_expenses(db: Session = Depends(get_db), limit: int = 100):
    safe_limit = max(1, min(limit, 500))
    rows = db.scalars(select(Expense).order_by(desc(Expense.created_at)).limit(safe_limit)).all()
    return rows


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
        db.add(
            ReturnItem(
                return_id=ret.id,
                product_id=row.product_id,
                qty=row.qty,
                price=price,
                line_total=line_total,
                reason=row.reason,
            )
        )
        db.add(
            StockMovement(
                product_id=row.product_id,
                qty_delta=row.qty,
                reason="return",
                note=f"return_id={ret.id}",
            )
        )

    ret.total_amount = round(total, 2)
    write_audit_log(
        db,
        actor=payload.cashier_name,
        action="create",
        entity="return",
        entity_id=str(ret.id),
        details=f"sale_id={payload.sale_id},total={ret.total_amount}",
    )
    db.commit()
    return {"id": ret.id, "sale_id": ret.sale_id, "total_amount": ret.total_amount}


@router.get("/returns")
def list_returns(db: Session = Depends(get_db), limit: int = 100):
    safe_limit = max(1, min(limit, 500))
    rows = db.scalars(select(Return).order_by(desc(Return.created_at)).limit(safe_limit)).all()
    return rows


@router.get("/reports/popular")
def popular_products(limit: int = 8, db: Session = Depends(get_db)):
    safe_limit = max(1, min(limit, 20))
    rows = db.execute(
        select(
            Product.id,
            Product.name,
            Product.sell_price,
            func.coalesce(func.sum(SaleItem.qty), 0).label("sold_qty"),
        )
        .join(SaleItem, SaleItem.product_id == Product.id)
        .where(SaleItem.qty > 0)
        .group_by(Product.id)
        .order_by(desc("sold_qty"))
        .limit(safe_limit)
    ).all()

    return [
        {
            "id": row.id,
            "name": row.name,
            "sell_price": float(row.sell_price),
            "sold_qty": float(row.sold_qty),
        }
        for row in rows
    ]


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
    expenses = db.scalar(
        select(func.coalesce(func.sum(Expense.amount), 0)).where(
            Expense.created_at >= start, Expense.created_at <= end
        )
    ) or 0
    returns_sum = db.scalar(
        select(func.coalesce(func.sum(Return.total_amount), 0)).where(
            Return.created_at >= start, Return.created_at <= end
        )
    ) or 0
    low_stock = db.scalars(select(Product).where(Product.stock_qty <= Product.min_stock)).all()

    return {
        "date": target_day.isoformat(),
        "sales_count": sales_count,
        "revenue": float(revenue),
        "expenses": float(expenses),
        "returns_amount": float(returns_sum),
        "net_revenue": float(revenue) - float(expenses) - float(returns_sum),
        "low_stock": [{"id": p.id, "name": p.name, "stock_qty": p.stock_qty} for p in low_stock],
    }


@router.get("/reports/dashboard")
def dashboard_report(db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    start = datetime.combine(today, time.min)
    end = datetime.combine(today, time.max)

    sales_count = db.scalar(select(func.count(Sale.id)).where(Sale.created_at >= start, Sale.created_at <= end)) or 0
    revenue = db.scalar(
        select(func.coalesce(func.sum(Sale.total_amount), 0)).where(
            Sale.created_at >= start, Sale.created_at <= end
        )
    ) or 0
    avg_check = float(revenue) / sales_count if sales_count else 0
    products_count = db.scalar(select(func.count(Product.id))) or 0
    low_stock_count = db.scalar(
        select(func.count(Product.id)).where(Product.stock_qty <= Product.min_stock)
    ) or 0
    out_of_stock_count = db.scalar(select(func.count(Product.id)).where(Product.stock_qty <= 0)) or 0
    open_shift = db.scalar(select(Shift).where(Shift.status == "open").order_by(desc(Shift.opened_at)).limit(1))
    today_expenses = db.scalar(
        select(func.coalesce(func.sum(Expense.amount), 0)).where(Expense.created_at >= start, Expense.created_at <= end)
    ) or 0

    recent_sales = db.execute(
        select(Sale.id, Sale.cashier_name, Sale.payment_type, Sale.total_amount, Sale.created_at)
        .order_by(desc(Sale.created_at))
        .limit(8)
    ).all()

    recent_movements = db.execute(
        select(
            StockMovement.id,
            StockMovement.created_at,
            StockMovement.qty_delta,
            StockMovement.reason,
            Product.name.label("product_name"),
        )
        .join(Product, Product.id == StockMovement.product_id)
        .order_by(desc(StockMovement.created_at))
        .limit(10)
    ).all()

    return {
        "today": {
            "sales_count": sales_count,
            "revenue": float(revenue),
            "avg_check": round(avg_check, 2),
            "expenses": float(today_expenses),
        },
        "inventory": {
            "products_count": products_count,
            "low_stock_count": low_stock_count,
            "out_of_stock_count": out_of_stock_count,
        },
        "shift": {
            "is_open": bool(open_shift),
            "id": open_shift.id if open_shift else None,
            "cashier_name": open_shift.cashier_name if open_shift else None,
            "opened_at": open_shift.opened_at.isoformat() if open_shift else None,
        },
        "recent_sales": [
            {
                "id": row.id,
                "cashier_name": row.cashier_name,
                "payment_type": row.payment_type,
                "total_amount": float(row.total_amount),
                "created_at": row.created_at.isoformat(),
            }
            for row in recent_sales
        ],
        "recent_movements": [
            {
                "id": row.id,
                "product_name": row.product_name,
                "qty_delta": float(row.qty_delta),
                "reason": row.reason,
                "created_at": row.created_at.isoformat(),
            }
            for row in recent_movements
        ],
    }


@router.get("/reports/sales-stats")
def sales_stats(
    from_dt: datetime | None = None,
    to_dt: datetime | None = None,
    db: Session = Depends(get_db),
):
    end = to_dt or datetime.utcnow()
    start = from_dt or (end - timedelta(days=1))
    if start >= end:
        raise HTTPException(status_code=400, detail="from_dt must be earlier than to_dt")

    sales_count = db.scalar(
        select(func.count(Sale.id)).where(Sale.created_at >= start, Sale.created_at <= end)
    ) or 0
    revenue = db.scalar(
        select(func.coalesce(func.sum(Sale.total_amount), 0)).where(Sale.created_at >= start, Sale.created_at <= end)
    ) or 0
    avg_check = float(revenue) / sales_count if sales_count else 0

    payment_rows = db.execute(
        select(Sale.payment_type, func.coalesce(func.sum(Sale.total_amount), 0).label("amount"))
        .where(Sale.created_at >= start, Sale.created_at <= end)
        .group_by(Sale.payment_type)
    ).all()

    hourly_rows = db.execute(
        select(func.strftime("%H", Sale.created_at).label("hour"), func.coalesce(func.sum(Sale.total_amount), 0).label("amount"))
        .where(Sale.created_at >= start, Sale.created_at <= end)
        .group_by("hour")
        .order_by("hour")
    ).all()

    weekday_rows = db.execute(
        select(func.strftime("%w", Sale.created_at).label("weekday"), func.coalesce(func.sum(Sale.total_amount), 0).label("amount"))
        .where(Sale.created_at >= start, Sale.created_at <= end)
        .group_by("weekday")
        .order_by("weekday")
    ).all()

    return {
        "range": {"from": start.isoformat(), "to": end.isoformat()},
        "summary": {
            "sales_count": sales_count,
            "revenue": float(revenue),
            "avg_check": round(avg_check, 2),
        },
        "payment_breakdown": [
            {"payment_type": row.payment_type, "amount": float(row.amount)} for row in payment_rows
        ],
        "hourly": [{"hour": row.hour, "amount": float(row.amount)} for row in hourly_rows],
        "weekday": [{"weekday": row.weekday, "amount": float(row.amount)} for row in weekday_rows],
    }


@router.get("/reports/export.xlsx")
def export_daily_xlsx(day: date | None = None, db: Session = Depends(get_db)):
    report = daily_report(day=day, db=db)
    wb = Workbook()
    ws = wb.active
    ws.title = "Daily Report"
    ws.append(["Metric", "Value"])
    ws.append(["Date", report["date"]])
    ws.append(["Sales Count", report["sales_count"]])
    ws.append(["Revenue", report["revenue"]])
    ws.append(["Expenses", report["expenses"]])
    ws.append(["Returns", report["returns_amount"]])
    ws.append(["Net Revenue", report["net_revenue"]])

    stream = BytesIO()
    wb.save(stream)
    stream.seek(0)
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="daily-report-{report["date"]}.xlsx"'},
    )


@router.get("/reports/export.pdf")
def export_daily_pdf(day: date | None = None, db: Session = Depends(get_db)):
    report = daily_report(day=day, db=db)
    stream = BytesIO()
    pdf = canvas.Canvas(stream, pagesize=A4)
    y = 800
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, f"Daily POS Report: {report['date']}")
    y -= 35
    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, y, f"Sales count: {report['sales_count']}")
    y -= 22
    pdf.drawString(50, y, f"Revenue: {report['revenue']:.2f}")
    y -= 22
    pdf.drawString(50, y, f"Expenses: {report['expenses']:.2f}")
    y -= 22
    pdf.drawString(50, y, f"Returns: {report['returns_amount']:.2f}")
    y -= 22
    pdf.drawString(50, y, f"Net revenue: {report['net_revenue']:.2f}")
    y -= 30
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Low stock:")
    pdf.setFont("Helvetica", 11)
    for row in report["low_stock"][:20]:
        y -= 18
        pdf.drawString(60, y, f"- {row['name']} (qty: {row['stock_qty']})")
    pdf.save()
    stream.seek(0)
    return StreamingResponse(
        stream,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="daily-report-{report["date"]}.pdf"'},
    )


@router.post("/admin/backup")
def create_backup():
    backend_dir = Path(__file__).resolve().parents[2]
    db_file = backend_dir / "pos.db"
    if not db_file.exists():
        raise HTTPException(status_code=404, detail="Database file not found")
    backups_dir = backend_dir / "backups"
    backups_dir.mkdir(exist_ok=True)
    stamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    target = backups_dir / f"pos-backup-{stamp}.db"
    shutil.copy2(db_file, target)
    return {"backup_name": target.name, "download_url": f"/api/admin/backup/{target.name}"}


@router.get("/admin/backup/{filename}")
def download_backup(filename: str):
    backend_dir = Path(__file__).resolve().parents[2]
    target = backend_dir / "backups" / filename
    if not target.exists():
        raise HTTPException(status_code=404, detail="Backup file not found")
    return FileResponse(path=target, filename=filename, media_type="application/octet-stream")


@router.get("/audit/logs")
def list_audit_logs(db: Session = Depends(get_db), limit: int = 200):
    safe_limit = max(1, min(limit, 1000))
    rows = db.scalars(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(safe_limit)).all()
    return rows
