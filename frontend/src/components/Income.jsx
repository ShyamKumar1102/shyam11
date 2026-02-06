import { useState, useEffect } from 'react';
import { Search, TrendingUp, Calendar, DollarSign, Package, ShoppingCart, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/productService';
import { purchaseOrderService } from '../services/billingService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
import '../styles/Income.css';
import '../styles/CourierStyles.css';

const Income = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  const [viewModal, setViewModal] = useState({ isOpen: false, order: null });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchOrders();
    fetchPurchaseOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await orderService.getOrders();
      if (result.success) {
        setOrders(Array.isArray(result.data) ? result.data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const result = await purchaseOrderService.getPurchaseOrders();
      if (result.success) {
        setPurchaseOrders(Array.isArray(result.data) ? result.data : []);
      } else {
        setPurchaseOrders([]);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredPurchaseOrders = purchaseOrders.filter(order => {
    const matchesSearch = (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.productName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleView = (order) => {
    setViewModal({ isOpen: true, order });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchPurchaseOrders()]);
    setRefreshing(false);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalPurchaseValue = purchaseOrders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
  const pendingPurchaseOrders = purchaseOrders.filter(o => o.status === 'Pending').length;

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
    unitPrice: `$${viewModal.order.unitPrice || 0}`,
    totalAmount: `$${viewModal.order.totalAmount || 0}`,
    quantity: `${viewModal.order.quantity || 0} units`
  } : null;

  if (loading) {
    return <div className="loading">Loading orders...</div>;
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
            onClick={() => navigate('/dashboard/purchase-orders/add')}
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
            <h3>Purchase Orders</h3>
            <p className="stat-value">{purchaseOrders.length}</p>
            <span className="stat-label">{pendingPurchaseOrders} pending</span>
          </div>
        </div>
      </div>

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
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td><Badge variant="blue">{order.customerName || 'N/A'}</Badge></td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} />
                          <span>{order.orderDate || 'N/A'}</span>
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
                        <Badge variant="green">${order.totalAmount}</Badge>
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} />
                          <span>{order.orderDate}</span>
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

export default Income;