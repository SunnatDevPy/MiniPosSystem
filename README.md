# Mini POS Pro

Modern POS system for retail points (fruit/vegetable stores, mini markets, kiosk sales) with:
- cashier workflow (fast checkout, cart, receipt print)
- admin workflow (inventory and stock control)
- daily analytics and popular products
- bilingual UI (`RU` / `UZ`)
- installable web app experience (PWA basics)

## Highlights

- Role-based login screen (`admin` / `cashier`)
- Cashier mode:
  - product search by name/SKU
  - quick-add popular products
  - discounts and markup per line
  - return mode (negative quantity)
  - printable receipt (`window.print`)
  - shift number tracking
- Admin mode:
  - create products
  - adjust stock
  - daily report and low stock visibility
- UI/UX:
  - dark/light theme switch
  - tablet-friendly responsive layout
  - RU/UZ language switch

## Tech Stack

- Backend: `FastAPI` + `SQLAlchemy` + `SQLite`
- Frontend: `React` + `Vite`
- Optional: `Docker Compose`

## Project Structure

- `backend/app/main.py` - FastAPI app entry
- `backend/app/api/routes.py` - API routes (products, stock, sales, reports)
- `backend/app/models/entities.py` - DB models
- `backend/app/schemas/` - Pydantic schemas
- `frontend/src/App.jsx` - main POS UI (auth, cashier, admin)
- `frontend/src/App.css` - themes and responsive styles
- `frontend/src/api.js` - frontend API client
- `frontend/public/manifest.webmanifest` - PWA manifest
- `frontend/public/sw.js` - service worker

## Demo Access (current defaults)

These are local demo credentials in frontend code:
- `admin` password: `admin123`
- `cashier` password: `cashier123`

> Recommended for production: move auth to backend + hashed passwords + JWT/session.

## Run Locally

### 1) Backend

```bash
cd backend
py -3.13 -m pip install -r requirements.txt
py -3.13 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Backend URL: `http://localhost:8000`  
Swagger: `http://localhost:8000/docs`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Run with Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## API Endpoints

### System
- `GET /api/health`

### Products
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/{product_id}`

### Stock
- `POST /api/stock/adjust`

### Sales
- `POST /api/sales`
  - supports `price_override`
  - supports negative `qty` for returns

### Reports
- `GET /api/reports/daily`
- `GET /api/reports/popular?limit=8`

## Build Frontend

```bash
cd frontend
npm run build
```

## Roadmap (Next Level)

- Backend authentication and RBAC (JWT + permissions)
- Sale history UI + return by original receipt
- Receipt templates for 58mm/80mm thermal printers
- Customer loyalty, promo rules, multi-cashier shifts
- PostgreSQL + Alembic migrations + automated tests
