import { useState, useEffect } from 'react';
import { Package, Search, Eye, AlertTriangle } from 'lucide-react';
import { stockService } from '../services/productService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';
import Badge from './Badge';
import '../styles/AvailableStocks.css';
import '../styles/DynamicModal.css';

const AvailableStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
  };

  const closeDetails = () => {
    setSelectedStock(null);
    setShowModal(false);
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
                  <td><strong>{stock.productId || stock.id}</strong></td>
                  <td>
                    <div className="item-info">
                      <Package size={16} />
                      <span>{stock.itemName || stock.name}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant="purple">{stock.availableStock || stock.quantity} units</Badge>
                  </td>
                  <td>
                    <CategoryBadge category={stock.category || 'N/A'} />
                  </td>
                  <td>{stock.location ? <Badge variant="cyan">{stock.location}</Badge> : <Badge variant="gray">-</Badge>}</td>
                  <td>{stock.supplier ? <Badge variant="teal">{stock.supplier}</Badge> : <Badge variant="gray">-</Badge>}</td>
                  <td>
                    <StatusBadge status={getStockStatus(stock.availableStock || stock.quantity)} />
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

      <ViewModal
        isOpen={showModal}
        onClose={closeDetails}
        title="Stock Details"
        data={selectedStock}
        fields={[
          { key: 'productId', label: 'Product ID' },
          { key: 'itemName', label: 'Item Name' },
          { key: 'availableStock', label: 'Available Stock', suffix: ' units' },
          { key: 'category', label: 'Category' },
          { key: 'location', label: 'Location' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'batchNumber', label: 'Batch Number' },
          { key: 'lastUpdated', label: 'Last Updated' }
        ]}
      />
    </div>
  );
};

export default AvailableStocks;
