# MIR RAJ Tech Store

A bilingual (Bangla/English) e-commerce starter for MIR RAJ with a product catalogue, cart, checkout, WhatsApp handoff, and protected admin panel for products and orders.

## Stack
- Next.js 15 App Router + React + TypeScript
- PostgreSQL via Prisma (Neon is a good fit for Vercel)
- Signed, HTTP-only admin session cookie (JOSE)
- bcrypt password hashing
- Zod input validation

## Features
- Bangla/English language toggle
- Product search and category filters
- Product stock shown on storefront
- Cart with quantity changes
- Checkout creates an order in PostgreSQL and decrements stock transactionally
- WhatsApp opens with order summary when a valid number is configured
- Admin login at `/admin/login`
- Admin dashboard at `/admin`: add/edit products, toggle store visibility, review orders, update order status
- Cancelling an order restores its product stock

## Local setup
1. Install Node.js 20 or newer.
2. Create a PostgreSQL database, for example a Neon project.
3. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL`
   - `AUTH_SECRET` (at least 32 characters; use a unique random value)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD` (strong, unique password)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, e.g. `8801XXXXXXXXX`)
4. Install packages:
   ```bash
   npm install
   ```
5. Create tables and seed the admin plus sample products:
   ```bash
   npm run db:push
   npm run db:seed
   ```
6. Start:
   ```bash
   npm run dev
   ```
7. Visit `http://localhost:3000` and `/admin/login`.

The seed script intentionally refuses the sample placeholder password. Change `ADMIN_PASSWORD` before running it.

## Deploy to Vercel
1. Push this folder to a private or public GitHub repository.
2. Import the repository in Vercel.
3. Create a PostgreSQL database (Neon recommended) and set `DATABASE_URL` in Vercel Project Settings → Environment Variables.
4. Set `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, and `NEXT_PUBLIC_STORE_NAME`.
5. Deploy. Ensure the schema has been applied to the production database (`npx prisma db push`) and seed the admin account against that database once (`npm run db:seed` with production environment variables). Do not expose production credentials in a public repository or paste them into chat.
6. Redeploy after changing environment variables.

## Important before going live
- Sample product names, descriptions, prices, and stock are demo content. Replace them in the admin panel.
- Delivery fee is currently displayed as “confirmed based on address” and is stored as zero; configure your actual delivery pricing before launch.
- Payment is currently cash-on-delivery/manual confirmation. No online payment gateway is wired up.
- Add rate limiting, CAPTCHA or abuse protection to login and order endpoints before high-volume public launch.
- Add privacy policy, terms, return/refund policy, and shipping information.
- Use verified product images and HTTPS image URLs.
- Test stock race conditions, order cancellation, database backups, and admin access before accepting real orders.
- For production database migrations, prefer Prisma migrations (`prisma migrate deploy`) after creating and reviewing migrations rather than relying on `db push` for ongoing schema changes.

## Admin
- Login: `/admin/login`
- Dashboard: `/admin`
- Admin credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` when `npm run db:seed` runs.
