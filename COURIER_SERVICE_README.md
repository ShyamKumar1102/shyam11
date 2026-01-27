# Courier Service Feature

## 🚚 Overview
Complete courier and shipment tracking system integrated into the inventory management application.

## ✨ Features

### Courier Management
- ✅ Add, edit, and delete courier companies
- ✅ Track courier contact information
- ✅ Set base pricing per courier
- ✅ Rate couriers (0-5 stars)
- ✅ Manage service areas
- ✅ Active/Inactive status toggle

### Shipment Tracking
- ✅ Create shipments with auto-generated tracking numbers
- ✅ Assign couriers to shipments
- ✅ Track customer delivery information
- ✅ Real-time status updates:
  - Pending
  - Picked Up
  - In Transit
  - Out for Delivery
  - Delivered
- ✅ Search and filter shipments
- ✅ Estimated delivery dates
- ✅ Pickup and delivery date tracking

## 📁 Files Created

### Frontend Components
- `frontend/src/components/Couriers.jsx` - Courier list view
- `frontend/src/components/AddCourier.jsx` - Add new courier
- `frontend/src/components/EditCourier.jsx` - Edit courier details
- `frontend/src/components/Shipments.jsx` - Shipment list with filters
- `frontend/src/components/CreateShipment.jsx` - Create new shipment
- `frontend/src/components/ShipmentDetails.jsx` - View and update shipment

### Frontend Services
- `frontend/src/services/courierService.js` - API client for courier/shipment operations

### Backend Routes
- `backend/routes/couriers.js` - Courier CRUD operations
- `backend/routes/shipments.js` - Shipment management and tracking

### Database
- `backend/setup-courier-tables.js` - DynamoDB table creation script

### Styles
- Updated `frontend/src/styles/Common.css` with courier-specific styles

## 🗄️ Database Schema

### Couriers Table (`inventory-couriers`)
```
{
  id: String (PK),
  name: String,
  contact: String,
  email: String,
  serviceAreas: Array<String>,
  pricing: Number,
  rating: Number,
  isActive: Boolean,
  createdAt: String,
  updatedAt: String
}
```

### Shipments Table (`inventory-shipments`)
```
{
  id: String (PK),
  orderId: String,
  courierId: String,
  courierName: String,
  trackingNumber: String (auto-generated),
  customerName: String,
  customerAddress: String,
  customerPhone: String,
  items: Array,
  status: String,
  shipmentDate: String,
  estimatedDelivery: String,
  pickupDate: String,
  deliveryDate: String,
  createdAt: String,
  updatedAt: String
}
```

## 🔌 API Endpoints

### Couriers
- `GET /api/couriers` - Get all couriers
- `GET /api/couriers/:id` - Get single courier
- `POST /api/couriers` - Create courier
- `PUT /api/couriers/:id` - Update courier
- `DELETE /api/couriers/:id` - Delete courier

### Shipments
- `GET /api/shipments` - Get all shipments
- `GET /api/shipments/:id` - Get single shipment
- `GET /api/shipments/track/:trackingNumber` - Track by tracking number
- `GET /api/shipments/order/:orderId` - Get shipments by order
- `POST /api/shipments` - Create shipment
- `PUT /api/shipments/:id/status` - Update shipment status
- `PUT /api/shipments/:id` - Update shipment details

## 🚀 Setup Instructions

### 1. Database Tables (Already Done)
```bash
cd backend
node setup-courier-tables.js
```

### 2. Environment Variables (Already Added)
The following were added to `backend/.env`:
```
COURIERS_TABLE=inventory-couriers
SHIPMENTS_TABLE=inventory-shipments
```

### 3. Restart Backend Server
```bash
cd backend
npm run dev
```

### 4. Access the Feature
Navigate to the sidebar and click on:
- **Courier Service** → **Manage Couriers** - To manage courier companies
- **Courier Service** → **Shipment Tracking** - To track shipments

## 📱 Usage

### Adding a Courier
1. Go to "Manage Couriers"
2. Click "Add Courier"
3. Fill in courier details (name, contact, email, pricing, rating)
4. Add service areas (comma-separated)
5. Click "Save Courier"

### Creating a Shipment
1. Go to "Shipment Tracking"
2. Click "Create Shipment"
3. Enter order ID
4. Select courier from dropdown
5. Fill in customer details and delivery address
6. Set estimated delivery date (optional)
7. Click "Create Shipment"
8. A unique tracking number will be auto-generated

### Tracking a Shipment
1. Go to "Shipment Tracking"
2. Use search box to find by tracking number, customer, or courier
3. Filter by status (Pending, In Transit, Delivered, etc.)
4. Click the eye icon to view details
5. Update status by clicking status buttons

## 🎨 UI Features
- Clean, modern design matching existing app style
- Responsive layout for mobile and desktop
- Real-time search and filtering
- Color-coded status badges
- Interactive status timeline
- Star ratings for couriers
- Active/Inactive status indicators

## 🔒 Security
- All endpoints protected with JWT authentication
- Input validation on forms
- Secure DynamoDB operations
- Error handling and user feedback

## 📊 Future Enhancements
- Email/SMS notifications for status updates
- Bulk shipment creation
- Courier performance analytics
- Integration with third-party courier APIs (FedEx, UPS)
- Proof of delivery uploads
- Shipping label generation
- Return shipment management
- Cost analytics per courier

## ✅ Status
**FULLY IMPLEMENTED AND READY TO USE!** 🎉

All components, routes, and database tables are created and configured.
The courier service is now live in your sidebar menu.
