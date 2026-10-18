# User Flows: Last Option (Customer & Admin)

**Document Version:** 1.0  
**Context:** Detailed journey maps and state transitions for store customers and administrators.

---

## 1. Customer Journey Flows

### Flow 1.1: Product Discovery to Purchase (Core Funnel)
```mermaid
flowchart TD
    A[Visitor Lands on Homepage] --> B[Browse Jacket Catalog / Featured Collection]
    B --> C[Click Jacket Card to Open Product Details Page]
    C --> D[Select Color & Size]
    D --> E{In Stock?}
    E -- No --> F[Show Out of Stock Badge / Disabled Button]
    E -- Yes --> G[Click 'Add to Cart' or 'Buy Now']
    G --> H[Cart Drawer Slides Open]
    H --> I[Review Items & Proceed to Checkout]
    I --> J{Customer Status?}
    J -- Logged In --> K[Load Saved Addresses]
    J -- Guest --> L[Enter Email, Phone & Delivery Address]
    K --> M[Select Shipping & Proceed to Payment]
    L --> M
    M --> N{Payment Method?}
    N -- Razorpay Online --> O[Complete UPI / Card / Netbanking]
    O -- Success --> Q[Order Confirmed]
    O -- Failed --> R[Show Error & Retry Payment]
    N -- Cash on Delivery --> P[Send 4-Digit SMS/WhatsApp OTP]
    P --> S[Customer Enters OTP]
    S -- Valid --> Q
    S -- Invalid --> T[Prompt Resend or Retry OTP]
    Q --> U[Display Confirmation Screen & Send Tracking Link]
```

---

### Flow 1.2: Guest vs. Logged-in Checkout Comparison

| Step | Logged-in Customer | Guest Shopper |
| :--- | :--- | :--- |
| **Identification** | Already recognized via session/JWT | Enters Email + 10-digit Mobile number |
| **Address** | Selects from saved addresses with 1 click | Enters Shipping Address (Pincode auto-populates City/State) |
| **Cart Storage** | Stored in PostgreSQL DB (cross-device sync) | Stored in Browser `localStorage` (transfers to DB on order creation) |
| **Order History** | Viewable in `/account/orders` dashboard | Trackable via secure link sent to Email/SMS (`/track?id=...&token=...`) |
| **Post-Purchase** | Can reorder or edit saved addresses anytime | Prompted: "Create a password to save your details for next time" (optional) |

---

### Flow 1.3: Cash on Delivery (COD) OTP Verification Flow
To protect the store from unverified addresses and fake orders:
1. Customer selects **Cash on Delivery**.
2. A lightweight modal pops up: *"We sent a 4-digit verification code to +91 XXXXX XXXXX"*.
3. Background backend sends a short-lived (5-minute expiry) OTP via SMS / WhatsApp service.
4. Customer enters the 4 digits:
   - **Correct:** The order state immediately switches from `COD_PENDING_OTP` to `PLACED`, stock is reserved, and confirmation is displayed.
   - **Incorrect:** Clear error displayed with a countdown timer to request a fresh OTP.

---

## 2. Order Lifecycle & Status Transitions

Every order moves through a clear set of statuses. This makes it easy for both the customer and admin to know exactly where a parcel is.

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Customer enters checkout
    DRAFT --> PENDING_PAYMENT: Online payment initiated
    DRAFT --> COD_PENDING_OTP: COD selected
    
    PENDING_PAYMENT --> PAYMENT_FAILED: Payment declined / abandoned
    PAYMENT_FAILED --> PENDING_PAYMENT: Customer retries payment
    PENDING_PAYMENT --> PLACED: Razorpay webhook confirms payment
    
    COD_PENDING_OTP --> PLACED: OTP verified successfully
    COD_PENDING_OTP --> CANCELLED: OTP expired / verification abandoned
    
    PLACED --> PROCESSING: Admin acknowledges order & packs jacket
    PROCESSING --> SHIPPED: Admin generates courier AWB label
    SHIPPED --> OUT_FOR_DELIVERY: Courier marks package out for delivery
    OUT_FOR_DELIVERY --> DELIVERED: Delivered & signed (or COD collected)
    
    PLACED --> CANCELLED: Customer requests cancellation before dispatch
    PROCESSING --> CANCELLED: Out of stock / quality check fail / customer cancel
    SHIPPED --> RTO: Delivery failed / customer refused (Return to Origin)
```

---

## 3. Administrator Workflows

The admin panel is accessible at `/admin` for authenticated users with the `admin` role.

### Flow 3.1: Product & Inventory Management
```mermaid
flowchart LR
    A[Admin Log In] --> B[Catalog Manager]
    B --> C[Create New Jacket]
    B --> D[Update Existing Jacket]
    B --> E[Manage Variants & Stock]
    
    C --> F[Fill Title, Description, Base Price, Care Instructions]
    F --> G[Upload Images to Cloud Storage]
    G --> H[Define Variants: Size S/M/L/XL/XXL + Color + Initial Stock]
    H --> I[Save & Publish to Store]
    
    E --> J[Quick Stock Editor Table]
    J --> K[Update Quantity Available per Variant]
```

### Flow 3.2: Order Fulfillment & Dispatch
```mermaid
flowchart TD
    A[New Order Notification] --> B[Admin Reviews Order Details]
    B --> C{Order Payment Status}
    C -- Razorpay Paid / COD Verified --> D[Mark as 'Processing' & Print Packing Slip]
    D --> E[Package Jacket with Last Option Branded Packaging]
    E --> F[Book Shipment on Courier API / Enter AWB Tracking Number]
    F --> G[Mark Order as 'Shipped']
    G --> H[Automated SMS/Email Sent to Customer with Live Courier Tracking URL]
```
