const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const stockRoutes = require('./routes/stock');
const orderRoutes = require('./routes/orders');
const supplierRoutes = require("./routes/suppliers");
const customerRoutes = require('./routes/customers');
const dispatchRoutes = require('./routes/dispatch');
const invoiceRoutes = require('./routes/invoices');
const courierRoutes = require('./routes/couriers');
const shipmentRoutes = require('./routes/shipments');
const purchaseBillRoutes = require('./routes/purchase-bills');
const purchaseOrderRoutes = require('./routes/purchase-orders');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/couriers', courierRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/purchase-bills', purchaseBillRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = parseInt(PORT) + 1;
    console.log(`Port ${PORT} is busy, trying port ${newPort}`);
    app.listen(newPort, '0.0.0.0', () => {
      console.log(`Server running on port ${newPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});