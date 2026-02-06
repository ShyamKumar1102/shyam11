import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Package, AlertTriangle, Box, Search, BarChart3, Eye } from 'lucide-react';
import { stockService } from '../services/productService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';
import Badge from './Badge';
import '../styles/Stock.css';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ isOpen: false, stock: null });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const result = await stockService.getStock();
      if (result.success) {
        setStockData(Array.isArray(result.data) ? result.data : []);
      } else {
        setStockData([]);
        alert(result.error || 'Failed to fetch stock');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setStockData([]);
      alert('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (stock) => {
    setViewModal({ isOpen: true, stock });
  };

  const stockFields = [
    { label: 'Product ID', key: 'productId' },
    { label: 'Product Name', key: 'itemName' },
    { label: 'Stock Unit ID', key: 'stockUnitId' },
    { label: 'Current Stock', key: 'currentStock' },
    { label: 'Category', key: 'category' },
    { label: 'Location', key: 'location' },
    { label: 'Supplier', key: 'supplier' },
    { label: 'Status', key: 'status' }
  ];

  const totalProducts = stockData.length;
  const lowStockItems = Array.isArray(stockData) ? stockData.filter(item => (item.quantity || item.currentStock) < 20) : [];
  const maxStockItem = Array.isArray(stockData) ? stockData.reduce((max, item) => {
    const qty = item.quantity || item.maxStock || 0;
    return qty > (max?.quantity || max?.maxStock || 0) ? item : max;
  }, null) : null;

  const filteredStockData = Array.isArray(stockData) ? stockData.filter(item =>
    (item.productId || item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.itemName || item.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.stockUnitId || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }

  // Prepare stock data for modal
  const modalStock = viewModal.stock ? {
    ...viewModal.stock,
    productId: viewModal.stock.productId || viewModal.stock.id,
    itemName: viewModal.stock.itemName || viewModal.stock.productName,
    stockUnitId: viewModal.stock.stockUnitId || viewModal.stock.id,
    currentStock: `${viewModal.stock.quantity || viewModal.stock.currentStock || 0} units`,
    status: (viewModal.stock.quantity || viewModal.stock.currentStock || 0) < 20 ? 'Critical' : 'Good'
  } : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1><BarChart3 size={20} style={{ marginRight: '8px' }} />Stock Summary</h1>
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
                <th>Actions</th>
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
                  <td><Badge variant="purple">{stockUnitId}</Badge></td>
                  <td>
                    <Badge variant="purple">{currentStock} units</Badge>
                  </td>
                  <td>
                    <CategoryBadge category={item.category || 'N/A'} />
                  </td>
                  <td>{item.location ? <Badge variant="cyan">{item.location}</Badge> : <Badge variant="gray">N/A</Badge>}</td>
                  <td>{item.supplier ? <Badge variant="teal">{item.supplier}</Badge> : <Badge variant="gray">-</Badge>}</td>
                  <td>
                    <StatusBadge status={currentStock < 20 ? 'Critical' : 'Good'} />
                  </td>
                  <td>
                    <button 
                      className="btn-icon view"
                      onClick={() => handleView(item)}
                      title="View Stock Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    No stock items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, stock: null })}
        title="Stock Details"
        data={modalStock}
        fields={stockFields}
      />
    </div>
  );
};

export default Stock;