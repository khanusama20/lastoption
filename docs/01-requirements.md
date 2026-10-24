# Project Requirements Document: Last Option (E-Commerce Store)

**Brand Name:** Last Option  
**Core Category:** Men's Jackets  
**Target Market:** India (Currency: INR ₹)  
**Document Version:** 1.0 (Draft for Review)  

---

## 1. Project Overview & Vision
Last Option is a premium, minimalist direct-to-consumer (D2C) men's apparel brand. The initial launch focuses exclusively on Jackets. The goal is to deliver a smooth, high-conversion shopping experience that feels fast, modern, and reliable on both mobile and desktop devices.

The architecture separates the frontend customer experience and backend business logic into two clean codebases:
- `client_facing/`: Nuxt 4 (Vue 3, TypeScript, Tailwind CSS)
- `backend_api/`: Node.js (Express.js, TypeScript, PostgreSQL)

---

## 2. Key Business Decisions (From Alignment)
1. **Market & Currency:** India (INR `₹`), with standard Indian mobile number formatting (`+91`).
2. **Payments:**
   - **Razorpay**: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Netbanking.
   - **Cash on Delivery (COD)**: Available with Phone OTP verification to prevent fake orders and reduce Return-to-Origin (RTO).
3. **Logistics & Shipping:** Integrated with dynamic courier calculation (Shiprocket / Delhivery API) for pincode serviceability, estimated delivery dates, and shipping charges.
4. **Checkout Model:** Dual mode — seamless **Guest Checkout** (instant order tracking via tokenized link) and **Customer Account Checkout** (saved addresses and order history).
5. **Media & Image Hosting:** Cloud-based media service (Cloudinary or S3-compatible storage) with responsive image delivery.
6. **Admin Panel:** Built directly into the frontend under protected `/admin` routes, authenticated via secure JWT / HTTP-only cookies with admin role enforcement.
7. **Customer Support & Returns:** Direct contact integration (WhatsApp / Email floating button) to keep initial operational overhead minimal.

---

## 3. Functional Requirements

### 3.1. Homepage
- **Hero Banner:** Editorial-style visual showcasing the flagship jacket collection with a strong call-to-action ("Explore Jackets").
- **Featured Jackets Grid:** Quick preview cards showing product image, title, price, available colors, and "Quick View" or direct link.
- **Brand Story & Values:** Clean section highlighting jacket craftsmanship, materials, and sizing promise.
- **Value Propositions:** Badges for Free/Express Delivery, Secure Payments, and Easy Exchanges.
- **Footer:** Brand links, policy links (Shipping, Refund, Terms, Privacy), and direct WhatsApp support trigger.

### 3.2. Product Listing & Catalog
- **Grid Layout:** Responsive grid (2 columns on mobile, 3-4 columns on desktop).
- **Filtering & Sorting:**
  - Sort by: Price (Low to High, High to Low), Newest Arrivals, Featured.
  - Filter by: Size (S, M, L, XL, XXL) and Color.
- **Product Card Details:**
  - Main photo + hover secondary photo.
  - Product title & tag (e.g., "Water-resistant", "Bomber", "Overcoat").
  - Price in INR (`₹`).
  - Available color swatches.
  - "Out of Stock" badge if all variants are zero stock.

### 3.3. Product Details Page (PDP)
- **High-Resolution Gallery:** Multi-angle image thumbnails + full-screen zoom / carousel.
- **Product Metadata:** Title, SKU, price, tax inclusion note ("Incl. of all taxes").
- **Variant Selector:**
  - **Color:** Visual color circles with active selection.
  - **Size:** Size buttons (S, M, L, XL, XXL) with visual cues for low stock or out-of-stock sizes.
- **Size Guide:** Modal or accordion with detailed chest, length, and sleeve measurements (in inches & cm).
- **Stock Status:** Dynamic indicator ("In Stock", "Only 2 left", or "Sold Out").
- **Add to Cart & Buy Now:** Sticky bottom bar on mobile for instant conversion.
- **Pincode Delivery Checker:** Quick input to check estimated delivery days using the courier API.

### 3.4. Shopping Cart
- **Slide-over Drawer & Dedicated Cart Page:** Quick slide-over drawer upon adding an item, plus full cart review.
- **Cart Line Items:** Product title, selected size & color, thumbnail, unit price, quantity increment/decrement, and remove button.
- **Real-Time Validation:** Cart recalculates subtotal and validates available stock before proceeding to checkout.
- **Persistence:** Saved in `localStorage` for guests; synced to database when a customer logs in.

### 3.5. Checkout & Delivery Addresses
- **Single-Page or 2-Step Frictionless Checkout:**
  1. **Customer & Shipping Information:**
     - Email and 10-digit mobile number.
     - Full delivery address: Full Name, Address line 1 & 2, Landmark, Pincode, City, State.
     - Auto-fill City & State upon entering 6-digit Indian PIN code.
  2. **Shipping Method:** Courier rate calculation based on destination pincode and total parcel weight.
  3. **Payment Selection:**
     - Razorpay (Cards, UPI, Netbanking).
     - Cash on Delivery (COD) -> Triggers instant 4-digit SMS/WhatsApp OTP modal. Order is confirmed only upon successful OTP match.
- **Order Review:** Summary of items, subtotal, shipping fee, and grand total.

### 3.6. Customer Authentication & Account
- **Auth Flow:** Email & Password registration/login with JWT token stored in secure, `HttpOnly` cookies.
- **Password Reset:** Standard secure email reset link.
- **Customer Dashboard:**
  - **Profile:** Edit name, email, phone.
  - **Address Book:** Save multiple shipping addresses with a default selection.
  - **Order History:** List of past orders with status badges (`Pending`, `Paid`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - **Order Detail View:** Breakdown of items, courier tracking link/AWB number, and downloadable receipt.

### 3.7. Guest Order Tracking
- Guests receive an Order Confirmation SMS & Email with a private URL (e.g., `/orders/track?id=...&token=...`).
- Public tracking page displays real-time fulfillment status and courier AWB tracking without requiring account registration.

### 3.8. Admin Panel (Protected `/admin` Route)
- **Authentication:** Strict role-based guard (`role: 'admin'`).
- **Dashboard Overview:** Key metrics: Today's Orders, Revenue, Pending Shipments, Low-Stock Alerts.
- **Product Management:**
  - Add / Edit / Archive Jacket products.
  - Upload multiple product images (direct to cloud storage).
  - Manage variants: Size, Color, SKU, and Price overrides if any.
- **Inventory & Stock Management:**
  - Simple table to view and quickly update stock counts per variant.
  - Auto-flags when stock hits 0 or falls below a configurable threshold (e.g., < 3 units).
- **Order Management:**
  - Filter orders by status (`All`, `Pending Payment`, `Confirmed / COD Verified`, `Packed`, `Shipped`, `Delivered`, `Cancelled`).
  - View full order details, customer contact, and delivery address.
  - Assign courier Tracking Number / AWB and update order status (triggers customer notification).
  - Print / generate clean packing slip / invoice.

---

## 4. Non-Functional Requirements
- **Performance & Speed:** Sub-second page loads; server-side rendering (SSR) via Nuxt 4 for lightning-fast First Contentful Paint (FCP).
- **Mobile-First UX:** Over 75% of Indian e-commerce traffic is mobile; checkout and image viewing are optimized for thumb interaction.
- **Security:**
  - Passwords hashed using `bcrypt` (work factor 12).
  - Sensitive payment data never touches our server (handled directly by Razorpay SDK).
  - Webhook signatures strictly verified for Razorpay and Courier callbacks.
  - API rate limiting on auth and OTP endpoints to prevent abuse.
- **Standardized API Contract & Observability:**
  - Uniform success and error response envelopes (`{ success, message, data }` / `{ success, error }`) with semantic HTTP status codes, managed by a centralized typed utility (`sendSuccess`) and aligned `errorHandler`.
  - Structured application and HTTP request logging using **Pino** and `pino-http` streamed directly to `stdout`/`stderr` (12-factor cloud-native design, independent of hosting providers with no separate logging databases).
  - Strict zero-leakage redaction preventing passwords, password hashes, OTPs, auth tokens, cookies, and payment secrets from appearing in logs.
- **SEO & Social Sharing:**
  - Dynamic Open Graph tags (jacket preview image, title, price) on PDP for WhatsApp/Instagram sharing.
  - Clean semantic HTML5 and structured JSON-LD schema (`Product`, `Offer`, `BreadcrumbList`).

---

## 5. Scope Boundaries (Excluded from Phase 1)
- Multi-currency / international shipping (India only for launch).
- Automated customer self-service refund disbursement (refunds handled via manual bank transfer / Razorpay dashboard after WhatsApp review).
- Customer review / rating submission system (can be added in Phase 2).
- Complex discount coupon engine (will be kept to simple sitewide promotional banners initially).
