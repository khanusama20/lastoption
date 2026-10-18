# Express Backend API Responsibilities: Last Option

**Document Version:** 1.0  
**Stack:** Node.js, Express.js, TypeScript, PostgreSQL  
**Architecture Pattern:** Clean Layered Architecture (`Routes` -> `Controllers` -> `Services` -> `Database / Models`)

---

## 1. Core Architectural Responsibilities

The `backend_api/` server acts as the single source of truth for all business operations, inventory, and transactions. It is designed to be lean, secure, and resilient.

1. **Authentication & Role Authorization:**  
   Issues signed JWT tokens inside secure, `HttpOnly`, `SameSite=Lax` cookies. Protects sensitive customer endpoints and strictly enforces the `admin` role for store operations.
2. **Product Catalog & Real-Time Inventory Control:**  
   Serves jacket listings, variant availability, and prevents "overselling" by using atomic PostgreSQL database transactions (`SELECT ... FOR UPDATE`) during checkout.
3. **Logistics & Courier API Integration:**  
   Connects to courier APIs (Shiprocket or Delhivery) to validate Indian 6-digit postal PIN codes, verify serviceability, and fetch live shipping rates based on parcel dimensions/weight.
4. **Payment Orchestration & Webhook Verification:**  
   - Interacts with Razorpay's API to generate order tokens.
   - Verifies Razorpay HMAC-SHA256 signatures before confirming payment.
   - Listens to asynchronous Razorpay webhooks to capture delayed payments gracefully.
5. **Cash on Delivery (COD) Anti-Fraud Engine:**  
   Generates secure, time-limited 4-digit OTPs sent via SMS/WhatsApp, preventing unverified or fake orders from entering the warehouse queue.
6. **Immutable Order Processing:**  
   Snapshots customer addresses and product prices at the exact time of checkout, ensuring financial and legal compliance.

---

## 2. API Endpoints Specification

All endpoints are prefixed with `/api/v1`.

### 2.1. Authentication & Profile (`/api/v1/auth`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Create new customer account with email/password |
| `POST` | `/auth/login` | Public | Verify credentials, set secure `HttpOnly` JWT cookie |
| `POST` | `/auth/logout` | Authenticated | Clear session cookie |
| `GET` | `/auth/me` | Authenticated | Retrieve current user profile and role |
| `PUT` | `/auth/profile` | Authenticated | Update user details (name, phone) |

---

### 2.2. Customer Addresses (`/api/v1/addresses`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/addresses` | Authenticated | List all saved addresses for logged-in user |
| `POST` | `/addresses` | Authenticated | Save a new delivery address |
| `PUT` | `/addresses/:id` | Authenticated | Edit an existing address |
| `DELETE`| `/addresses/:id` | Authenticated | Remove an address |
| `PATCH`| `/addresses/:id/default`| Authenticated | Mark address as primary |

---

### 2.3. Catalog & Products (`/api/v1/products`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Public | List published jackets with filtering (size, color, sort) |
| `GET` | `/products/:slug` | Public | Retrieve full jacket details, photo gallery, and variant stock |
| `GET` | `/products/:id/check-stock` | Public | Real-time check of available stock for a specific size/color |

---

### 2.4. Shipping & Pincode Checker (`/api/v1/shipping`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/shipping/check-pincode` | Public | Query courier API for 6-digit PIN serviceability & estimated days |
| `POST` | `/shipping/calculate-rates` | Public | Calculate exact shipping cost based on cart weight & destination |

---

### 2.5. Shopping Cart (`/api/v1/cart`)
*Note: Guest carts are stored client-side in `localStorage`. Logged-in carts sync with the database.*
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/cart` | Authenticated | Retrieve user's current saved cart items |
| `POST` | `/cart/items` | Authenticated | Add variant to cart with specified quantity |
| `PUT` | `/cart/items/:id` | Authenticated | Update line-item quantity |
| `DELETE`| `/cart/items/:id` | Authenticated | Remove line-item from cart |
| `POST` | `/cart/sync` | Authenticated | Merge guest `localStorage` items into DB upon login |

---

### 2.6. Checkout & Payments (`/api/v1/checkout`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/checkout/initiate-order` | Public / Auth | Validates stock, calculates final bill, and reserves draft order |
| `POST` | `/checkout/razorpay/create`| Public / Auth | Generates official Razorpay Order ID for online payment |
| `POST` | `/checkout/razorpay/verify`| Public / Auth | Verifies Razorpay payment signature & confirms order |
| `POST` | `/checkout/cod/send-otp` | Public / Auth | Generates & dispatches 4-digit SMS OTP to customer phone |
| `POST` | `/checkout/cod/verify-otp` | Public / Auth | Validates OTP, reserves inventory, and marks order as `PLACED` |
| `POST` | `/checkout/webhook/razorpay` | Razorpay Server | Webhook listener for asynchronous payment events |

---

### 2.7. Customer & Guest Orders (`/api/v1/orders`)
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/orders` | Authenticated | List all past orders for logged-in user |
| `GET` | `/orders/:id` | Authenticated | View detailed receipt & courier tracking for an order |
| `GET` | `/orders/track` | Public (Token) | Guest order tracking via `orderNumber` + `trackingToken` |

---

### 2.8. Admin Panel Endpoints (`/api/v1/admin`)
*Strictly guarded by `adminAuthMiddleware` (checks `role === 'admin'`).*
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/metrics` | Admin | Today's revenue, order counts, pending shipments, low stock |
| `GET` | `/admin/products` | Admin | List all jackets (including drafts/unpublished) |
| `POST` | `/admin/products` | Admin | Create new jacket with initial variants & images |
| `PUT` | `/admin/products/:id` | Admin | Update jacket details, description, pricing |
| `PATCH`| `/admin/variants/:id/stock`| Admin | Instant stock count update for a specific size/color |
| `GET` | `/admin/orders` | Admin | Paginated list of all orders with status/date filters |
| `GET` | `/admin/orders/:id` | Admin | Full order audit view with payment details & customer history |
| `PATCH`| `/admin/orders/:id/status`| Admin | Update order status (`PROCESSING`, `SHIPPED`, `CANCELLED`) |
| `POST` | `/admin/orders/:id/fulfill`| Admin | Assign courier name & AWB tracking number (triggers customer alert) |

---

## 3. Security, Validation & Error Handling

- **Request Validation:** Every incoming request body is validated using **Zod** schemas before reaching the controller. If validation fails, a uniform `400 Bad Request` with field-specific messages is returned.
- **Atomic Concurrency (No Overselling):**  
  When an order is confirmed, stock subtraction happens within a PostgreSQL transaction:
  ```sql
  UPDATE product_variants 
  SET stock_quantity = stock_quantity - :qty 
  WHERE id = :variantId AND stock_quantity >= :qty;
  ```
  If zero rows are updated, the transaction aborts and notifies the shopper that the jacket just sold out.
- **Rate Limiting:** `express-rate-limit` prevents brute-force attempts on `/auth/login` and `/checkout/cod/send-otp`.
- **CORS & Headers:** Uses `helmet` for secure HTTP headers and restricts CORS strictly to the Nuxt frontend domain.
