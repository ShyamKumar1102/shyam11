import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Phone, Mail, MapPin, Star, Settings } from 'lucide-react';
import { courierService } from '../services/courierService';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';
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
        showSuccessMessage('Courier updated successfully!');
        setTimeout(() => {
          navigate('/dashboard/couriers');
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Failed to update courier');
      }
    } catch (error) {
      console.error('Error updating courier:', error);
      showErrorMessage('Failed to update courier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard/couriers')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1>Edit Courier</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <Settings size={24} />
          </div>
          <div>
            <h2>Update Courier Information</h2>
            <p>Modify courier service provider details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4>
                <Truck size={20} />
                Company Information
              </h4>
              <div className="form-row">
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
                    className={formData.name ? 'filled' : ''}
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
                    className={formData.contactPerson ? 'filled' : ''}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceType">Service Type *</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="enhanced-select"
                  >
                    <option value="Express">Express Delivery</option>
                    <option value="Standard">Standard Delivery</option>
                    <option value="Economy">Economy Delivery</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="pricing">Pricing (per kg) *</label>
                  <div className="input-with-icon">
                    <span style={{ position: 'absolute', left: '0.875rem', color: '#9ca3af', zIndex: 1 }}>$</span>
                    <input
                      type="number"
                      id="pricing"
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={formData.pricing ? 'filled' : ''}
                      style={{ paddingLeft: '2.75rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <Phone size={20} />
                Contact Information
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <div className="input-with-icon">
                    <Phone size={18} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter phone number"
                      className={formData.phone ? 'filled' : ''}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className={formData.email ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="address">Address *</label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter complete address"
                      rows="3"
                      className={formData.address ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <Star size={20} />
                Service Details
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rating">Rating (1-5) *</label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                    className="enhanced-select"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="isActive">Status</label>
                  <div className="toggle-wrapper">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
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
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/couriers')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !formData.name || !formData.contactPerson || !formData.phone || !formData.address || !formData.serviceType || !formData.pricing}
            >
              <Save size={18} />
              {loading ? 'Updating...' : 'Update Courier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourier;