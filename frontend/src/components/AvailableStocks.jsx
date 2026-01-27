import { useState, useEffect } from 'react';
import { Package, Search, Eye, AlertTriangle, X } from 'lucide-react';
import { stockService } from '../services/productService';
import '../styles/AvailableStocks.css';

const AvailableStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    fetchAvailableStocks();
  }, []);

  const fetchAvailableStocks = async () => {
    try {
      const result = await stockService.getStock();
      if (result.success) {
        setStocks(result.data);
      } else {
        console.error('Failed to fetch stocks:', result.error);
      }
    } catch (error) {
      console.error('Error fetching available stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    (stock.itemName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stock.productId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stock.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity) => {
    if (quantity <= 10) return 'low';
    if (quantity <= 50) return 'medium';
    return 'high';
  };

  const handleViewDetails = (stock) => {
    setSelectedStock(stock);
  };

  const closeDetails = () => {
    setSelectedStock(null);
  };

  if (loading) {
    return <div className="loading">Loading available stocks...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📦 Available Stocks</h1>
          <p>View and manage current stock levels</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stocks.length}</p>
            <span className="stat-label">Active products</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <p className="stat-value">{stocks.filter(s => s.availableStock <= 50).length}</p>
            <span className="stat-label">Items need restock</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Stock Inventory</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search stocks..."
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
                <th>Item Name</th>
                <th>Available Stock</th>
                <th>Category</th>
                <th>Location</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.id}>
                  <td>{stock.productId || stock.id}</td>
                  <td>{stock.itemName || stock.name}</td>
                  <td>
                    <span className={`stock-quantity ${getStockStatus(stock.availableStock || stock.quantity)}`}>
                      {stock.availableStock || stock.quantity}
                    </span>
                  </td>
                  <td>
                    <span className={`category category-${(stock.category || 'a').toLowerCase()}`}>
                      {stock.category || 'N/A'}
                    </span>
                  </td>
                  <td>{stock.location || '-'}</td>
                  <td>{stock.supplier || '-'}</td>
                  <td>
                    <span className={`status status-${getStockStatus(stock.availableStock || stock.quantity)}`}>
                      {getStockStatus(stock.availableStock || stock.quantity).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon view"
                        onClick={() => handleViewDetails(stock)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStock && (
        <div className="stock-form-overlay">
          <div className="stock-form-modal">
            <div className="form-header">
              <h3>Stock Details</h3>
              <button className="btn-icon" onClick={closeDetails}>
                <X size={20} />
              </button>
            </div>

            <div className="stock-details">
              <div className="detail-row">
                <label>Product ID:</label>
                <span>{selectedStock.productId}</span>
              </div>
              <div className="detail-row">
                <label>Item Name:</label>
                <span>{selectedStock.itemName}</span>
              </div>
              <div className="detail-row">
                <label>Available Stock:</label>
                <span className={`stock-quantity ${getStockStatus(selectedStock.availableStock || selectedStock.quantity || 0)}`}>
                  {selectedStock.availableStock || selectedStock.quantity || 0} units
                </span>
              </div>
              <div className="detail-row">
                <label>Category:</label>
                <span className={`category category-${(selectedStock.category || 'a').toLowerCase()}`}>
                  {selectedStock.category || 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <label>Location:</label>
                <span>{selectedStock.location || '-'}</span>
              </div>
              <div className="detail-row">
                <label>Supplier:</label>
                <span>{selectedStock.supplier || '-'}</span>
              </div>
              <div className="detail-row">
                <label>Batch Number:</label>
                <span>{selectedStock.batchNumber || '-'}</span>
              </div>
              <div className="detail-row">
                <label>Last Updated:</label>
                <span>{selectedStock.lastUpdated || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableStocks;
