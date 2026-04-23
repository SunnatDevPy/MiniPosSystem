"""Reporting, exports, admin backup and audit routes."""

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
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.entities import AuditLog, Expense, Product, Return, Sale, SaleItem, Shift, StockMovement

router = APIRouter()


@router.get("/reports/popular")
def popular_products(limit: int = 8, db: Session = Depends(get_db)):
    safe_limit = max(1, min(limit, 20))
    rows = db.execute(
        select(Product.id, Product.name, Product.sell_price, func.coalesce(func.sum(SaleItem.qty), 0).label("sold_qty"))
        .join(SaleItem, SaleItem.product_id == Product.id)
        .where(SaleItem.qty > 0)
        .group_by(Product.id)
        .order_by(desc("sold_qty"))
        .limit(safe_limit)
    ).all()
    return [{"id": row.id, "name": row.name, "sell_price": float(row.sell_price), "sold_qty": float(row.sold_qty)} for row in rows]


@router.get("/reports/daily")
def daily_report(day: date | None = None, db: Session = Depends(get_db)):
    target_day = day or datetime.utcnow().date()
    start = datetime.combine(target_day, time.min)
    end = datetime.combine(target_day, time.max)
    sales_count = db.scalar(select(func.count(Sale.id)).where(Sale.created_at >= start, Sale.created_at <= end))
    revenue = db.scalar(select(func.coalesce(func.sum(Sale.total_amount), 0)).where(Sale.created_at >= start, Sale.created_at <= end))
    expenses = db.scalar(select(func.coalesce(func.sum(Expense.amount), 0)).where(Expense.created_at >= start, Expense.created_at <= end)) or 0
    returns_sum = db.scalar(select(func.coalesce(func.sum(Return.total_amount), 0)).where(Return.created_at >= start, Return.created_at <= end)) or 0
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
    revenue = db.scalar(select(func.coalesce(func.sum(Sale.total_amount), 0)).where(Sale.created_at >= start, Sale.created_at <= end)) or 0
    avg_check = float(revenue) / sales_count if sales_count else 0
    products_count = db.scalar(select(func.count(Product.id))) or 0
    low_stock_count = db.scalar(select(func.count(Product.id)).where(Product.stock_qty <= Product.min_stock)) or 0
    out_of_stock_count = db.scalar(select(func.count(Product.id)).where(Product.stock_qty <= 0)) or 0
    open_shift = db.scalar(select(Shift).where(Shift.status == "open").order_by(desc(Shift.opened_at)).limit(1))
    today_expenses = db.scalar(select(func.coalesce(func.sum(Expense.amount), 0)).where(Expense.created_at >= start, Expense.created_at <= end)) or 0
    recent_sales = db.execute(select(Sale.id, Sale.cashier_name, Sale.payment_type, Sale.total_amount, Sale.created_at).order_by(desc(Sale.created_at)).limit(8)).all()
    recent_movements = db.execute(
        select(StockMovement.id, StockMovement.created_at, StockMovement.qty_delta, StockMovement.reason, Product.name.label("product_name"))
        .join(Product, Product.id == StockMovement.product_id)
        .order_by(desc(StockMovement.created_at))
        .limit(10)
    ).all()
    return {
        "today": {"sales_count": sales_count, "revenue": float(revenue), "avg_check": round(avg_check, 2), "expenses": float(today_expenses)},
        "inventory": {"products_count": products_count, "low_stock_count": low_stock_count, "out_of_stock_count": out_of_stock_count},
        "shift": {"is_open": bool(open_shift), "id": open_shift.id if open_shift else None, "cashier_name": open_shift.cashier_name if open_shift else None, "opened_at": open_shift.opened_at.isoformat() if open_shift else None},
        "recent_sales": [{"id": row.id, "cashier_name": row.cashier_name, "payment_type": row.payment_type, "total_amount": float(row.total_amount), "created_at": row.created_at.isoformat()} for row in recent_sales],
        "recent_movements": [{"id": row.id, "product_name": row.product_name, "qty_delta": float(row.qty_delta), "reason": row.reason, "created_at": row.created_at.isoformat()} for row in recent_movements],
    }


@router.get("/reports/sales-stats")
def sales_stats(from_dt: datetime | None = None, to_dt: datetime | None = None, db: Session = Depends(get_db)):
    end = to_dt or datetime.utcnow()
    start = from_dt or (end - timedelta(days=1))
    if start >= end:
        raise HTTPException(status_code=400, detail="from_dt must be earlier than to_dt")
    sales_count = db.scalar(select(func.count(Sale.id)).where(Sale.created_at >= start, Sale.created_at <= end)) or 0
    revenue = db.scalar(select(func.coalesce(func.sum(Sale.total_amount), 0)).where(Sale.created_at >= start, Sale.created_at <= end)) or 0
    avg_check = float(revenue) / sales_count if sales_count else 0
    payment_rows = db.execute(select(Sale.payment_type, func.coalesce(func.sum(Sale.total_amount), 0).label("amount")).where(Sale.created_at >= start, Sale.created_at <= end).group_by(Sale.payment_type)).all()
    hourly_rows = db.execute(select(func.strftime("%H", Sale.created_at).label("hour"), func.coalesce(func.sum(Sale.total_amount), 0).label("amount")).where(Sale.created_at >= start, Sale.created_at <= end).group_by("hour").order_by("hour")).all()
    weekday_rows = db.execute(select(func.strftime("%w", Sale.created_at).label("weekday"), func.coalesce(func.sum(Sale.total_amount), 0).label("amount")).where(Sale.created_at >= start, Sale.created_at <= end).group_by("weekday").order_by("weekday")).all()
    return {
        "range": {"from": start.isoformat(), "to": end.isoformat()},
        "summary": {"sales_count": sales_count, "revenue": float(revenue), "avg_check": round(avg_check, 2)},
        "payment_breakdown": [{"payment_type": row.payment_type, "amount": float(row.amount)} for row in payment_rows],
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
    return StreamingResponse(stream, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": f'attachment; filename="daily-report-{report["date"]}.xlsx"'})


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
    return StreamingResponse(stream, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="daily-report-{report["date"]}.pdf"'})


@router.post("/admin/backup")
def create_backup():
    """Create timestamped db snapshot in backups folder."""
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
    """Download existing backup file."""
    backend_dir = Path(__file__).resolve().parents[2]
    target = backend_dir / "backups" / filename
    if not target.exists():
        raise HTTPException(status_code=404, detail="Backup file not found")
    return FileResponse(path=target, filename=filename, media_type="application/octet-stream")


@router.get("/audit/logs")
def list_audit_logs(db: Session = Depends(get_db), limit: int = 200):
    """Read recent audit events."""
    safe_limit = max(1, min(limit, 1000))
    return db.scalars(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(safe_limit)).all()
