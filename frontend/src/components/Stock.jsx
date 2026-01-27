import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Package, AlertTriangle, Box, Search } from 'lucide-react';
import { stockService } from '../services/productService';
import '../styles/Stock.css';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const result = await stockService.getStock();
      if (result.success) {
        setStockData(result.data);
      } else {
        alert(result.error || 'Failed to fetch stock');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      alert('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = stockData.length;
  const lowStockItems = stockData.filter(item => (item.quantity || item.currentStock) < 20);
  const maxStockItem = stockData.reduce((max, item) => {
    const qty = item.quantity || item.maxStock || 0;
    return qty > (max?.quantity || max?.maxStock || 0) ? item : max;
  }, null);

  const filteredStockData = stockData.filter(item =>
    (item.productId || item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.itemName || item.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.stockUnitId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📊 Stock Summary</h1>
          <p>Overview of inventory stock levels and statistics</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/dashboard/stock/add" className="btn btn-primary">
            <Plus size={20} />
            Add Stock
          </Link>
          <Link to="/dashboard/stock/update" className="btn btn-primary">
            <TrendingUp size={20} />
            Update Stock
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <TrendingUp size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Maximum Stock</h3>
            <p className="stat-value">{maxStockItem?.quantity || maxStockItem?.maxStock || 0} units</p>
            <span className="stat-label">Product: {maxStockItem?.productId || maxStockItem?.id || 'N/A'}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{lowStockItems.length}</p>
            <span className="stat-label">Items below 20 units</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Box size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{totalProducts}</p>
            <span className="stat-label">Active products</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Stock Details</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by Product ID, Name, or Unit ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Stock Unit ID</th>
                <th>Current Stock</th>
                <th>Category</th>
                <th>Location</th>
                <th>Supplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStockData.length > 0 ? (
                filteredStockData.map((item) => {
                  const productId = item.productId || item.id;
                  const productName = item.itemName || item.productName;
                  const currentStock = item.quantity || item.currentStock || 0;
                  const stockUnitId = item.stockUnitId || item.id;
                  const incomingStock = item.incomingStock || 0;
                  
                  return (
                  <tr key={item.id}>
                  <td><strong>{productId}</strong></td>
                  <td>
                    <div className="item-info">
                      <Package size={16} />
                      <span>{productName}</span>
                    </div>
                  </td>
                  <td>{stockUnitId}</td>
                  <td>
                    <span className={`stock-badge ${currentStock < 20 ? 'low' : currentStock < 50 ? 'medium' : 'high'}`}>
                      {currentStock} units
                    </span>
                  </td>
                  <td>
                    <span className={`category category-${(item.category || 'a').toLowerCase()}`}>
                      {item.category || 'N/A'}
                    </span>
                  </td>
                  <td>{item.location || 'N/A'}</td>
                  <td>{item.supplier || '-'}</td>
                  <td>
                    <span className={`status-badge ${currentStock < 20 ? 'warning' : 'success'}`}>
                      {currentStock < 20 ? 'Critical' : 'Good'}
                    </span>
                  </td>
                </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No stock items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stock;