# Restaurant Admin Backend

Node.js + Express + TypeScript + PostgreSQL + Prisma backend for the admin panel.

## Scope (Current)
- Admin authentication (login + current admin profile)
- Dashboard APIs (cards, charts, active offers, popular items)
- Orders APIs (list, details, create, status updates)

## Quick Start
1. Copy env:
   - `cp .env.example .env`
2. Install:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Seed sample data:
   - `npm run prisma:seed`
6. Start dev server:
   - `npm run dev`

## Base URL
- `http://localhost:5000/api/v1`

## Auth
- `POST /auth/login`
- `GET /auth/me` (Bearer token required)

## Dashboard
- `GET /dashboard/summary`
- `GET /dashboard/revenue-trend?days=7`
- `GET /dashboard/order-status`
- `GET /dashboard/active-offers`
- `GET /dashboard/popular-items?foodType=all|veg|nonveg`

## Orders
- `GET /orders?status=&search=&page=1&limit=10`
- `GET /orders/:id`
- `POST /orders`
- `PATCH /orders/:id/status`

