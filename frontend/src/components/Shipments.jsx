import { useState } from 'react';
import { Search, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import '../styles/Products.css';

const Shipments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statusOptions = ['All', 'Pending', 'In Transit', 'Delivered'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📦 Shipment Tracking</h1>
          <p>Track and manage all shipments in real-time</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Shipments</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">All shipments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">Awaiting pickup</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <TrendingUp size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>In Transit</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">On the way</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <CheckCircle size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Delivered</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">Successfully delivered</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Shipment List</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
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
                <th>Est. Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  No shipments found. Create your first shipment from dispatch.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shipments;