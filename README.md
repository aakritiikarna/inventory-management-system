# Inventory Management System

A full-stack inventory dashboard built with React, Vite, Express, and MongoDB. It includes JWT authentication, role-based access, product and stock management, branches/warehouses, suppliers, orders, reports, image uploads, and responsive dashboard pages.

## Requirements

- Node.js 20.6 or newer (the server uses Node's `--env-file` option)
- npm
- MongoDB, local or hosted

## Setup

### Backend

```powershell
cd server
npm ci
Copy-Item .env.example .env
```

Set `MONGO_URI` and a long, unique `JWT_SECRET` in `server/.env`. Set `CORS_ORIGINS` to the exact browser origin(s) that will use the API, comma-separated. The development server also allows Vite's `localhost` and `127.0.0.1` ports `5170`–`5179`.

Start the API:

```powershell
npm run dev
```

It listens on `http://localhost:3000` by default. `GET /` reports API status; `GET /api/test-db` checks the MongoDB connection.

To create an administrator, set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` in `server/.env`, then run:

```powershell
npm run create-admin
```

To load the optional sample branches, products, orders, and administrator into an empty database, set the same administrator values and run `npm run seed`. Sample staff/customer users are created only when `DEMO_STAFF_PASSWORD` and/or `DEMO_CUSTOMER_PASSWORD` are set. Seeding does not update existing records, but it does add sample data; do not run it against a production database unless that is intended.

### Frontend

In another terminal:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```

`VITE_API_URL` defaults to `http://localhost:3000/api`; set it in `frontend/.env.local` when the API is hosted elsewhere. Start the frontend at the origin listed in `CORS_ORIGINS` for non-local development.

## Features

- JWT sign-in with admin, staff, and customer roles
- Server-enforced authorization for private inventory, order, user, supplier, and branch operations
- Product catalog and image uploads, categories, suppliers, and stock adjustment
- Branch/warehouse inventory, shipment views, low-stock indicators, and analytics
- Dashboard metrics, charts, report exports, order management, and profile settings
- Responsive layout, theme selection, and currency display preferences

The admin dashboard is shared across authenticated roles; restricted data and controls are enforced by the API and role-protected routes. Seeded sample accounts are optional and use the passwords configured in `.env`, not fixed credentials.

## Checks

```powershell
cd frontend
npm run lint
npm run build
```

```powershell
cd server
npm run test:rbac
```

Uploaded images and environment files are local runtime data and are excluded from Git. Never commit real credentials or production uploads.
