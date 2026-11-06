# QUIET BATTLES™

A cinematic storefront and MongoDB-backed content studio for an independent fashion label. The React storefront includes the Series 01 archive, five story chapters, product detail, persistent bag, newsletter and a demonstration checkout. The Express API provides catalog management, admin authentication, order intake and Cloudinary signing.

## Stack

- React 18, Vite, Tailwind CSS, Framer Motion, React Router, Lucide, React Hot Toast
- Node.js, Express, Mongoose, MongoDB Atlas
- JWT and bcryptjs for admin authentication
- Cloudinary signed upload support

## Local setup

Requirements: Node.js 20+, npm, MongoDB Atlas URI (or local MongoDB).

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, a long unique `JWT_SECRET`, and an admin email/password. Set `CLIENT_ORIGIN=http://localhost:5173` for local work.
2. Install dependencies from the project root and both app folders:

   ```sh
   npm install
   npm --prefix frontend install
   npm --prefix backend install
   ```

3. Seed the database (safe to rerun; records are upserted by slug):

   ```sh
   npm --prefix backend run seed
   ```

4. Start both apps with `npm run dev`, or separately with `npm run dev:frontend` and `npm run dev:backend`.
5. Open <http://localhost:5173>. API health is at <http://localhost:5000/api/health>.

No administrator password is included in source. On server startup, the user specified by `ADMIN_EMAIL` and `ADMIN_PASSWORD` is created only if that email does not already exist. To rotate an existing credential, update it through a controlled database/admin process.

## Admin studio

Visit `/admin/login` and use the credentials configured in the backend environment. Admin creation (`POST /api/auth/register`) is protected by an existing admin token and requires a password of at least 12 characters. The dashboard reads live API collections and supports create, edit, and delete operations for series, chapters and products. Orders and newsletter data are available through admin-protected API endpoints. Cloudinary credentials enable signed uploads; upload the returned signature directly to Cloudinary from a trusted admin client.

Customers can create an account or sign in at `/account`. Passwords are bcrypt-hashed, and the API returns a 12-hour JWT. The session is stored in browser localStorage and can be ended with the visible **Log out** action in the header or account page. Customer registration is separate from administrator creation; `/api/auth/customer/register` only creates customer-role accounts.

## API

All responses use JSON. Admin endpoints require `Authorization: Bearer <JWT>`. Public catalog GET requests return published items; pass `?status=all` only for admin-facing API use (mutations remain protected).

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Service and database status |
| GET/POST | `/api/series` | Public/Admin | List published / create series |
| GET | `/api/series/:slug` | Public | Read published series |
| PUT/DELETE | `/api/series/:id` | Admin | Update/delete series |
| GET/POST | `/api/chapters` | Public/Admin | List published / create chapter |
| GET | `/api/chapters/:slug` | Public | Read published chapter |
| PUT/DELETE | `/api/chapters/:id` | Admin | Update/delete chapter |
| GET/POST | `/api/products` | Public/Admin | List published / create product |
| GET | `/api/products/:slug` | Public | Read published product |
| PUT/DELETE | `/api/products/:id` | Admin | Update/delete product |
| POST | `/api/auth/login` | Public | Authenticate admin/customer |
| POST | `/api/auth/register` | Admin | Create administrator |
| POST | `/api/auth/customer/register` | Public | Create customer account |
| GET | `/api/auth/me` | Authenticated | Read current user |
| POST | `/api/orders` | Public | Validate cart and create demo order |
| GET | `/api/orders` | Admin | List orders (optional `?status=`) |
| GET | `/api/orders/:id` | Admin | Read order details |
| PATCH | `/api/orders/:id/status` | Admin | Update order state |
| POST | `/api/newsletter/subscribe` | Public | Subscribe email |
| GET | `/api/newsletter` | Admin | List subscribers |
| POST | `/api/media/signature` | Admin | Request Cloudinary upload signature |

Series, chapter and product POST/PUT payloads correspond to the schemas in `backend/models.js`. Order items should include `slug`, `size`, and `quantity`; the API reads canonical product prices from MongoDB rather than trusting client prices.

## Environment

See `backend/.env.example`. Secrets stay on the backend. Never commit `.env` files. Configure Cloudinary values to turn on media upload signing. Image examples use Unsplash-hosted editorial photography URLs; replace them with owned campaign imagery for a live brand.

## Deployment

- Deploy `frontend` as a static Vite site and set the API proxy/rewrite to the backend host, or configure `VITE_API_BASE_URL` in an API client before deploying cross-origin.
- Deploy `backend` to a Node service, configure the environment variables, restrict CORS to the deployed frontend origin, and use a MongoDB Atlas database user with least privilege.
- Use HTTPS, rotate secrets, configure Cloudinary upload restrictions, review the privacy/terms copy, and set transactional email and shipping integrations before accepting real orders.
- Build the frontend with `npm run build` from the repository root.

## Assessment/demo scope

The checkout is intentionally a no-payment demonstration. The client cart persists in localStorage; the backend has order creation that validates products and decrements stock, but the demo checkout screen does not submit an order without customer details. The visual contact form is a local acknowledgement rather than a mail integration. Newsletter subscriptions do persist when the API/database is configured. A database connection and configured admin credentials are required for CMS changes to persist. Product imagery is remote demo photography, and Cloudinary signing is present but the dashboard does not yet include a complete upload/asset browser. Add payment, customer address capture, order submission from checkout, image upload UI, pagination, audit logging, email, tests and production observability before launch.
