import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Phone, MapPin, Star } from 'lucide-react';

const AddCourier = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    serviceType: '',
    pricing: '',
    rating: '5',
    isActive: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement courier service API call
      console.log('Adding courier:', formData);
      alert('Courier added successfully!');
      navigate('/dashboard/couriers');
    } catch (error) {
      console.error('Error adding courier:', error);
      alert('Failed to add courier');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/couriers')}>
          <ArrowLeft size={20} />
          Back to Couriers
        </button>
        <div className="page-title">
          <h1>Add New Courier</h1>
          <p>Add a new courier service provider</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Truck size={20} />Company Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Company Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    required
                    placeholder="Enter contact person name"
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
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Service Type</option>
                    <option value="Express">Express Delivery</option>
                    <option value="Standard">Standard Delivery</option>
                    <option value="Economy">Economy Delivery</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="pricing">Pricing (per kg) *</label>
                  <input
                    type="number"
                    id="pricing"
                    name="pricing"
                    value={formData.pricing}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter price per kg"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Phone size={20} />Contact Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter complete address"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Star size={20} />Service Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rating">Rating (1-5) *</label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="isActive">Status *</label>
                  <select
                    id="isActive"
                    name="isActive"
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
              <Save size={18} />
              {loading ? 'Saving...' : 'Add Courier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourier;