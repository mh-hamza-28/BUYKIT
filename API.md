# BuyKIT eCommerce API

Base URL: `http://localhost:5000/api`

All protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## UI Action Map

| Page | UI action | Backend endpoint |
| --- | --- | --- |
| `index.html` | Load jerseys | `GET /products?page=1&limit=12` |
| `index.html` | Search jerseys | `GET /products?search=real&page=1&limit=12` |
| `index.html` | Filter league tabs | `GET /products?league=LA%20LIGA&page=1&limit=12` |
| `index.html` | Add to cart | `POST /cart/items` |
| `auth.html` | Register | `POST /auth/register` |
| `auth.html` | Login | `POST /auth/login` |
| `checkout.html` | Review cart | `GET /cart` |
| `checkout.html` | Increase/decrease item | `PATCH /cart/items/:productId` |
| `checkout.html` | Remove item | `DELETE /cart/items/:productId?size=M` |
| `shipping-form.html` | Save shipping form | Browser stores temporary checkout address, then checkout sends it to backend |
| `checkout.html` | Place order | `POST /orders` |
| `checkout.html` | Stripe payment | `POST /payments/checkout-intent` |
| `orders.html` | My orders | `GET /orders` |
| `orders.html` | Cancel order | `PATCH /orders/:id/cancel` |
| `index.html` | Contact form | `POST /contact` |
| Admin dashboard | Store stats | `GET /admin/stats` |
| Admin dashboard | Create/update products | `POST /admin/products`, `PATCH /admin/products/:id` |
| Admin dashboard | Manage orders | `GET /admin/orders`, `PATCH /admin/orders/:id/status` |

## Auth

### `POST /auth/register`

Request:

```json
{ "name": "Fola", "email": "fola@example.com", "password": "Password123" }
```

Validation: name minimum 2 characters, valid email, password minimum 8 characters.

Response:

```json
{ "success": true, "data": { "token": "...", "user": { "id": "...", "name": "Fola", "email": "fola@example.com", "role": "customer" } } }
```

### `POST /auth/login`

Request:

```json
{ "email": "fola@example.com", "password": "Password123" }
```

## Products

### `GET /products`

Query parameters:

| Name | Example | Rule |
| --- | --- | --- |
| `search` | `madrid` | Text search against product name |
| `league` | `LA LIGA` | Exact league filter |
| `badge` | `HOT` | Optional badge filter |
| `minPrice` | `500` | Numeric |
| `maxPrice` | `1000` | Numeric |
| `sort` | `price_asc` | `price_asc`, `price_desc`, `newest`, `name` |
| `page` | `1` | Minimum 1 |
| `limit` | `12` | 1 to 50 |

Response includes `products` and `pagination`. Results are cached in memory for 60 seconds.

## Cart

### `POST /cart/items`

Request:

```json
{ "productId": "mongoProductId", "quantity": 2, "size": "M" }
```

Validation: product must exist, size must be available, quantity must be 1-10, stock must be enough.

### `PATCH /cart/items/:productId`

Request:

```json
{ "quantity": 3, "size": "M" }
```

## Orders

### `POST /orders`

Request:

```json
{
  "shippingAddress": {
    "fullName": "Fola",
    "mobile": "9876543210",
    "email": "fola@example.com",
    "street": "House 1, Football Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "landmark": "Near stadium"
  }
}
```

Validation: all fields except `landmark` are required, mobile is 10 digits, pincode is 6 digits, email must be valid.

Important: the backend calculates totals from database prices. The browser never sends price.

## Payments

### `POST /payments/checkout-intent`

Creates an order in `pending_payment` status and returns a Stripe PaymentIntent client secret.

Request: same shipping address payload as `POST /orders`.

Response:

```json
{ "success": true, "data": { "orderId": "...", "clientSecret": "...", "amount": 1978, "currency": "inr" } }
```

### `POST /payments/webhook`

Stripe webhook. On `payment_intent.succeeded`, the matching order becomes `paid` and the user's cart is cleared.

## Contact

### `POST /contact`

Sends the contact form message to `CONTACT_TO_EMAIL`.

Request:

```json
{ "name": "Customer Name", "email": "customer@example.com", "subject": "Order question", "message": "I need help with my order." }
```

Validation: name minimum 2 characters, valid email, message minimum 10 characters, subject maximum 120 characters.

## Admin

Admin endpoints require a JWT for a user with role `admin`.

### `GET /admin/stats`

Returns customer count, active product count, order count, and revenue.

### `POST /admin/products`

Request:

```json
{ "name": "REAL MADRID", "image": "images/jersey/r-madrid.png", "price": 899, "league": "LA LIGA", "season": "2025/26", "badge": "BESTSELLER", "stock": 100 }
```

### `GET /admin/orders?status=processing&page=1&limit=20`

Paginated admin order list.

### `PATCH /admin/orders/:id/status`

Request:

```json
{ "status": "shipped", "trackingNumber": "IN123456789" }
```
