# BuyKIT Setup Guide

## What Changed

My project started as HTML, CSS, and vanilla JavaScript. The browser was doing almost everything: showing products, creating random prices, storing cart items, storing shipping details, and storing orders in `localStorage`.

Now the project has a real eCommerce backend:

- `backend/` is the API server.
- `backend/models/` describes database data like users, products, carts, and orders.
- `backend/controllers/` receives requests and sends responses.
- `backend/routes/` defines the API URLs.
- `backend/services/` contains reusable business logic like cart totals, order creation, and Stripe.
- `backend/middlewares/` protects APIs with JWT and handles errors.
- `frontend/api/client.js` is the frontend's API helper.
- `frontend/utils/ui.js` contains small UI helpers for messages, money formatting, and loading buttons.

## Step-by-Step: How The App Works

1. A visitor opens `index.html`.
2. `buykit.js` calls `GET /api/products`.
3. The backend reads products from MongoDB and sends them to the browser.
4. The browser renders product cards.
5. If the user clicks Add to Cart while not logged in, they go to `auth.html`.
6. Login/register sends email and password to `/api/auth/login` or `/api/auth/register`.
7. The backend checks the user and returns a JWT token.
8. The frontend stores that token in `localStorage`.
9. Add to Cart now sends `productId`, `size`, and `quantity` to `/api/cart/items`.
10. The backend saves the cart for that user in MongoDB.
11. Checkout loads the user's cart from `/api/cart`.
12. Shipping form collects address details.
13. Place order sends address to `/api/orders`.
14. The backend creates an order from the cart, calculates the total, and clears the cart.
15. `orders.html` loads real orders from `/api/orders`.

## Run Locally

1. Install MongoDB locally, or create a MongoDB Atlas database.
2. Open a terminal in `backend/`.
3. Install dependencies:

```bash
npm install
```

4. Copy `.env.example` to `.env`.
5. Update `.env` values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/buykit
ACCESS_TOKEN_SECRET=use_a_long_random_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

6. Seed products and admin user:

```bash
npm run seed
```

7. Start backend:

```bash
npm run dev
```

8. Open:

```text
http://localhost:5000
```

The Express server serves your existing frontend files and the API together.

## Example Fetch Calls

Login:

```js
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'fola@example.com', password: 'Password123' })
});
```

Get products with search, filter, pagination:

```js
fetch('http://localhost:5000/api/products?search=madrid&league=LA%20LIGA&page=1&limit=12');
```

Add to cart:

```js
fetch('http://localhost:5000/api/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ productId, quantity: 1, size: 'M' })
});
```

Create order:

```js
fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({ shippingAddress })
});
```

## Stripe Notes

The backend creates PaymentIntents. The frontend currently calls `/api/payments/checkout-intent` and stores the returned `clientSecret`. The next production step is to add Stripe.js on `checkout.html` and call `stripe.confirmPayment(...)` with that client secret.

Use Stripe CLI for local webhooks:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## SaaS and Multi-Tenant Upgrade Path

To become a SaaS platform, add:

- `Tenant` model for each store or seller.
- `tenantId` on users, products, carts, and orders.
- Tenant-aware middleware that detects tenant from subdomain or request header.
- Per-tenant Stripe connected accounts.
- Role-based access like owner, manager, support, customer.
- Audit logs for admin actions.
- Redis cache instead of in-memory cache.
- Queue workers for emails, invoices, inventory sync, and shipping updates.

## Deployment Strategy

Recommended production setup:

- Frontend: serve through CDN or from Express behind Nginx.
- Backend: Render, Railway, Fly.io, AWS ECS, or DigitalOcean App Platform.
- Database: MongoDB Atlas.
- Cache: Redis Cloud or Upstash Redis.
- Payments: Stripe live keys and webhook endpoint.
- Secrets: platform environment variables, never committed to Git.
- Monitoring: Sentry for errors, Logtail/Datadog for logs, UptimeRobot for uptime.
- Security: HTTPS only, strong JWT secret, rate limits, Helmet, CORS locked to your real domain.
