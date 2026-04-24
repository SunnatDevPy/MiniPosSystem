# Frontend architecture

## Current structure

- `app/` - application entry composition (`AppRoot.jsx`, app bootstrap wiring)
- `shared/` - reusable cross-feature code (API client, utilities, constants, UI)
  - `shared/api/client.js` - HTTP API layer for backend communication
  - `shared/config/i18n.js` - application translations
  - `shared/lib/demoData.js` - mock/fallback data providers
  - `shared/lib/receipt.js` - receipt printing helper
  - `shared/ui/` - reusable UI blocks (`BrandLogo`, `LoadingScreen`, charts)
- `App.jsx` - main container (still large, but already decomposed by shared modules)
- `App.css` - global styles

## Planned split (next steps)

- `features/cashier/` - cashier mode UI + logic
  - `features/cashier/CashierSection.jsx` - cashier page block extracted from `App.jsx`
- `features/admin/` - admin sections (reports, products, warehouse, finance, staff)
  - `features/admin/AdminSidebar.jsx` - sidebar navigation extracted from `App.jsx`
- `widgets/` - reusable page-level blocks (charts, tables, filters)
- `entities/` - domain models and DTO mappers (product, sale, shift, supplier)
- `shared/ui/` - reusable UI primitives (button, modal, card, tabs)
- `shared/lib/` - pure helpers (date/number formatting, localStorage adapters)

## Rules

- New API methods go only to `shared/api/client.js`
- New shared helpers go to `shared/lib/`
- New cross-feature UI goes to `shared/ui/`
- Feature-specific code should not be added to root `src/`
