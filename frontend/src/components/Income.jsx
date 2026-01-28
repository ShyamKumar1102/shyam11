import { useState, useEffect } from 'react';
import { Search, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react';
import { orderService } from '../services/productService';
import '../styles/Income.css';

const Income = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await orderService.getOrders();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>💰 Income & Orders</h1>
          <p>Track revenue and order management</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <DollarSign size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${totalRevenue.toFixed(2)}</p>
            <span className="stat-label">All time earnings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <Package size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrders}</p>
            <span className="stat-label">Orders processed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <TrendingUp size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Order Value</h3>
            <p className="stat-value">${avgOrderValue.toFixed(2)}</p>
            <span className="stat-label">Per order average</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Order History</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search orders..."
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
                    <td>{order.customerName || 'N/A'}</td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {order.orderDate || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="amount">${(order.totalAmount || 0).toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="status-badge success">
                        {order.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    No orders found
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

export default Income;