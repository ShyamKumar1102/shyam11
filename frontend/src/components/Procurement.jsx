import { useState, useEffect } from 'react';
import { Search, TrendingUp, Calendar, DollarSign, Package, ShoppingCart, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
import '../styles/Income.css';

const Procurement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  const [viewModal, setViewModal] = useState({ isOpen: false, order: null });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setError(null);
    await Promise.all([fetchOrders(), fetchPurchaseOrders()]);
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load sales orders');
      setOrders([]);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/purchase-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPurchaseOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setError('Failed to load purchase orders');
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleView = (order) => {
    setViewModal({ isOpen: true, order });
  };

  const filteredOrders = orders.filter(order =>
    (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.orderId || order.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPurchaseOrders = purchaseOrders.filter(order =>
    (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalPurchaseValue = purchaseOrders.reduce((sum, order) => {
    const amount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount;
    return sum + (amount || 0);
  }, 0);
  const pendingPurchaseOrders = purchaseOrders.filter(o => o.status?.toLowerCase() === 'pending').length;

  const orderFields = [
    { label: 'Order ID', key: 'orderId' },
    { label: 'Supplier Name', key: 'supplierName' },
    { label: 'Product Name', key: 'productName' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Unit Price', key: 'unitPrice' },
    { label: 'Total Amount', key: 'totalAmount' },
    { label: 'Order Date', key: 'orderDate' },
    { label: 'Expected Delivery', key: 'expectedDelivery' },
    { label: 'Status', key: 'status' },
    { label: 'Notes', key: 'notes' }
  ];

  const modalOrder = viewModal.order ? {
    ...viewModal.order,
    unitPrice: `$${typeof viewModal.order.unitPrice === 'string' ? parseFloat(viewModal.order.unitPrice).toFixed(2) : (viewModal.order.unitPrice || 0).toFixed(2)}`,
    totalAmount: `$${typeof viewModal.order.totalAmount === 'string' ? parseFloat(viewModal.order.totalAmount).toFixed(2) : (viewModal.order.totalAmount || 0).toFixed(2)}`,
    quantity: `${viewModal.order.quantity || 0} units`
  } : null;

  if (loading) {
    return <div className="loading">Loading procurement data...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>💰 Procurement & Orders</h1>
          <p>Track revenue, orders, and manage purchase orders</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh Data"
          >
            <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard/add-purchase-order')}
          >
            <ShoppingCart size={20} />
            Add Purchase Order
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
            <DollarSign size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${totalRevenue.toFixed(2)}</p>
            <span className="stat-label">All time earnings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
            <Package size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrders}</p>
            <span className="stat-label">Orders processed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
            <TrendingUp size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Order Value</h3>
            <p className="stat-value">${avgOrderValue.toFixed(2)}</p>
            <span className="stat-label">Per order average</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
            <ShoppingCart size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Purchase Value</h3>
            <p className="stat-value">${totalPurchaseValue.toFixed(2)}</p>
            <span className="stat-label">{pendingPurchaseOrders} pending orders</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner" style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Package size={16} />
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              <Package size={16} />
              Sales Orders
            </button>
            <button 
              className={`tab-btn ${activeTab === 'purchase' ? 'active' : ''}`}
              onClick={() => setActiveTab('purchase')}
            >
              <ShoppingCart size={16} />
              Purchase Orders
            </button>
          </div>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder={activeTab === 'sales' ? "Search orders, customers..." : "Search by Order ID, Supplier, or Product..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="last-updated">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="table-container">
          {activeTab === 'sales' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId || order.id}>
                      <td><strong>{order.orderId || order.id}</strong></td>
                      <td><Badge variant="blue">{order.customerName || 'N/A'}</Badge></td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} />
                          {order.orderDate || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <Badge variant="green">${(order.totalAmount || 0).toFixed(2)}</Badge>
                      </td>
                      <td>
                        <StatusBadge status={order.status || 'Completed'} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                      <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        No sales orders found
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first order'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchaseOrders.length > 0 ? (
                  filteredPurchaseOrders.map((order) => (
                    <tr key={order.orderId || order.id}>
                      <td><strong>{order.orderId}</strong></td>
                      <td><Badge variant="blue">{order.supplierName}</Badge></td>
                      <td><Badge variant="cyan">{order.productName}</Badge></td>
                      <td><Badge variant="purple">{order.quantity} units</Badge></td>
                      <td>
                        <Badge variant="green">
                          ${typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount).toFixed(2) : (order.totalAmount || 0).toFixed(2)}
                        </Badge>
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} />
                          {order.orderDate}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        <button 
                          className="btn-icon view"
                          onClick={() => handleView(order)}
                          title="View Order Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                      No purchase orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <ViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, order: null })}
        title="Purchase Order Details"
        data={modalOrder}
        fields={orderFields}
      />
    </div>
  );
};

export default Procurement;