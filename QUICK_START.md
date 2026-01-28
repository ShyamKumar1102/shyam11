# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- AWS Account with DynamoDB access
- AWS credentials configured in `backend/.env`

## 🏃‍♂️ Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Double-click this file to start everything automatically
setup-and-start.bat
```

### Option 2: Manual Setup
```bash
# 1. Setup backend
cd backend
npm install
node setup-tables.js
npm run dev

# 2. Setup frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

## 🔐 Default Credentials
- **Email**: admin@inventory.com
- **Password**: admin123

## 📁 Key Features
- ✅ User Authentication (Register/Login)
- ✅ Product Management with Barcode Generation
- ✅ Stock Management & Tracking
- ✅ Order Management & Income Tracking
- ✅ Customer & Supplier Management
- ✅ Invoice Generation
- ✅ Dispatch & Shipment Tracking
- ✅ Professional Dashboard with Statistics
- ✅ Responsive Design (Mobile-friendly)

## 🛠️ Tech Stack
- **Frontend**: React 19 + Vite + Lucide Icons
- **Backend**: Node.js + Express + AWS DynamoDB
- **Authentication**: JWT + bcrypt
- **Styling**: Modern CSS with Professional Design

## 📊 Database Tables
The system automatically creates these DynamoDB tables:
- `inventory-users` - User accounts
- `inventory-products` - Product catalog
- `inventory-stock` - Stock management
- `inventory-orders` - Order tracking
- `inventory-customers` - Customer data
- `inventory-suppliers` - Supplier data
- `inventory-invoices` - Invoice records
- `inventory-couriers` - Courier services
- `inventory-shipments` - Shipment tracking

## 🔧 Configuration
Update AWS credentials in `backend/.env`:
```env
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## 🆘 Troubleshooting
- **Backend won't start**: Check AWS credentials and DynamoDB permissions
- **Frontend won't connect**: Ensure backend is running on port 8000
- **Database errors**: Run `node setup-tables.js` in backend folder
- **Port conflicts**: Check if ports 5173 and 8000 are available

## 📱 Mobile Support
The application is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers

## 🎯 Getting Started
1. Run `setup-and-start.bat`
2. Wait for both servers to start
3. Open http://localhost:5173
4. Register a new account
5. Start managing your inventory!

---
**Happy Inventory Management! 📦✨**