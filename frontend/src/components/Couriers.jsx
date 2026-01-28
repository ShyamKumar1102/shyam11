import { useState } from 'react';
import { Search, Plus, Truck, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Products.css';

const Couriers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🚚 Manage Couriers</h1>
          <p>Manage courier companies and delivery services</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/couriers/add')}
        >
          <Plus size={20} />
          Add Courier
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <Truck size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>Total Couriers</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">Active courier services</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <Truck size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Active Services</h3>
            <p className="stat-value">0</p>
            <span className="stat-label">Currently available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Truck size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Rating</h3>
            <p className="stat-value">0.0</p>
            <span className="stat-label">Service quality</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Courier Companies</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search couriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Service Type</th>
                <th>Pricing</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  No courier companies found. Add your first courier service.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Couriers;