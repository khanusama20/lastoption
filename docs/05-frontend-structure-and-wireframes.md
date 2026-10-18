# Nuxt 4 Page Structure & Wireframes: Last Option

**Document Version:** 1.0  
**Frontend Framework:** Nuxt 4 (Vue 3, TypeScript, Tailwind CSS)  
**State Management:** Pinia (Cart, Authentication, Checkout State)

---

## 1. Routing & Directory Structure

Nuxt 4 uses file-system-based routing. The `client_facing/` directory will be structured as follows:

```
client_facing/
├── app.vue                   # Root layout wrapper & toast notifications
├── layouts/
│   ├── default.vue           # Public header, navigation, announcement bar & footer
│   ├── checkout.vue          # Minimal distraction-free header (logo + secure lock badge)
│   └── admin.vue             # Admin sidebar navigation & profile header
├── pages/
│   ├── index.vue             # Homepage (Hero, Featured Jackets, Brand Story)
│   ├── jackets/
│   │   ├── index.vue         # Jacket Catalog (Filtering, Sorting, Grid)
│   │   └── [slug].vue        # Product Details Page (PDP, Gallery, Variant Selector)
│   ├── cart.vue              # Full Shopping Cart Review Page
│   ├── checkout.vue          # Frictionless 2-step Checkout (Guest & Auth)
│   ├── orders/
│   │   ├── confirmation.vue  # Order Success Screen with Order Number
│   │   └── track.vue         # Public Tracking Page (by token or phone + order #)
│   ├── account/
│   │   ├── login.vue         # Customer Login
│   │   ├── register.vue      # Customer Registration
│   │   ├── profile.vue       # Customer Profile & Saved Addresses
│   │   └── orders.vue        # Customer Order History & Invoices
│   └── admin/
│       ├── index.vue         # Admin Dashboard Overview (Revenue, Low Stock, Metrics)
│       ├── products/
│       │   ├── index.vue     # Product List & Statuses
│       │   ├── new.vue       # Create New Jacket
│       │   └── [id].vue      # Edit Jacket Details & Image Uploads
│       ├── inventory.vue     # Rapid Stock Adjuster Matrix (Size x Color)
│       └── orders/
│           ├── index.vue     # Order Management Table (Filter by Status)
│           └── [id].vue      # Order Details, Packing Slip, AWB Fulfillment
├── components/
│   ├── common/               # Header, Footer, WhatsAppButton, NotificationToast
│   ├── product/              # ProductCard, ImageGallery, SizeSelector, SizeGuideModal
│   ├── cart/                 # CartDrawer (Slide-over), CartItemRow, CartSummary
│   ├── checkout/             # AddressForm, CourierRateCard, PaymentSelector, CodOtpModal
│   └── admin/                # MetricCard, StatusBadge, QuickStockInput, FulfillmentModal
└── stores/
    ├── useCartStore.ts       # Cart state, local sync & server sync
    ├── useAuthStore.ts       # User session & admin state
    └── useCheckoutStore.ts   # Active checkout address & payment method
```

---

## 2. Low-Fidelity Wireframes

### Wireframe 2.1: Homepage (`/`)
```
+-----------------------------------------------------------------------+
|  [Announcement: Free Express Shipping Nationwide on Orders Over ₹2,999] |
+-----------------------------------------------------------------------+
|  [ LAST OPTION ]          Jackets   Story   About          (Search) [Cart (2)] |
+-----------------------------------------------------------------------+
|                                                                       |
|  [ HERO BANNER: Editorial Full-Width Image ]                          |
|  "STRUCTURED ELEGANCE. BUILT TO ENDURE."                              |
|  Crafted from premium water-resistant twill and full-grain leather.  |
|                                                                       |
|  [ EXPLORE JACKETS ]                                                  |
|                                                                       |
+-----------------------------------------------------------------------+
|  FEATURED PIECES                                                      |
|                                                                       |
|  +------------------+  +------------------+  +------------------+     |
|  | [ Jacket Image ] |  | [ Jacket Image ] |  | [ Jacket Image ] |     |
|  | Minimal Bomber   |  | Heritage Field   |  | Obsidian Parka   |     |
|  | ₹4,999           |  | ₹6,499           |  | ₹7,999           |     |
|  | Colors: [o][o]   |  | Colors: [o][o][o]|  | Colors: [o]      |     |
|  +------------------+  +------------------+  +------------------+     |
+-----------------------------------------------------------------------+
|  BRAND PHILOSOPHY                                                     |
|  "Why Last Option? Because once you wear this, you won't need another."|
|  [100% Weatherproof]   [Reinforced Stitching]   [Tailored Fit Guarantee]|
+-----------------------------------------------------------------------+
|  FOOTER: Shipping & Returns | Privacy Policy | WhatsApp Support | (c) 2026 |
+-----------------------------------------------------------------------+
```

---

### Wireframe 2.2: Product Details Page (`/jackets/[slug]`)
```
+-----------------------------------------------------------------------+
|  [ LAST OPTION ]                                           [Cart (2)] |
+-----------------------------------------------------------------------+
|  Breadcrumbs: Home / Jackets / Heritage Wool Overcoat                 |
|                                                                       |
|  +-----------------------------+   Heritage Wool Overcoat             |
|  |                             |   ₹6,999 (Inclusive of all taxes)    |
|  |                             |   Rating: ★★★★★ (42 Reviews)         |
|  |   [ High-Res Main Image ]   |   ---------------------------------- |
|  |                             |   COLOR: Midnight Navy               |
|  |                             |   (•) Navy   ( ) Charcoal   ( ) Onyx |
|  +-----------------------------+   ---------------------------------- |
|  [thumb 1] [thumb 2] [thumb 3]     SELECT SIZE:         [ Size Guide ]|
|                                    [ S ]  [ M ]  [ L ]  [ XL ]  [XXL] |
|                                    (• M selected - 3 units left!)     |
|                                    ---------------------------------- |
|                                    DELIVERY ESTIMATOR:                |
|                                    [ 560001 ]  [ Check ]              |
|                                    -> Delivery by Friday via Delhivery|
|                                    ---------------------------------- |
|                                    [      ADD TO CART       ]         |
|                                    [        BUY NOW         ]         |
|                                    ---------------------------------- |
|                                    > Product Description              |
|                                    > Materials & Garment Care         |
|                                    > Shipping & Free Exchanges        |
+-----------------------------------------------------------------------+
```

---

### Wireframe 2.3: Frictionless Checkout & COD OTP Modal (`/checkout`)
```
+-----------------------------------------------------------------------+
|  [ LAST OPTION ]                         (🔒 256-Bit SSL Encrypted)   |
+-----------------------------------------------------------------------+
|  CHECKOUT                                  ORDER SUMMARY (1 item)     |
|                                            -------------------------  |
|  1. CONTACT & DELIVERY                     Heritage Wool Overcoat     |
|  Email: [ user@example.com           ]     Size: M | Color: Navy      |
|  Phone: [ +91 98765 43210            ]     Qty: 1           ₹6,999    |
|                                            -------------------------  |
|  Full Name: [ Rahul Sharma           ]     Subtotal:        ₹6,999    |
|  Pincode:   [ 560001 ] (Bengaluru, KA)     Delivery:          FREE    |
|  Address:   [ Flat 402, Green Valley ]     Total:           ₹6,999    |
|                                                                       |
|  2. PAYMENT METHOD                                                    |
|  ( ) Online Payment (Razorpay: UPI, Cards, Netbanking)                |
|  (•) Cash on Delivery (Requires Phone OTP Verification)               |
|                                                                       |
|  [         CONFIRM ORDER (₹6,999)         ]                           |
+-----------------------------------------------------------------------+

                +---------------------------------------+
                |         VERIFY PHONE FOR COD          |
                |                                       |
                |  We sent a 4-digit code to:           |
                |  +91 98765 43210                      |
                |                                       |
                |     [ _ ]  [ _ ]  [ _ ]  [ _ ]        |
                |                                       |
                |  Resend Code in 0:42                  |
                |                                       |
                |  [        VERIFY & PLACE ORDER      ] |
                +---------------------------------------+
```

---

### Wireframe 2.4: Admin Panel & Order Dispatch (`/admin/orders/[id]`)
```
+-----------------------------------------------------------------------+
|  LAST OPTION ADMIN      [Catalog]  [Stock Matrix]  [Orders]  (Logout) |
+-----------------------------------------------------------------------+
|  Order #LO-2026-1042                               [ Status: PLACED ] |
|  Placed on: Oct 17, 2026 | Payment: COD (Verified)                    |
|  -------------------------------------------------------------------- |
|  CUSTOMER DETAILS                  SHIPPING ADDRESS                   |
|  Rahul Sharma                      Flat 402, Green Valley Apartments  |
|  rahul@example.com                 Indiranagar, Bengaluru - 560001    |
|  +91 98765 43210                   Karnataka, India                   |
|  -------------------------------------------------------------------- |
|  ITEMS ORDERED                                                        |
|  - Heritage Wool Overcoat (Size: M, Navy) x 1                 ₹6,999  |
|  -------------------------------------------------------------------- |
|  FULFILLMENT & DISPATCH                                               |
|  Courier: [ Delhivery        v ]                                      |
|  AWB / Tracking Number: [ 1482910398201          ]                    |
|                                                                       |
|  [ PRINT PACKING SLIP ]       [ MARK AS SHIPPED & NOTIFY CUSTOMER ]   |
+-----------------------------------------------------------------------+
```
