import { useState, useEffect } from 'react';
import { Search, Plus, Truck, Edit, Trash2, Eye, Star, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courierService } from '../services/courierService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
import '../styles/Products.css';
import '../styles/CourierStyles.css';

const Couriers = () => {
  const navigate = useNavigate();
  const [couriers, setCouriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ isOpen: false, courier: null });

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      const result = await courierService.getCouriers();
      if (result.success) {
        setCouriers(result.data);
      } else {
        console.error('Error fetching couriers:', result.error);
        alert(result.error || 'Failed to fetch couriers');
      }
    } catch (error) {
      console.error('Error fetching couriers:', error);
      alert('Failed to fetch couriers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCouriers = couriers.filter(courier =>
    courier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCouriers = couriers.length;
  const activeCouriers = couriers.filter(c => c.isActive).length;
  const avgRating = couriers.length > 0 ? 
    (couriers.reduce((sum, c) => sum + (c.rating || 0), 0) / couriers.length).toFixed(1) : '0.0';

  const handleEdit = (courier) => {
    navigate('/dashboard/couriers/edit', { state: { courier } });
  };

  const handleDelete = async (courierId) => {
    if (window.confirm('Are you sure you want to delete this courier?')) {
      try {
        const result = await courierService.deleteCourier(courierId);
        if (result.success) {
          setCouriers(couriers.filter(c => c.id !== courierId));
          alert('Courier deleted successfully');
        } else {
          alert(result.error || 'Failed to delete courier');
        }
      } catch (error) {
        console.error('Error deleting courier:', error);
        alert('Failed to delete courier');
      }
    }
  };

  const handleView = (courier) => {
    setViewModal({ isOpen: true, courier });
  };

  const courierFields = [
    { label: 'Company Name', key: 'name' },
    { label: 'Contact Person', key: 'contactPerson' },
    { label: 'Phone', key: 'phone' },
    { label: 'Email', key: 'email' },
    { label: 'Address', key: 'address' },
    { label: 'Service Type', key: 'serviceType' },
    { label: 'Pricing', key: 'pricing' },
    { label: 'Rating', key: 'rating' },
    { label: 'Status', key: 'status' }
  ];

  if (loading) {
    return <div className="loading">Loading couriers...</div>;
  }

  // Prepare courier data for modal
  const modalCourier = viewModal.courier ? {
    ...viewModal.courier,
    pricing: `$${viewModal.courier.pricing?.toFixed(2) || '0.00'}/kg`,
    rating: `${viewModal.courier.rating || 0}/5`,
    status: viewModal.courier.isActive ? 'Active' : 'Inactive'
  } : null;

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
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
            <Truck size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>Total Couriers</h3>
            <p className="stat-value">{totalCouriers}</p>
            <span className="stat-label">Registered services</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
            <Truck size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Active Services</h3>
            <p className="stat-value">{activeCouriers}</p>
            <span className="stat-label">Currently available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
            <Star size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Rating</h3>
            <p className="stat-value">{avgRating}</p>
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
              placeholder="Search couriers, contacts, or services..."
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
              {filteredCouriers.length > 0 ? (
                filteredCouriers.map((courier) => (
                  <tr key={courier.id}>
                    <td>
                      <div className="item-info">
                        <Truck size={16} />
                        <strong>{courier.name}</strong>
                      </div>
                    </td>
                    <td><Badge variant="blue">{courier.contactPerson}</Badge></td>
                    <td><Badge variant="gray">{courier.phone}</Badge></td>
                    <td>
                      <Badge variant="cyan">{courier.serviceType || 'Standard'}</Badge>
                    </td>
                    <td><Badge variant="green">${(courier.pricing || 0).toFixed(2)}/kg</Badge></td>
                    <td>
                      <Badge variant="orange">
                        <Star size={14} fill="#92400e" color="#92400e" style={{ marginRight: '4px' }} />
                        {courier.rating || 0}
                      </Badge>
                    </td>
                    <td>
                      <StatusBadge status={courier.isActive ? 'Active' : 'Inactive'} />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon view"
                          onClick={() => handleView(courier)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon edit"
                          onClick={() => handleEdit(courier)}
                          title="Edit Courier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon delete"
                          onClick={() => handleDelete(courier.id)}
                          title="Delete Courier"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <Truck size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      No courier companies found
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first courier service'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, courier: null })}
        title="Courier Details"
        data={modalCourier}
        fields={courierFields}
      />
    </div>
  );
};

export default Couriers;