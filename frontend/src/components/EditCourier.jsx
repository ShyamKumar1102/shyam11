import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Truck } from 'lucide-react';
import { courierService } from '../services/courierService';
import '../styles/Products.css';
import '../styles/ToggleButton.css';

const EditCourier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courier = location.state?.courier;

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    serviceType: 'Standard',
    pricing: '',
    rating: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courier) {
      setFormData({
        name: courier.name || '',
        contactPerson: courier.contactPerson || '',
        phone: courier.phone || '',
        email: courier.email || '',
        address: courier.address || '',
        serviceType: courier.serviceType || 'Standard',
        pricing: courier.pricing || '',
        rating: courier.rating || '',
        isActive: courier.isActive !== undefined ? courier.isActive : true
      });
    } else {
      navigate('/dashboard/couriers');
    }
  }, [courier, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await courierService.updateCourier(courier.id, {
        ...formData,
        pricing: parseFloat(formData.pricing) || 0,
        rating: parseFloat(formData.rating) || 0
      });

      if (result.success) {
        alert('Courier updated successfully!');
        navigate('/dashboard/couriers');
      } else {
        alert(result.error || 'Failed to update courier');
      }
    } catch (error) {
      console.error('Error updating courier:', error);
      alert('Failed to update courier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard/couriers')}
        >
          <ArrowLeft size={20} />
          Back to Couriers
        </button>
        <div className="page-title">
          <h1>✏️ Edit Courier</h1>
          <p>Update courier company information</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3>
              <Truck size={20} />
              Company Information
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Company Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter company name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person *</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Service Details</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="serviceType">Service Type</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Overnight">Overnight</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pricing">Pricing (per kg)</label>
                <input
                  type="number"
                  id="pricing"
                  name="pricing"
                  value={formData.pricing}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0.0"
                />
              </div>

              <div className="form-group">
                <label>Active Service</label>
                <div className="toggle-wrapper">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className={`toggle-status ${formData.isActive ? 'active' : 'inactive'}`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard/couriers')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={20} />
              {loading ? 'Updating...' : 'Update Courier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourier;