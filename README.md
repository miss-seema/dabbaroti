# Dabba Roti – Home-Style Daily Tiffin Service & Meal Subscription Platform

> **Brand**: Dabba Roti  
> **Tagline**: *"A Taste You'll Keep Coming Back For!"*  
> **Website**: [www.dabbaroti.com](https://www.dabbaroti.com)  
> **Location**: Mohali, Madhya Pradesh  

---

## 🍛 1. Project Overview

**Dabba Roti** is a full-stack, responsive, and modern web application developed for an authentic home-style daily tiffin subscription service. Built with a focus on nutrition, hygiene, transparent pricing, and effortless subscription management, the platform allows customers to:
- Browse weekly and monthly tiffin subscriptions.
- Dynamically build custom meal plans with live price estimation and kitchen confirmation.
- Inspect daily rotational breakfast, lunch, and dinner menus.
- Manage deliveries, pause subscriptions with flexible notices, and resume anytime.
- Pay securely using Razorpay (UPI, Cards, NetBanking) or Pay on Delivery (COD).
- Access comprehensive customer portals and a full-featured admin management dashboard.

---

## 🛠️ 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (Vite), React Router v6, Tailwind CSS, Lucide React |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `ToastContext`) |
| **Backend** | Node.js, Express.js, RESTful API architecture |
| **Database** | MongoDB with Mongoose (Dual-mode: connects to MongoDB or uses the built-in resilient in-memory store for instant zero-config testing) |
| **Authentication** | JSON Web Tokens (JWT) & bcrypt.js password hashing |
| **Payment Gateway** | Razorpay Node.js SDK & inline interactive checkout with simulated test sandbox |
| **Styling & Design** | Warm food palette: Saffron Orange (`#EA580C`), Fresh Herb Green (`#16A34A`), Warm Cream (`#FDFBF7`) |

---

## 📁 3. Project Structure

```text
dabbaroti/
├── package.json                   # Root package with concurrently scripts
├── README.md                      # Comprehensive documentation
├── server/
│   ├── package.json
│   ├── server.js                  # Express API server entrypoint (Port 5001)
│   ├── .env                       # Environment variables
│   ├── .env.example
│   ├── config/
│   │   └── db.js                  # Mongoose connection with resilient fallback
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect & adminOnly verification
│   ├── models/
│   │   ├── User.js                # Customer & Admin user profiles
│   │   ├── TiffinPlan.js          # Weekly & Monthly tiffin plan schemas
│   │   ├── CustomPlanRequest.js   # Tailored custom meal schedule inquiries
│   │   ├── MenuItem.js            # Rotational dishes with calories & tags
│   │   ├── Order.js               # Order records & delivery slots
│   │   ├── Subscription.js        # Active subscriptions & pause history
│   │   ├── Payment.js             # Razorpay transactions & signatures
│   │   ├── Coupon.js              # Promotional coupon discount rules
│   │   └── Review.js              # Verified customer testimonials
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth (register, login, profile, addresses)
│   │   ├── planRoutes.js          # /api/plans (GET, POST, PUT, DELETE)
│   │   ├── customPlanRoutes.js    # /api/custom-plans (calculate, request, review)
│   │   ├── menuRoutes.js          # /api/menu (filter by category, CRUD)
│   │   ├── orderRoutes.js         # /api/orders (create, my-orders, status)
│   │   ├── subscriptionRoutes.js  # /api/subscriptions (pause, resume, cancel)
│   │   ├── paymentRoutes.js       # /api/payments (Razorpay create-order & verify)
│   │   ├── couponRoutes.js        # /api/coupons (apply code, admin CRUD)
│   │   ├── reviewRoutes.js        # /api/reviews
│   │   └── adminRoutes.js         # /api/admin (stats, overview metrics)
│   └── utils/
│       ├── mockStore.js           # Built-in seed data store for fallback
│       └── seedData.js            # CLI database seeder
└── client/
    ├── index.html                 # Web page with Google Fonts & Razorpay SDK
    ├── vite.config.js             # Vite configuration with API proxy to port 5001
    ├── tailwind.config.js         # Food brand color tokens & typography
    ├── postcss.config.js
    └── src/
        ├── main.jsx               # App entrypoint with Context providers
        ├── App.jsx                # Route definitions & layout wrappers
        ├── index.css              # Custom scrollbars & Tailwind directives
        ├── context/
        │   ├── AuthContext.jsx    # User session, JWT persistence, login, logout
        │   ├── CartContext.jsx    # Cart items, quantities, coupon logic, totals
        │   └── ToastContext.jsx   # Custom floating alerts (success, error, info)
        ├── services/
        │   └── api.js             # Centralized fetch wrapper with Bearer token
        ├── components/
        │   ├── Navbar.jsx         # Sticky glassmorphic nav with badges & drawer
        │   ├── Footer.jsx         # Contact, kitchen address & FSSAI details
        │   ├── PlanCard.jsx       # Pricing card with date picker & inclusions
        │   ├── RazorpayModal.jsx  # Interactive Razorpay checkout modal
        │   ├── ProtectedRoute.jsx # Client auth route gate
        │   └── AdminRoute.jsx     # Admin privileges route gate
        └── pages/
            ├── HomePage.jsx       # Hero, USPs, popular plans, today's special
            ├── AboutPage.jsx      # Story, mission, vision, hygiene standards
            ├── PlansPage.jsx      # Weekly & Monthly plans (₹3,500 & ₹4,500)
            ├── CustomPlanPage.jsx # Interactive custom meal planner & calculator
            ├── MenuPage.jsx       # Category tabs: Breakfast, Lunch, Dinner, Add-ons
            ├── CartPage.jsx       # Cart list, start dates, coupon validation
            ├── CheckoutPage.jsx   # Address, slots, Razorpay & COD payment
            ├── OrderConfirmationPage.jsx # Digital invoice & confirmation
            ├── LoginPage.jsx      # Login with 1-click Demo credentials
            ├── RegisterPage.jsx   # Customer registration
            ├── CustomerDashboardPage.jsx # Subscriptions, pause/resume, orders
            ├── AdminDashboardPage.jsx    # Revenue, approvals, menu, plans
            └── NotFoundPage.jsx   # 404 page
```

---

## 🚀 4. Installation & Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB**: Local MongoDB instance (`mongod`) or MongoDB Atlas URI. If MongoDB is not running, the application automatically uses its robust in-memory mock store without crashing.

### Step 1: Install Dependencies
From the repository root directory, run:
```bash
npm run install:all
```
*(This will install dependencies for root, `server/`, and `client/` concurrently.)*

### Step 2: Configure Environment Variables
The `server/.env` file is pre-configured with default settings:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/dabbaroti
JWT_SECRET=dabbaroti_super_secret_jwt_key_2026_xyz987
JWT_EXPIRE=30d
NODE_ENV=development

# Razorpay Test Configuration
RAZORPAY_KEY_ID=rzp_test_dabbaroti2026
RAZORPAY_KEY_SECRET=dabbarotiSecretKeyTest
```

### Step 3: Run Seed Script (Optional)
If running with a local MongoDB daemon:
```bash
npm run seed
```

### Step 4: Start Development Servers
Run both backend and frontend together from the root directory:
```bash
npm run dev
```
Or start them in separate terminals:
```bash
# Terminal 1 - Backend Server (Port 5001)
npm run server

# Terminal 2 - Frontend Client (Port 3000)
npm run client
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 5. Demo Credentials

For quick evaluation, click the convenient **1-Click Demo** buttons on the Login page (`/login`):

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Admin** | `admin@dabbaroti.com` | `Admin@123` | Full Admin Dashboard, Plan Editor, Menu Manager, Orders, Custom Approvals |
| **Customer** | `customer@dabbaroti.com` | `User@123` | Active Subscriptions, Pause/Resume, Order History, Custom Requests |

---

## 📋 6. Key Features & Business Logic

### A. Tiffin Plans & Pricing Logic
1. **Weekly Plans (7 Days)**:
   - 2-Meal Option (Lunch & Dinner): ₹1,199 / week
   - 3-Meal Option (Breakfast, Lunch & Dinner): ₹1,599 / week
   - Custom calendar start date selector on each plan card.
2. **Monthly Plans (30 Days)**:
   - **2 Meals Per Day**: **₹3,500 / month** (Bestseller, ~₹58/meal)
   - **3 Meals Per Day**: **₹4,500 / month** (Best Value, ~₹50/meal)
   - Both include 100% free doorstep delivery, daily rotational menus, and up to 4 days of free pause flexibility.
3. **Custom Meal Plan Builder**:
   - Customers specify:
     - Exact Start and End dates (calendar picker).
     - Meal categories: Breakfast (₹45/day), Lunch (₹70/day), Dinner (₹70/day).
     - Required meal days: All 7 days, Weekdays (Mon-Fri), or specific days.
     - Dietary preference: Standard Veg, Jain (No onion-garlic-root veg), Swaminarayan, Eggitarian.
     - Spice level: Mild, Medium, Spicy.
     - Optional add-ons: Extra rotis, Masala Chaas, Gulab Jamun, Curd Raita, Green Salad.
     - Special instructions: low oil, diabetic, less salt.
   - Live dynamic price quote calculates in real-time with automatic volume discounts (15% for 28+ days, 5% for 7+ days).
   - Instant submission to kitchen admin for confirmation before checkout.

### B. Payment Integration (Razorpay & COD)
- **Razorpay**: Integrated inline checkout modal supporting UPI (Google Pay, PhonePe, Paytm, BHIM), Cards (Visa, MasterCard, RuPay), and NetBanking. Automatically validates signatures and activates the subscription.
- **Pay on Delivery (COD)**: Supports cash payment or on-delivery UPI upon receipt of the first tiffin.

### C. Customer Self-Service Dashboard
- **Active Subscriptions**: View subscription number, start & end dates, remaining days, delivery address, and scheduled meal slots.
- **Pause & Resume**: Pause subscriptions with a reason and date range without losing purchased meal days. Resume with 1 click.
- **Order Tracking**: Track order status timeline (`placed` → `confirmed` → `preparing` → `out_for_delivery` → `delivered`).
- **Custom Requests Tracker**: View status of custom plan requests (`pending review`, `approved by kitchen`, `rejected`).
- **Address Book**: Add and set default delivery addresses.

### D. Comprehensive Admin Dashboard (`/admin`)
- **Operations Overview**: Live statistics for Total Revenue, Active Subscriptions, Pending Custom Plan Requests, and Total Customers.
- **Order Management**: Real-time order list with status dropdown selector (`confirmed`, `preparing`, `out_for_delivery`, `delivered`).
- **Custom Plan Inquiries**: Inspect custom schedules, set approved custom prices, add chef notes, and approve/reject.
- **Plan Management**: Create, edit, and delete Weekly and Monthly subscription plans.
- **Menu Management**: Add, update, and delete rotational dishes with images, calories, categories, and dietary tags.
- **Coupons & Promotions**: Manage promo codes (`DABBA10`, `TASTE20`, `FIRSTMEAL`).

---

## 📡 7. API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register a new customer |
| `/api/auth/login` | `POST` | Public | Authenticate user & get JWT |
| `/api/auth/profile` | `GET` / `PUT` | Private | Get or update user profile |
| `/api/auth/address` | `POST` | Private | Add delivery address |
| `/api/plans` | `GET` | Public | List active tiffin plans |
| `/api/plans` | `POST` | Admin | Create new tiffin plan |
| `/api/plans/:id` | `PUT` / `DELETE` | Admin | Update or delete tiffin plan |
| `/api/custom-plans/calculate` | `POST` | Public | Real-time price quote calculator |
| `/api/custom-plans/request` | `POST` | Private | Submit custom plan inquiry |
| `/api/custom-plans/all` | `GET` | Admin | View all custom plan inquiries |
| `/api/custom-plans/:id/status` | `PUT` | Admin | Approve or reject custom plan |
| `/api/menu` | `GET` | Public | List menu dishes (category, isVeg) |
| `/api/menu` | `POST` / `PUT` / `DELETE`| Admin | Kitchen menu management |
| `/api/orders` | `POST` | Private | Create order & initialize subscription |
| `/api/orders/my-orders` | `GET` | Private | Get customer order history |
| `/api/orders` | `GET` | Admin | Get all orders |
| `/api/orders/:id/status` | `PUT` | Admin | Update order delivery status |
| `/api/subscriptions/my-subscriptions` | `GET` | Private | View active customer subscriptions |
| `/api/subscriptions/:id/pause` | `PUT` | Private | Pause subscription |
| `/api/subscriptions/:id/resume` | `PUT` | Private | Resume subscription |
| `/api/payments/razorpay/create-order` | `POST` | Private | Create Razorpay order |
| `/api/payments/razorpay/verify` | `POST` | Private | Verify HMAC signature & activate |
| `/api/coupons/apply` | `POST` | Public | Validate promo coupon & get discount |
| `/api/admin/stats` | `GET` | Admin | Get dashboard KPI statistics |

---

## 🧪 8. Production Build Verification

The React frontend builds cleanly without warnings or missing dependencies:
```bash
npm run build --prefix client
```
Generated production artifacts:
- `client/dist/index.html`
- `client/dist/assets/index-*.css`
- `client/dist/assets/index-*.js`

---

## 📄 9. License & Credits

Created for **Dabba Roti** ([www.dabbaroti.com](https://www.dabbaroti.com)).  
*"A Taste You'll Keep Coming Back For!"*
