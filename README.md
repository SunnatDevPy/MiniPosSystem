# Mini POS System (Fruits & Vegetables)

MVP POS system with:
- Warehouse (stock control)
- Cash register (sales)
- Daily report

## Stack

- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + Vite
- Optional run: Docker Compose

## Project Structure

- `backend/app/main.py` - FastAPI app
- `backend/app/api/routes.py` - API routes
- `backend/app/models/entities.py` - database models
- `frontend/src/App.jsx` - simple POS interface

## Run Locally (without Docker)

### Backend

1. Create and activate virtual environment
2. Install dependencies
3. Start API server

Commands:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API URL: `http://localhost:8000`

### Frontend

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
- Swagger docs: `http://localhost:8000/docs`

## Main API Endpoints

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/{product_id}`
- `POST /api/stock/adjust`
- `POST /api/sales`
- `GET /api/reports/daily`

## Next Suggested Improvements

- JWT auth + roles (admin/cashier/storekeeper)
- Receipt printing and return flow
- Batch-based stock with expiration dates
- PostgreSQL + Alembic migrations
