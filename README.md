# Mini POS Pro

Русский | O'zbek | English

## Contents

- [RU](#ru)
- [UZ](#uz)
- [EN](#en)
- [Screenshots](#screenshots)

---

## RU

Современная POS-система для розничных точек (овощи/фрукты, мини-маркеты, киоски):
- касса (быстрое оформление, корзина, печать чека)
- админка (товары и управление остатками)
- дневная аналитика и популярные товары
- переключение интерфейса `RU / UZ`
- режим установки как приложение (PWA)

### Основные возможности

- Вход по ролям: `admin` / `cashier`
- Режим кассы:
  - поиск по названию и SKU
  - быстрые кнопки популярных товаров
  - скидка и наценка по позиции
  - возврат (отрицательное количество)
  - печать чека (`window.print`)
  - номер смены
- Режим админа:
  - добавление товаров
  - корректировка остатков
  - дневной отчет
- UI:
  - темная/светлая тема
  - адаптация под планшет
  - RU/UZ

### Стек

- Backend: `FastAPI` + `SQLAlchemy` + `SQLite`
- Frontend: `React` + `Vite`
- Опционально: `Docker Compose`

### Демо-доступ

- `admin`: `admin123`
- `cashier`: `cashier123`

> Для production рекомендуется вынести авторизацию в backend (JWT/сессии, хэшированные пароли).

### Локальный запуск

Backend:

```bash
cd backend
py -3.13 -m pip install -r requirements.txt
py -3.13 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### API

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/{product_id}`
- `POST /api/stock/adjust`
- `POST /api/sales` (поддерживает `price_override` и отрицательный `qty` для возвратов)
- `GET /api/reports/daily`
- `GET /api/reports/popular?limit=8`

---

## UZ

Zamonaviy POS tizimi (meva/sabzavot do'koni, mini-market, kiosklar) uchun:
- kassa qismi (tez savdo, savat, chek chop etish)
- admin qismi (mahsulot va qoldiq boshqaruvi)
- kunlik analitika va ommabop mahsulotlar
- interfeys `RU / UZ`
- ilova sifatida o'rnatish (PWA)

### Asosiy imkoniyatlar

- Rollar bo'yicha kirish: `admin` / `cashier`
- Kassa rejimi:
  - nomi va SKU bo'yicha qidiruv
  - ommabop mahsulotlar tez tugmalari
  - pozitsiya bo'yicha chegirma/ustama
  - qaytarish (manfiy miqdor)
  - chek chop etish (`window.print`)
  - smena raqami
- Admin rejimi:
  - mahsulot qo'shish
  - qoldiqni tuzatish
  - kunlik hisobot
- UI:
  - qorong'i/yorug' mavzu
  - planshet uchun moslashuvchan dizayn
  - RU/UZ

### Texnologiyalar

- Backend: `FastAPI` + `SQLAlchemy` + `SQLite`
- Frontend: `React` + `Vite`
- Ixtiyoriy: `Docker Compose`

### Demo kirish

- `admin`: `admin123`
- `cashier`: `cashier123`

> Production uchun autentifikatsiyani backend'ga ko'chirish tavsiya etiladi (JWT/session, parol xeshlash).

### Lokal ishga tushirish

Backend:

```bash
cd backend
py -3.13 -m pip install -r requirements.txt
py -3.13 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### API

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/{product_id}`
- `POST /api/stock/adjust`
- `POST /api/sales` (`price_override` va qaytarish uchun manfiy `qty` qo'llanadi)
- `GET /api/reports/daily`
- `GET /api/reports/popular?limit=8`

---

## EN

Modern POS system for retail stores (fruit/vegetable shops, mini-markets, kiosks):
- cashier workflow (fast checkout, cart, receipt printing)
- admin workflow (products and stock control)
- daily analytics and popular products
- `RU / UZ` UI language switch
- installable app-like mode (PWA)

### Key Features

- Role-based access: `admin` / `cashier`
- Cashier mode:
  - product search by name/SKU
  - quick buttons for popular products
  - discount/markup per line
  - return mode (negative quantity)
  - receipt print (`window.print`)
  - shift number support
- Admin mode:
  - create products
  - adjust stock
  - daily report
- UI:
  - dark/light theme
  - tablet-friendly responsive layout
  - RU/UZ localization

### Tech Stack

- Backend: `FastAPI` + `SQLAlchemy` + `SQLite`
- Frontend: `React` + `Vite`
- Optional: `Docker Compose`

### Demo Credentials

- `admin`: `admin123`
- `cashier`: `cashier123`

> For production, move authentication to backend (JWT/sessions, hashed passwords).

### Run Locally

Backend:

```bash
cd backend
py -3.13 -m pip install -r requirements.txt
py -3.13 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### API

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `PATCH /api/products/{product_id}`
- `POST /api/stock/adjust`
- `POST /api/sales` (supports `price_override` and negative `qty` for returns)
- `GET /api/reports/daily`
- `GET /api/reports/popular?limit=8`

---

## Screenshots

Add your UI images into `docs/screenshots/` and reference them here.

Example:

```md
![Cashier RU](docs/screenshots/cashier-ru.png)
![Admin UZ](docs/screenshots/admin-uz.png)
![Cashier EN Dark](docs/screenshots/cashier-en-dark.png)
```
