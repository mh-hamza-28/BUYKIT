# BuyKIT - Full-Stack eCommerce Football Jersey Store

BuyKIT is a full-stack eCommerce web application for selling premium football jerseys. It started as a responsive HTML, CSS, and vanilla JavaScript storefront, then evolved into a production-style commerce system with authentication, product APIs, persistent carts, orders, Stripe payment integration, admin APIs, validation, security middleware, pagination, and caching.

> Current live frontend demo: https://mh-hamza-28.github.io/BUYKIT/

## Project Highlights

- Responsive football jersey storefront built with HTML5, CSS3, and vanilla JavaScript.
- Modular Express.js backend with controllers, routes, models, services, and middleware.
- JWT authentication for login, registration, protected cart, protected orders, and admin access.
- MongoDB database models for users, products, carts, and orders.
- Dynamic product rendering from backend APIs instead of hardcoded browser data.
- Product search, league filters, sorting, pagination, and in-memory response caching.
- User-specific cart persistence in the database.
- Checkout flow with shipping validation and backend-calculated order totals.
- Stripe PaymentIntent integration for online payments. [future]
- Admin APIs for dashboard stats, product management, and order status updates.
- Security middleware using Helmet, CORS, rate limiting, Mongo sanitization, and server-side validation.

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript ES Modules
- Fetch API
- LocalStorage for JWT session storage
- CSS Grid
- Flexbox
- CSS Variables
- Responsive media queries
- Google Fonts: Montserrat and Open Sans

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Stripe Node SDK
- dotenv
- Helmet
- CORS
- express-rate-limit
- express-mongo-sanitize
- Morgan

### Architecture Concepts Used

- REST API design
- MVC-style backend separation
- Middleware-based request processing
- JWT authentication and protected routes
- Role-based access control for admin APIs
- Service layer for business logic
- Database schema modeling with Mongoose
- Server-side validation and sanitization
- Pagination and query filtering
- Basic server-side caching
- Payment intent workflow
- Environment-based configuration
- Modular frontend API client

## Folder Structure

```text
BUYKIT/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── data/
│   │   └── seedProducts.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── tokenService.js
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── asyncHandler.js
│   │   └── cache.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── api/
│   │   └── client.js
│   ├── js/
│   │   └── auth.js
│   └── utils/
│       └── ui.js
├── index.html
├── auth.html
├── checkout.html
├── orders.html
├── tracking.html
├── buykit.css
├── responsive.css
├── buykit.js
├── checkout.js
├── order.js
├── tracking.js
├── API.md
├── SETUP.md
└── README.md
```

## Pages and UI Actions

| Page | Purpose | Main UI Actions |
| --- | --- | --- |
| `index.html` | Storefront/home page | Search products, filter by league, add jersey to cart |
| `auth.html` | Authentication | Register, login, logout |
| `checkout.html` | Cart and checkout | View cart, update quantity, remove item, add shipping, place order, create Stripe payment intent |
| `shipping-form.html` | Shipping form | Collect customer address before checkout |
| `orders.html` | Customer order history | View orders, cancel order, track package, open invoice |
| `tracking.html` | Order tracking | View order status, shipping details, item summary |
| `invoice.html` | Invoice view | Show invoice-style order information |

## API Overview

Base URL:

```text
http://localhost:5000/api
```

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Products

```http
GET /api/products
GET /api/products/:slug
```

Supported product query parameters:

```text
search
league
badge
minPrice
maxPrice
sort
page
limit
```

### Cart

```http
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:productId
DELETE /api/cart/items/:productId?size=M
DELETE /api/cart
```

### Orders

```http
POST  /api/orders
GET   /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/cancel
```

### Payments

```http
POST /api/payments/checkout-intent
POST /api/payments/webhook
```

### Admin

```http
GET   /api/admin/stats
POST  /api/admin/products
PATCH /api/admin/products/:id
GET   /api/admin/orders
PATCH /api/admin/orders/:id/status
```

Full API details are documented in [API.md](API.md).

## Environment Variables

Create this file:

```text
backend/.env
```

Use [backend/.env.example](backend/.env.example) as the template.

Important variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/buykit
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRY=1d
FRONTEND_ORIGIN=http://localhost:5000
CORS_ORIGIN=http://localhost:5000
CURRENCY=inr
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
ADMIN_EMAIL=admin@buykit.com
ADMIN_PASSWORD=Admin@12345
```

The backend also supports older task-manager style names such as `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, and `ACCESS_TOKEN_EXPIRY`.

Never commit real `.env` files to GitHub.

## Installation and Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/BUYKIT.git
cd BUYKIT
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Then update `.env` with your MongoDB, JWT, and Stripe values.

### 4. Seed products

```bash
npm run seed
```

This inserts the football jersey products and creates the first admin user.

### 5. Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

## NPM Scripts

Run these inside `backend/`:

```bash
npm run dev
```

Starts the API with Nodemon.

```bash
npm start
```

Starts the API with Node.

```bash
npm run seed
```

Seeds products and admin user.

## Example Fetch Calls

### Login

```js
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@buykit.com',
    password: 'Admin@12345'
  })
});

const data = await response.json();
localStorage.setItem('buykitToken', data.data.token);
```

### Fetch products with search and pagination

```js
const response = await fetch(
  'http://localhost:5000/api/products?search=madrid&league=LA%20LIGA&page=1&limit=12'
);
const data = await response.json();
```

### Add item to cart

```js
await fetch('http://localhost:5000/api/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('buykitToken')}`
  },
  body: JSON.stringify({
    productId: 'PRODUCT_ID_HERE',
    quantity: 1,
    size: 'M'
  })
});
```

### Create order

```js
await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('buykitToken')}`
  },
  body: JSON.stringify({
    shippingAddress: {
      fullName: 'Customer Name',
      mobile: '9876543210',
      email: 'customer@example.com',
      street: 'House 1, Football Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      landmark: 'Near stadium'
    }
  })
});
```

## Security Features

- Password hashing with bcryptjs.
- JWT authentication for protected APIs.
- Admin route protection with role checks.
- Helmet security headers.
- CORS configuration through environment variables.
- Rate limiting for API routes.
- MongoDB query sanitization.
- Backend validation for auth, cart, and checkout data.
- Server-side price calculation to prevent cart price manipulation.
- Real `.env` files ignored by Git.

## Stripe Payment Flow

The backend supports Stripe PaymentIntents:

1. User adds products to cart.
2. User enters shipping address.
3. Frontend calls `POST /api/payments/checkout-intent`.
4. Backend creates an order in `pending_payment` status.
5. Backend creates a Stripe PaymentIntent.
6. Frontend receives `clientSecret`.
7. Stripe webhook marks the order as paid after successful payment.

The next production step is connecting Stripe.js on the checkout page to confirm the payment with the returned `clientSecret`.

## Performance Features

- Product pagination to avoid loading too much data at once.
- Product filters handled by database queries.
- In-memory product list cache for repeated requests.
- Efficient cart summary calculation on the backend.
- Static frontend served by Express in production mode.

For a larger production system, replace the in-memory cache with Redis.

## SaaS and Multi-Tenant Upgrade Ideas

To turn BuyKIT into a scalable SaaS commerce platform:

- Add a `Tenant` or `Store` model.
- Add `tenantId` to users, products, carts, orders, payments, and admin records.
- Use subdomains like `store1.buykit.com`.
- Add tenant-aware middleware.
- Add seller dashboards.
- Add per-tenant Stripe Connect accounts.
- Add plans, subscriptions, and usage limits.
- Add audit logs for admin actions.
- Move caching to Redis.
- Add background workers for emails, invoices, inventory sync, and shipment updates.
- Add analytics dashboards for revenue, conversion rate, and product performance.

## Deployment Strategy

Recommended deployment:

- Frontend/static files: CDN, Vercel, Netlify, or served by Express.
- Backend API: Render, Railway, Fly.io, DigitalOcean, AWS ECS, or Azure App Service.
- Database: MongoDB Atlas.
- Cache: Redis Cloud or Upstash Redis.
- Payments: Stripe live keys and production webhook endpoint.
- Secrets: managed with platform environment variables.
- Monitoring: Sentry for errors, Logtail/Datadog for logs, UptimeRobot for uptime.
- Domain: HTTPS with a custom domain and strict CORS origin.

## Beginner-Friendly Explanation

Originally, BuyKIT was only a frontend project. That means the website could show products and store cart data in the browser, but it did not have a real database or real user accounts.

Now it works more like a real startup product:

1. The frontend shows pages and buttons.
2. The backend receives requests from those buttons.
3. MongoDB stores users, products, carts, and orders.
4. JWT tokens keep users logged in.
5. Protected routes make sure users can only access their own cart and orders.
6. Admin routes are only available to admin users.
7. Stripe is prepared for real payment processing.

In simple words: the frontend is what customers see, the backend is the brain, and MongoDB is the memory.

## Author

Built by Hamza as a full-stack eCommerce project focused on frontend fundamentals, backend architecture, API design, security, and scalable commerce concepts.
