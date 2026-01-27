import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Edit, Trash2, Star, Search, DollarSign, Award, MapPin } from 'lucide-react';
import { courierService } from '../services/courierService';
import '../styles/Products.css';

const Couriers = () => {
  const [couriers, setCouriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      setLoading(true);
      const data = await courierService.getAllCouriers();
      setCouriers(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch couriers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this courier?')) {
      try {
        await courierService.deleteCourier(id);
        fetchCouriers();
        alert('Courier deleted successfully');
      } catch (err) {
        console.error(err);
        alert('Failed to delete courier');
      }
    }
  };

  const filteredCouriers = couriers.filter(courier =>
    courier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCouriers = couriers.length;
  const activeCouriers = couriers.filter(c => c.isActive).length;
  const avgRating = couriers.length > 0 ? (couriers.reduce((sum, c) => sum + (c.rating || 0), 0) / couriers.length).toFixed(1) : 0;
  const avgPricing = couriers.length > 0 ? (couriers.reduce((sum, c) => sum + (c.pricing || 0), 0) / couriers.length).toFixed(2) : 0;

  if (loading) return <div className="loading">Loading couriers...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🚚 Courier Management</h1>
          <p>Manage courier companies and delivery services</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/couriers/add')}>
          <Plus size={20} />
          Add Courier
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Truck size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Couriers</h3>
            <p className="stat-value">{totalCouriers}</p>
            <span className="stat-label">Registered companies</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <MapPin size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Active Couriers</h3>
            <p className="stat-value">{activeCouriers}</p>
            <span className="stat-label">Currently available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Award size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Rating</h3>
            <p className="stat-value">{avgRating} ⭐</p>
            <span className="stat-label">Customer satisfaction</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <DollarSign size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>Avg Pricing</h3>
            <p className="stat-value">${avgPricing}</p>
            <span className="stat-label">Base delivery cost</span>
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
                <th>Courier Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Base Pricing</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCouriers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No couriers found</td>
                </tr>
              ) : (
                filteredCouriers.map((courier) => (
                  <tr key={courier.id}>
                    <td>
                      <div className="item-info">
                        <Truck size={16} />
                        <span><strong>{courier.name}</strong></span>
                      </div>
                    </td>
                    <td>{courier.contact}</td>
                    <td>{courier.email}</td>
                    <td className="currency">${courier.pricing?.toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <strong>{courier.rating?.toFixed(1)}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${courier.isActive ? 'success' : 'warning'}`}>
                        {courier.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit" 
                          onClick={() => navigate(`/dashboard/couriers/edit/${courier.id}`)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          onClick={() => handleDelete(courier.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Couriers;
