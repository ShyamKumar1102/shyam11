import { useState } from 'react';
import { Search, CheckCircle, Calendar, Truck, User, Package } from 'lucide-react';
import '../styles/Products.css';

const ShipmentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📦 Shipment History</h1>
          <p>View all completed and delivered shipments</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <CheckCircle size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Total Delivered</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">All time deliveries</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <Calendar size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">Delivered this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Truck size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Delivery Time</h3>
            <p className="stat-value">0 days</p>
            <span className="stat-label">Average duration</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Success Rate</h3>
            <p className="stat-value">100%</p>
            <span className="stat-label">Delivery success</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Delivered Shipments</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by tracking number, customer, or courier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Customer</th>
                <th>Courier</th>
                <th>Items/Quantity</th>
                <th>Shipment Date</th>
                <th>Delivery Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                  No delivered shipments yet. Complete some shipments to see history.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentHistory;