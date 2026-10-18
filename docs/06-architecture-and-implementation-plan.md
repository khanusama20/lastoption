# Project Architecture & Phased Implementation Plan: Last Option

**Document Version:** 1.0  
**Repository Structure:** Monorepo (`client_facing/`, `backend_api/`, `docs/`)

---

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                    CUSTOMER & ADMIN                                     |
|                              (Mobile Browsers & Desktop)                                |
+-----------------------------------------------------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                                      FRONTEND                                           |
|                   Nuxt 4 (Vue 3, TypeScript, Tailwind CSS, Pinia)                       |
|                                                                                         |
|  - Server-Side Rendering (SSR) for instant SEO-friendly product pages                   |
|  - Customer storefront (Home, Jackets, PDP, Cart, Checkout, Order Tracking)             |
|  - Admin Dashboard (/admin routes guarded by client-side & server-side middleware)       |
+-----------------------------------------------------------------------------------------+
                                             |
                                 REST API Calls / JSON
                             (Credentials: HttpOnly Cookie)
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                                      BACKEND                                            |
|                       Node.js + Express.js + TypeScript                                 |
|                                                                                         |
|  - Layered Architecture: Routes -> Controllers -> Services -> Database Models           |
|  - Zod Request Validation & Helmet Security Headers                                     |
|  - Atomic Database Transactions (Zero overselling guarantee)                            |
+-----------------------------------------------------------------------------------------+
       |                           |                          |                     |
       v                           v                          v                     v
+--------------+          +------------------+         +---------------+    +---------------+
|  PostgreSQL  |          |     Razorpay     |         |  Shiprocket / |    | Cloud Storage |
|   Database   |          | Payments Gateway |         |   Delhivery   |    | (Cloudinary/  |
| (ACID Model) |          | (Cards/UPI/NetB) |         | (Pincode/AWB) |    |  AWS S3)      |
+--------------+          +------------------+         +---------------+    +---------------+
```

---

## 2. Plain-English Explanation of Technical Decisions

1. **Why Nuxt 4 (SSR) instead of plain Vue SPA?**  
   - In fashion e-commerce, Google search ranking and WhatsApp/Instagram link previews are critical. A plain SPA loads as a blank page before JavaScript boots up. Nuxt 4 renders the jacket details and images directly on the server, so visitors and search engines see the full page instantly.
2. **Why Node.js + Express with TypeScript?**  
   - Express is battle-tested, lightweight, and predictable. Adding TypeScript ensures that the data structures in the backend match the frontend exactly, preventing silent runtime bugs (like calculating `price * quantity` where one is accidentally a string).
3. **Why PostgreSQL with Atomic Transactions?**  
   - If two customers attempt to buy the very last Size L bomber jacket at the exact same second, a regular database might let both orders pass, causing an oversold disaster. PostgreSQL allows us to lock the row (`SELECT FOR UPDATE`), guarantee that only one succeeds, and inform the other customer immediately.
4. **Why Tailwind CSS?**  
   - Tailwind lets us establish a tailored, luxury brand theme for *Last Option* (deep blacks, muted slates, refined typography, and subtle micro-animations) without bloating the application with heavy third-party CSS libraries.
5. **Why `HttpOnly` Cookies for Authentication?**  
   - Storing login tokens in `localStorage` leaves them vulnerable to malicious scripts (XSS). An `HttpOnly` cookie cannot be read or stolen by browser scripts, making customer accounts and admin privileges significantly safer.

---

## 3. Phased Implementation Plan

Implementation will proceed in 7 focused phases. Each phase will be verified before moving to the next.

### Phase 1: Environment & Database Setup
- Initialize the monorepo root and directory structure (`client_facing/`, `backend_api/`, `docs/`).
- Configure TypeScript, ESLint, and environment configurations (`.env.example`).
- Setup PostgreSQL schema using an ORM (Prisma or Drizzle) and create migration scripts.
- Write a database seed script with sample Last Option jacket collections, color/size variants, and a default admin user.

### Phase 2: Express Backend Foundation
- Implement authentication system (Register, Login, Logout, Me) with `bcrypt` and JWT in `HttpOnly` cookies.
- Create role-guard middleware (`requireAuth`, `requireAdmin`).
- Build catalog endpoints (`GET /api/v1/products`, `GET /api/v1/products/:slug`).
- Build courier serviceability check endpoint (`GET /api/v1/shipping/check-pincode`).

### Phase 3: Nuxt 4 Storefront UI & Product Experience
- Initialize `client_facing/` with Nuxt 4, Vue 3, and Tailwind CSS.
- Establish the brand design system: custom typography, luxury color tokens, buttons, inputs, and modals.
- Build the **Homepage**: Editorial Hero Banner, Brand Values, and Featured Jackets Grid.
- Build the **Catalog & Product Details Page (PDP)**:
  - Multi-image zoom/carousel.
  - Interactive Size (S-XXL) and Color swatches with real-time stock indicator.
  - Interactive Size Guide modal.
  - Pincode delivery estimator widget.

### Phase 4: Cart Drawer & Checkout Engine
- Implement Pinia Cart Store with `localStorage` persistence and slide-over cart drawer.
- Build the unified **Checkout Page** supporting both Guest and Logged-in checkout.
- Integrate **Razorpay SDK** for online card/UPI payments with HMAC signature validation.
- Integrate **Cash on Delivery (COD) OTP Modal**:
  - SMS/WhatsApp OTP dispatch and verification endpoint.
  - Atomic stock reservation upon OTP verification.

### Phase 5: Customer Account & Guest Order Tracking
- Build customer dashboard:
  - Saved address book management.
  - Order history with live status badges.
- Build public **Guest Order Tracking Page** (`/orders/track?id=...&token=...`) allowing buyers to track their package without logging in.

### Phase 6: Admin Panel & Order Fulfillment
- Build `/admin` portal guarded by admin role:
  - Dashboard overview: Revenue, pending orders, low-stock warnings.
  - Jacket catalog CRUD: Add new jackets and upload photos to Cloudinary/S3.
  - Quick Stock Matrix: Rapid inline editor to adjust stock counts across sizes and colors.
  - Order Fulfillment: Change order status, assign courier AWB tracking numbers, and print packing slips.

### Phase 7: Verification, Polish & Pre-Launch Audit
- Run end-to-end purchasing test for both Razorpay and COD flows.
- Verify race-condition handling on low-stock items.
- Run mobile responsiveness and performance audit (Lighthouse score 90+).
- Set up SEO metadata and Open Graph tags for social sharing.
