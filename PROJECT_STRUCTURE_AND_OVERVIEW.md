# PROJECT STRUCTURE & FULL OVERVIEW

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Technology Stack](#technology-stack)
5. [Features](#features)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Component Hierarchy](#component-hierarchy)
9. [Data Flow](#data-flow)
10. [Setup & Installation](#setup--installation)

---

## 🎯 PROJECT OVERVIEW

**Inventory Management System** is a full-stack web application designed to manage inventory operations including products, stock, dispatch, billing, and user management.

### Key Highlights
- **Type:** Full-Stack Web Application
- **Frontend:** React 19 + Vite
- **Backend:** Express.js + DynamoDB
- **Authentication:** JWT-based
- **Database:** AWS DynamoDB (NoSQL)
- **Deployment:** Local + AWS Ready

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19 Application (Vite)                         │   │
│  │  - Components (27)                                   │   │
│  │  - Services (6)                                      │   │
│  │  - Routing (React Router)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js REST API (Port 8000)                     │   │
│  │  - 9 Route Handlers                                  │   │
│  │  - JWT Middleware                                    │   │
│  │  - CORS Enabled                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ AWS SDK
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AWS DynamoDB (NoSQL)                                │   │
│  │  - 9 Tables                                          │   │
│  │  - Global Secondary Indexes                         │   │
│  │  - Region: eu-north-1                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 DIRECTORY STRUCTURE

```
INVENTORY/
│
├── frontend/                          # React Frontend Application
│   ├── public/                        # Static assets
│   │   └── vite.svg                   # Vite logo
│   │
│   ├── src/                           # Source code
│   │   ├── assets/                    # Images, fonts, etc.
│   │   │
│   │   ├── components/                # React Components (27 files)
│   │   │   ├── AddCustomer.jsx        # Add customer form
│   │   │   ├── AddProduct.jsx         # Add product form
│   │   │   ├── AddStock.jsx           # Add stock form
│   │   │   ├── AddSupplier.jsx        # Add supplier form
│   │   │   ├── AvailableStocks.jsx    # Available stocks view
│   │   │   ├── CreateInvoice.jsx      # Invoice creation form
│   │   │   ├── CreatePurchaseOrder.jsx # PO creation form
│   │   │   ├── Customer.jsx           # Customer list & management
│   │   │   ├── Dashboard.jsx          # Main dashboard layout
│   │   │   ├── DispatchHistory.jsx    # Dispatch records history
│   │   │   ├── DispatchStock.jsx      # Dispatch management
│   │   │   ├── EditCustomer.jsx       # Edit customer form
│   │   │   ├── EditProduct.jsx        # Edit product form
│   │   │   ├── EditSupplier.jsx       # Edit supplier form
│   │   │   ├── ForgotPassword.jsx     # Password recovery
│   │   │   ├── Home.jsx               # Home/Overview page
│   │   │   ├── Income.jsx             # Procurement management
│   │   │   ├── Invoice.jsx            # Invoice list & view
│   │   │   ├── LoadingSpinner.jsx     # Loading component
│   │   │   ├── Login.jsx              # Login page
│   │   │   ├── Overview.jsx           # Stock overview dashboard
│   │   │   ├── Products.jsx           # Product list & management
│   │   │   ├── PurchaseOrder.jsx      # Purchase order list
│   │   │   ├── Register.jsx           # Registration page
│   │   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   │   ├── Stock.jsx              # Stock summary
│   │   │   ├── StockManagement.jsx    # Stock operations
│   │   │   └── Supplier.jsx           # Supplier list & management
│   │   │
│   │   ├── services/                  # API Service Layer (6 files)
│   │   │   ├── api.js                 # Axios instance & interceptors
│   │   │   ├── authService.js         # Authentication services
│   │   │   ├── billingService.js      # Invoice & PO services
│   │   │   ├── dispatchService.js     # Dispatch services
│   │   │   ├── productService.js      # Product, Stock, Order services
│   │   │   └── userService.js         # Customer & Supplier services
│   │   │
│   │   ├── styles/                    # CSS Stylesheets
│   │   │   ├── Auth.css               # Authentication pages
│   │   │   ├── Dashboard.css          # Dashboard & sidebar
│   │   │   ├── DispatchStock.css      # Dispatch pages
│   │   │   ├── Home.css               # Home page
│   │   │   ├── Income.css             # Procurement page
│   │   │   ├── Products.css           # Product pages
│   │   │   ├── Reset.css              # CSS reset
│   │   │   ├── Responsive.css         # Mobile responsive
│   │   │   └── Stock.css              # Stock pages
│   │   │
│   │   ├── utils/                     # Utility functions
│   │   │
│   │   ├── App.css                    # App-level styles
│   │   ├── App.jsx                    # Root component
│   │   ├── index.css                  # Global styles
│   │   └── main.jsx                   # Entry point
│   │
│   ├── .env.local                     # Environment variables
│   ├── .gitignore                     # Git ignore rules
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # HTML template
│   ├── package.json                   # Dependencies & scripts
│   ├── package-lock.json              # Dependency lock file
│   └── vite.config.js                 # Vite configuration
│
├── backend/                           # Express.js Backend API
│   ├── middleware/                    # Express middleware
│   │   └── auth.js                    # JWT authentication middleware
│   │
│   ├── routes/                        # API Route Handlers (9 files)
│   │   ├── auth.js                    # Authentication routes
│   │   ├── customers.js               # Customer CRUD routes
│   │   ├── dispatch.js                # Dispatch routes
│   │   ├── invoices.js                # Invoice CRUD routes
│   │   ├── orders.js                  # Order routes
│   │   ├── products.js                # Product CRUD routes
│   │   ├── purchaseOrders.js          # Purchase order routes
│   │   ├── stock.js                   # Stock CRUD routes
│   │   └── suppliers.js               # Supplier CRUD routes
│   │
│   ├── .env                           # Environment configuration
│   ├── .gitignore                     # Git ignore rules
│   ├── index.js                       # Server entry point
│   ├── package.json                   # Dependencies & scripts
│   ├── package-lock.json              # Dependency lock file
│   └── setup-tables.js                # DynamoDB table setup script
│
├── aws-backend/                       # AWS Lambda Serverless (Optional)
│   ├── api-gateway/                   # API Gateway config
│   │   └── swagger.yaml               # API documentation
│   │
│   ├── dynamodb/                      # DynamoDB schemas
│   │   └── table-schemas.json         # Table definitions
│   │
│   ├── lambda/                        # Lambda functions
│   │   ├── auth/                      # Auth Lambda functions
│   │   ├── income/                    # Income Lambda functions
│   │   ├── products/                  # Product Lambda functions
│   │   └── stock/                     # Stock Lambda functions
│   │
│   ├── package.json                   # Lambda dependencies
│   └── serverless.yml                 # Serverless Framework config
│
├── .gitignore                         # Root git ignore
├── DEPLOYMENT.md                      # AWS deployment guide
├── FULL_PROJECT_ANALYSIS.md           # Complete code analysis
├── MOBILE_RESPONSIVE.md               # Mobile design documentation
├── PROJECT_STATUS.md                  # Project status & features
├── README.md                          # Project documentation
└── start-servers.bat                  # Windows startup script
```

---

## 💻 TECHNOLOGY STACK

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.2.4 | Build tool & dev server |
| **React Router DOM** | 7.11.0 | Client-side routing |
| **Axios** | 1.13.2 | HTTP client |
| **Lucide React** | 0.561.0 | Icon library |
| **AWS Amplify** | 6.15.9 | AWS integration (optional) |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x+ | Runtime environment |
| **Express.js** | 4.x | Web framework |
| **AWS SDK v3** | Latest | DynamoDB client |
| **JWT** | Latest | Authentication tokens |
| **bcryptjs** | Latest | Password hashing |
| **CORS** | Latest | Cross-origin requests |
| **dotenv** | Latest | Environment variables |

### Database
| Technology | Purpose |
|------------|---------|
| **AWS DynamoDB** | NoSQL database |
| **Region** | eu-north-1 |
| **Tables** | 9 tables with GSI |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Git** | Version control |
| **npm** | Package management |

---

## ✨ FEATURES

### 1. Authentication & Authorization
- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes
- ✅ Auto-redirect based on auth status
- ✅ Token refresh mechanism
- ✅ Logout functionality

### 2. Dashboard & Navigation
- ✅ Home page with system overview
- ✅ Interactive section cards
- ✅ Auto-expanding sidebar navigation
- ✅ Active route highlighting
- ✅ Collapsible menu
- ✅ Mobile-responsive sidebar
- ✅ Breadcrumb navigation
- ✅ Quick stats display

### 3. Product Management
- ✅ View all products with pagination
- ✅ Add new products
- ✅ Edit product details
- ✅ Delete products with confirmation
- ✅ Category management (A/B/C)
- ✅ Barcode generation & tracking
- ✅ Stock level indicators
- ✅ Search & filter products
- ✅ Product statistics dashboard
- ✅ Low stock alerts

### 4. Stock Management
- ✅ Stock summary dashboard
- ✅ Add stock items
- ✅ Update stock quantities
- ✅ Location tracking (Warehouse A/B/C)
- ✅ Supplier tracking
- ✅ Batch number management
- ✅ Expiry date tracking
- ✅ Available stocks view
- ✅ Stock movement history
- ✅ Low stock notifications

### 5. Dispatch Management
- ✅ Dispatch stock items
- ✅ Auto-select invoice & customer
- ✅ Dispatch quantity validation
- ✅ Dispatch history tracking
- ✅ Status management (Pending/In Transit/Delivered)
- ✅ Search dispatch records
- ✅ Filter by status
- ✅ Dispatch summary statistics
- ✅ Customer assignment
- ✅ Notes & comments

### 6. Billing Management
- ✅ Create invoices
- ✅ View invoice list
- ✅ Invoice details modal
- ✅ Download invoices
- ✅ Create purchase orders
- ✅ View PO list
- ✅ PO status tracking
- ✅ Payment status
- ✅ Invoice search
- ✅ Date filtering

### 7. User Management
- ✅ Customer CRUD operations
- ✅ Supplier CRUD operations
- ✅ View user details
- ✅ Edit user information
- ✅ Delete users with confirmation
- ✅ Search customers/suppliers
- ✅ Contact information management
- ✅ Company details
- ✅ Address management
- ✅ User statistics

### 8. Procurement Management
- ✅ Purchase order creation
- ✅ Supplier relationship tracking
- ✅ Delivery date management
- ✅ Order status tracking
- ✅ Product quantity management
- ✅ Unit price tracking
- ✅ Total cost calculation
- ✅ Search orders
- ✅ Date range filtering
- ✅ Order statistics

### 9. UI/UX Features
- ✅ Clean, professional design
- ✅ Responsive layout (mobile/tablet/desktop)
- ✅ Dark gradient sidebar with green accents
- ✅ Loading states
- ✅ Error handling & messages
- ✅ Confirmation dialogs
- ✅ Modal windows
- ✅ Toast notifications
- ✅ Search functionality
- ✅ Filter & sort options
- ✅ Status badges
- ✅ Icon integration (Lucide)
- ✅ Form validation
- ✅ Touch-friendly buttons (44px min)

---

## 🗄️ DATABASE SCHEMA

### DynamoDB Tables (9 Tables)

#### 1. inventory-users
```
Primary Key: userId (String)
GSI: EmailIndex (email)
Attributes:
  - userId: String (PK)
  - name: String
  - email: String (GSI)
  - password: String (hashed)
  - role: String (Admin/User)
  - isActive: Boolean
  - createdAt: String
  - updatedAt: String
```

#### 2. inventory-products
```
Primary Key: id (String)
GSI: CategoryIndex (category)
Attributes:
  - id: String (PK)
  - name: String
  - category: String (A/B/C) (GSI)
  - barcode: String
  - quantity: Number
  - price: Number
  - createdAt: String
  - updatedAt: String
```

#### 3. inventory-stock
```
Primary Key: id (String)
GSI: ProductIndex (productId), LocationIndex (location)
Attributes:
  - id: String (PK)
  - productId: String (GSI)
  - itemName: String
  - quantity: Number
  - location: String (GSI)
  - supplier: String
  - batchNumber: String
  - expiryDate: String
  - createdAt: String
  - updatedAt: String
```

#### 4. inventory-orders
```
Primary Key: id (String)
GSI: CustomerIndex (customerId + orderDate)
Attributes:
  - id: String (PK)
  - customerId: String (GSI)
  - customerName: String
  - items: List (productId, productName, quantity, price)
  - orderValue: Number
  - orderDate: String (GSI)
  - status: String
  - createdAt: String
```

#### 5. inventory-suppliers
```
Primary Key: supplierId (String)
Attributes:
  - supplierId: String (PK)
  - name: String
  - email: String
  - phone: String
  - address: String
  - company: String
  - createdAt: String
  - updatedAt: String
```

#### 6. inventory-customers
```
Primary Key: customerId (String)
Attributes:
  - customerId: String (PK)
  - name: String
  - email: String
  - phone: String
  - address: String
  - company: String
  - createdAt: String
  - updatedAt: String
```

#### 7. inventory-invoices
```
Primary Key: invoiceId (String)
Attributes:
  - invoiceId: String (PK)
  - customerName: String
  - date: String
  - items: List
  - details: List
  - amount: Number
  - status: String (Paid/Pending)
  - createdAt: String
```

#### 8. inventory-purchase-orders
```
Primary Key: purchaseorderId (String)
Attributes:
  - purchaseorderId: String (PK)
  - supplierId: String
  - supplierName: String
  - productId: String
  - productName: String
  - quantity: Number
  - unitPrice: Number
  - totalCost: Number
  - orderDate: String
  - deliveryDate: String
  - status: String
  - createdAt: String
```

#### 9. inventory-dispatch
```
Primary Key: dispatchId (String)
Attributes:
  - dispatchId: String (PK)
  - stockId: String
  - itemName: String
  - dispatchedQuantity: Number
  - invoiceId: String
  - customerId: String
  - customerName: String
  - dispatchDate: String
  - status: String (Pending/In Transit/Delivered)
  - notes: String
  - createdAt: String
```

---

## 🔌 API ENDPOINTS

### Base URL: `http://localhost:8000/api`

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/auth/verify` | Verify JWT token | Yes |

### Product Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | Yes |
| GET | `/products/:id` | Get single product | Yes |
| POST | `/products` | Create new product | Yes |
| PUT | `/products/:id` | Update product | Yes |
| DELETE | `/products/:id` | Delete product | Yes |

### Stock Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stock` | Get all stock | Yes |
| GET | `/stock/:id` | Get single stock item | Yes |
| POST | `/stock` | Add stock | Yes |
| PUT | `/stock/:id` | Update stock | Yes |
| POST | `/stock/:id/dispatch` | Dispatch stock | Yes |

### Order Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | Get all orders | Yes |
| GET | `/orders/:id` | Get single order | Yes |
| POST | `/orders` | Create new order | Yes |
| GET | `/orders/income/summary` | Get income summary | Yes |

### Customer Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/customers` | Get all customers | Yes |
| GET | `/customers/:id` | Get single customer | Yes |
| POST | `/customers` | Create customer | Yes |
| PUT | `/customers/:id` | Update customer | Yes |
| DELETE | `/customers/:id` | Delete customer | Yes |

### Supplier Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/suppliers` | Get all suppliers | Yes |
| GET | `/suppliers/:id` | Get single supplier | Yes |
| POST | `/suppliers` | Create supplier | Yes |
| PUT | `/suppliers/:id` | Update supplier | Yes |
| DELETE | `/suppliers/:id` | Delete supplier | Yes |

### Invoice Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/invoices` | Get all invoices | Yes |
| GET | `/invoices/:id` | Get single invoice | Yes |
| POST | `/invoices` | Create invoice | Yes |
| PUT | `/invoices/:id` | Update invoice | Yes |
| DELETE | `/invoices/:id` | Delete invoice | Yes |

### Purchase Order Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/purchase-orders` | Get all POs | Yes |
| GET | `/purchase-orders/:id` | Get single PO | Yes |
| POST | `/purchase-orders` | Create PO | Yes |
| PUT | `/purchase-orders/:id` | Update PO | Yes |
| DELETE | `/purchase-orders/:id` | Delete PO | Yes |

### Dispatch Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dispatch` | Get dispatch history | Yes |
| POST | `/dispatch` | Create dispatch record | Yes |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Server health check | No |

---

## 🧩 COMPONENT HIERARCHY

```
App.jsx (Root)
│
├── Router
│   ├── Login.jsx
│   ├── Register.jsx
│   │
│   └── Dashboard.jsx (Protected)
│       ├── Sidebar.jsx
│       │   ├── Home Link
│       │   ├── Overview Submenu
│       │   ├── Products Submenu
│       │   ├── Dispatch Submenu
│       │   ├── Billing Submenu
│       │   └── Users Submenu
│       │
│       └── Routes
│           ├── Home.jsx
│           │
│           ├── Overview Section
│           │   ├── Stock.jsx
│           │   ├── AddStock.jsx
│           │   ├── AvailableStocks.jsx
│           │   └── Income.jsx
│           │
│           ├── Products Section
│           │   ├── Products.jsx
│           │   ├── AddProduct.jsx
│           │   └── EditProduct.jsx
│           │
│           ├── Dispatch Section
│           │   ├── DispatchStock.jsx
│           │   └── DispatchHistory.jsx
│           │
│           ├── Billing Section
│           │   ├── Invoice.jsx
│           │   ├── CreateInvoice.jsx
│           │   ├── PurchaseOrder.jsx
│           │   └── CreatePurchaseOrder.jsx
│           │
│           └── Users Section
│               ├── Customer.jsx
│               ├── AddCustomer.jsx
│               ├── EditCustomer.jsx
│               ├── Supplier.jsx
│               ├── AddSupplier.jsx
│               └── EditSupplier.jsx
```

---

## 🔄 DATA FLOW

### Authentication Flow
```
1. User enters credentials → Login.jsx
2. authService.login() → POST /api/auth/login
3. Backend validates → DynamoDB users table
4. JWT token generated → Stored in localStorage
5. User redirected → Dashboard
6. All API calls include token → Authorization header
```

### CRUD Operation Flow (Example: Products)
```
CREATE:
Products.jsx → Add Button → AddProduct.jsx → Form Submit
→ productService.createProduct() → POST /api/products
→ Backend validates → DynamoDB products table → Response
→ Navigate back to Products.jsx → Refresh list

READ:
Products.jsx → useEffect → productService.getProducts()
→ GET /api/products → Backend queries DynamoDB
→ Response with data → Update state → Render table

UPDATE:
Products.jsx → Edit Button → EditProduct.jsx → Form Submit
→ productService.updateProduct() → PUT /api/products/:id
→ Backend updates DynamoDB → Response
→ Navigate back to Products.jsx → Refresh list

DELETE:
Products.jsx → Delete Button → Confirmation Dialog
→ productService.deleteProduct() → DELETE /api/products/:id
→ Backend deletes from DynamoDB → Response
→ Update local state → Remove from table
```

---

## 🚀 SETUP & INSTALLATION

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- AWS Account with DynamoDB access
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd INVENTORY
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
# Edit .env file with your AWS credentials

# Create DynamoDB tables (optional)
node setup-tables.js

# Start backend server
npm run dev
# Server runs on http://localhost:8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure environment variables
# Create .env.local file:
# VITE_API_BASE_URL=http://localhost:8000/api

# Start frontend dev server
npm run dev
# App runs on http://localhost:5173
```

### 4. Quick Start (Windows)
```bash
# Run both servers automatically
start-servers.bat
```

### 5. Access Application
```
Frontend: http://localhost:5173
Backend API: http://localhost:8000/api
Health Check: http://localhost:8000/api/health
```

---

## 📊 PROJECT STATISTICS

| Metric | Count |
|--------|-------|
| Total Files | 50+ |
| React Components | 27 |
| API Services | 6 |
| Backend Routes | 9 |
| DynamoDB Tables | 9 |
| API Endpoints | 40+ |
| CSS Files | 8+ |
| Lines of Code | 10,000+ |

---

## 🎯 PROJECT STATUS

**Status:** ✅ PRODUCTION READY

- ✅ All features implemented
- ✅ Zero syntax errors
- ✅ Zero import errors
- ✅ Complete CRUD operations
- ✅ Full authentication system
- ✅ Responsive design
- ✅ Error handling
- ✅ DynamoDB integration
- ✅ Professional UI/UX

---

## 📝 NOTES

1. **Environment Variables:** Always configure `.env` files before running
2. **AWS Credentials:** Required for DynamoDB access
3. **Port Configuration:** Backend uses port 8000, Frontend uses 5173
4. **CORS:** Enabled for local development
5. **Authentication:** JWT tokens stored in localStorage
6. **Mobile Support:** Fully responsive design implemented
7. **Error Handling:** ErrorBoundary catches React errors
8. **Loading States:** All components show loading indicators

---

## 📞 SUPPORT

For issues or questions:
1. Check browser console (F12) for errors
2. Verify backend server is running
3. Check DynamoDB table configuration
4. Review API endpoint responses
5. Clear browser cache and localStorage

---

**Documentation Version:** 1.0  
**Last Updated:** 2024  
**Maintained By:** Development Team
