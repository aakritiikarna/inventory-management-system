# StockPilot — Inventory & Warehouse Management System

A full-stack inventory and warehouse management system.

- **Backend:** Django 5 + DRF + PostgreSQL + JWT (SimpleJWT) + RBAC
- **Frontend:** React + Vite + Tailwind CSS + React Router + Axios + Recharts

## Project Structure

```
Inventory-System/
├── backend/
│   ├── accounts/        # custom user model, auth, RBAC permissions
│   ├── suppliers/
│   ├── warehouses/
│   ├── products/
│   ├── stock/           # StockItem + StockTransaction ledger
│   ├── purchase_orders/ # PO + line items + approve/receive workflow
│   ├── reports/         # dashboard + CSV/Excel report exports
│   └── config/          # settings, root urls
└── frontend/
    └── src/
        ├── api/         # axios client + endpoint definitions
        ├── components/  # DataTable, Modal, StatusBadge, etc.
        ├── pages/        # one file per route
        ├── layouts/     # Sidebar, Navbar, MainLayout
        ├── context/     # AuthContext (JWT login/refresh/logout)
        └── routes via App.jsx
```

## Backend Setup

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Configure these via a .env file or your shell environment:
#   POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT
#   DJANGO_SECRET_KEY, DJANGO_DEBUG, DJANGO_ALLOWED_HOSTS
#   CORS_ALLOWED_ORIGINS

python manage.py migrate
python manage.py createsuperuser   # create your first Admin account
python manage.py runserver
```

The API is served at `http://localhost:8000/api/`. Django admin at `/admin/`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies `/api` requests to `http://localhost:8000` (see `vite.config.js`).

## Roles

- **Admin** — full access, including user management (`/api/accounts/users/`)
- **Warehouse Manager** — full access to operational data (products, suppliers, warehouses, stock, purchase orders) but not user accounts
- **Staff** — read access everywhere, can record stock transactions, cannot create/delete master data or approve purchase orders

New self-registrations are always created as **Staff**; an Admin must promote a user via the admin user-management endpoint.

## Key Workflows

- **Purchase Order lifecycle:** Draft → Approve → Receive (creates Stock-In transactions automatically) | Draft/Approved → Cancel
- **Stock movements:** Stock In, Stock Out, Adjustment, Transfer — all recorded as immutable `StockTransaction` rows and applied atomically to `StockItem` balances
- **Reports:** Stock, Supplier, Warehouse, and Purchase Order reports, each exportable as CSV or Excel via `?format=csv` / `?format=excel`

## Notes on Production Readiness

- Set `DJANGO_DEBUG=False`, a strong `DJANGO_SECRET_KEY`, and proper `DJANGO_ALLOWED_HOSTS` in production.
- Put Postgres credentials and `CORS_ALLOWED_ORIGINS` in environment variables / secrets manager, never in source control.
- Run `npm run build` and serve the static `frontend/dist` output behind your web server / CDN, with the Django API behind a reverse proxy (e.g. Nginx) and Gunicorn.
