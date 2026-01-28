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

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dispatch', dispatchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Network access: http://192.168.1.10:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
    server.listen(PORT + 1, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});