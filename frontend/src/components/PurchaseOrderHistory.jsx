import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Package, Calendar, DollarSign, Eye, ShoppingCart } from 'lucide-react';
import { purchaseOrderService } from '../services/billingService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import '../styles/Products.css';

const PurchaseOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ isOpen: false, order: null });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await purchaseOrderService.getPurchaseOrders();
      if (result.success) {
        setOrders(Array.isArray(result.data) ? result.data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order) => {
    setViewModal({ isOpen: true, order });
  };

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

  const filteredOrders = Array.isArray(orders) ? orders.filter(order =>
    (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const modalOrder = viewModal.order ? {
    ...viewModal.order,
    unitPrice: `$${viewModal.order.unitPrice || 0}`,
    totalAmount: `$${viewModal.order.totalAmount || 0}`,
    quantity: `${viewModal.order.quantity || 0} units`
  } : null;

  if (loading) {
    return <div className="loading">Loading purchase orders...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <ShoppingCart size={20} color="#fff" />
            </span>
            Purchase Order History
          </h1>
          <p>View and manage all purchase orders</p>
        </div>
        <Link to="/dashboard/purchase-orders/add" className="btn btn-primary">
          <Plus size={20} />
          Add Purchase Order
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <ShoppingCart size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{orders.length}</p>
            <span className="stat-label">Purchase orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Package size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value">{orders.filter(o => o.status === 'Pending').length}</p>
            <span className="stat-label">Awaiting approval</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <DollarSign size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Total Value</h3>
            <p className="stat-value">${orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0).toFixed(2)}</p>
            <span className="stat-label">All orders</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Purchase Orders</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by Order ID, Supplier, or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.orderId || order.id}>
                    <td><strong>{order.orderId}</strong></td>
                    <td>
                      <div className="item-info">
                        <Package size={16} />
                        <span>{order.supplierName}</span>
                      </div>
                    </td>
                    <td>{order.productName}</td>
                    <td>{order.quantity} units</td>
                    <td>
                      <span className="price-badge">
                        ${order.totalAmount}
                      </span>
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

export default PurchaseOrderHistory;