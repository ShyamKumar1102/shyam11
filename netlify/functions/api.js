const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('../../backend/routes/auth');
const productRoutes = require('../../backend/routes/products');
const stockRoutes = require('../../backend/routes/stock');
const orderRoutes = require('../../backend/routes/orders');
const supplierRoutes = require('../../backend/routes/suppliers');
const customerRoutes = require('../../backend/routes/customers');
const invoiceRoutes = require('../../backend/routes/invoices');
const purchaseOrderRoutes = require('../../backend/routes/purchaseOrders');
const dispatchRoutes = require('../../backend/routes/dispatch');
const courierRoutes = require('../../backend/routes/couriers');
const shipmentRoutes = require('../../backend/routes/shipments');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/shipments', shipmentRoutes);

module.exports.handler = serverless(app);
