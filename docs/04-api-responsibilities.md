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
7. **Centralized Response Formatting & Structured Observability:**  
   - Enforces uniform API response envelopes via a typed `sendSuccess()` utility across all controllers, paired with the centralized `errorHandler`.
   - Utilizes **Pino** and `pino-http` for lightweight, vendor-agnostic HTTP request and application logging to stdout/stderr with automatic redaction of sensitive credentials and PII.

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
- **Centralized API Response Structure:**
  - Standardizes success and error response formats across all API endpoints using typed helpers (`sendSuccess`) instead of constructing repetitive response objects independently in controllers.
  - Preserves semantically appropriate HTTP status codes (e.g. `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `429 Too Many Requests`, `500 Internal Server Error`).
  - **Success Response Contract:**
    ```json
    {
      "success": true,
      "message": "Human-readable confirmation (optional)",
      "data": { ... } // Payload object or array (optional)
    }
    ```
  - **Error Response Contract (Aligned with centralized `errorHandler`):**
    ```json
    {
      "success": false,
      "error": {
        "message": "Error description or sanitized generic message",
        "details": [ ... ], // Optional field-level validation issues or error metadata
        "stack": "..."      // Conditionally included ONLY in development (NODE_ENV === 'development')
      }
    }
    ```
    - **Production Behavior (`NODE_ENV=production`):**
      - **Stack Traces:** Strictly omitted (`stack` is never present in API responses) to prevent internal system or filepath disclosure.
      - **5xx Server Errors:** Generic message returned (`"An unexpected internal server error occurred. Please try again later."`) masking internal error details and exception messages. Full error details are logged server-side only.
      - **4xx Client Errors:** Explicit, sanitized client messages (`err.message`) and structured validation details (`err.details`, such as Zod issue arrays) are returned.
    - **Non-Production Behavior (`NODE_ENV=development` / `NODE_ENV=test`):**
      - **Development (`NODE_ENV=development`):** `error.stack` is attached directly to the response object to assist local debugging, and actual error messages are preserved across both 4xx and 5xx errors.
      - **Test (`NODE_ENV=test`):** `error.stack` is omitted (same as production), preserving raw `err.message` for test assertions while keeping test output and assertions clean.
  - **Health Check Exception:** `GET /health` intentionally returns standard RFC-compatible `{ "status": "ok", "service": "...", "version": "...", ... }` rather than the application envelope, ensuring out-of-the-box compatibility with container orchestrators, Docker `HEALTHCHECK`, and load-balancer liveness probes.
- **Structured Request Logging with Pino:**
  - **Prerequisite Requirement:** Mandatory foundation task that must be fully implemented and verified before Phase 2.3 product catalog and inventory API implementation begins.
  - **Engine:** Uses **Pino** for structured application logging and `pino-http` for HTTP request logging.
  - **Captured Metadata:** Automatically generates and records unique correlation Request IDs (`req.id`), HTTP method, sanitized route/path, HTTP status code, request duration in milliseconds, environment, and sanitized error details on failures.
  - **Environment-Aware Output:**
    - *Development:* Formatted human-readable output using `pino-pretty`.
    - *Production:* High-throughput, single-line structured JSON streamed directly to `stdout` / `stderr`.
  - **Sensitive Data Redaction (Zero-Leakage Policy):**
    - Automatically redacts and never logs passwords, password hashes, OTPs, authentication tokens (`JWT`, `lo_auth_token`), cookies, `Authorization` headers, credit card / payment secrets, or unrestricted request/response bodies.
  - **Vendor-Agnostic Observability:**
    - Strictly follows 12-factor application logging (streaming directly to standard output).
    - Operates independently of hosting providers without introducing MongoDB, a separate logging database, or proprietary cloud-agent dependencies (e.g. AWS CloudWatch agents) into the application codebase.
- **Production Deployment Checklist:**
  - **Mandatory `NODE_ENV=production` Configuration:** All production host/container environments must explicitly set `NODE_ENV=production`. This activates:
    - Pre-flight secret validation at server boot, terminating immediately if secrets are missing, short, or placeholder values.
    - Masking of internal 5xx server errors into a generic user-facing message.
    - Strict suppression of stack traces in API error responses.
    - Single-line structured JSON log streaming to `stdout`/`stderr`.
    - Cookie security flags (`Secure=true`).
