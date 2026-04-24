from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.router import router
from app.db import Base, engine

app = FastAPI(
    title="Mini POS API",
    version="0.1.0",
    description=(
        "Backend API for Mini POS system.\n\n"
        "Use this API to manage products and stock, create sales, run daily operations "
        "(suppliers, purchases, shifts, expenses, returns), and get analytics/reports."
    ),
    openapi_tags=[
        {
            "name": "Core POS",
            "description": "Health check, products catalog, stock adjustments, and sales operations.",
        },
        {
            "name": "Operations",
            "description": "Suppliers, purchases, shift lifecycle, expenses, and customer returns.",
        },
        {
            "name": "Reports & Admin",
            "description": "Analytics reports, export endpoints, backups, audit logs, and label templates.",
        },
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Keep lightweight schema compatibility for existing SQLite databases.
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        cols = [row[1] for row in conn.execute(text("PRAGMA table_info(products)")).fetchall()]
        if "artikul" not in cols:
            conn.execute(text("ALTER TABLE products ADD COLUMN artikul VARCHAR(50)"))
        if "barcode" not in cols:
            conn.execute(text("ALTER TABLE products ADD COLUMN barcode VARCHAR(80)"))
        if "category" not in cols:
            conn.execute(text("ALTER TABLE products ADD COLUMN category VARCHAR(80) DEFAULT 'General'"))
        # Normalize legacy artikul values to digits-only.
        rows = conn.execute(text("SELECT id, artikul FROM products")).fetchall()
        for row in rows:
            val = row[1]
            if val is None:
                conn.execute(text("UPDATE products SET artikul = :art WHERE id = :id"), {"art": str(row[0] + 999), "id": row[0]})
            elif not str(val).isdigit():
                digits = "".join(ch for ch in str(val) if ch.isdigit())
                conn.execute(text("UPDATE products SET artikul = :art WHERE id = :id"), {"art": digits or str(row[0] + 999), "id": row[0]})


app.include_router(router, prefix="/api")
