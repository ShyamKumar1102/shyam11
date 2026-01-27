import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Mail, Phone, DollarSign, Star, MapPin } from 'lucide-react';
import { courierService } from '../services/courierService';

const AddCourier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    serviceAreas: '',
    pricing: '',
    rating: '0'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courierData = {
        ...formData,
        serviceAreas: formData.serviceAreas.split(',').map(area => area.trim()).filter(area => area),
        pricing: parseFloat(formData.pricing) || 0,
        rating: parseFloat(formData.rating) || 0
      };

      await courierService.createCourier(courierData);
      alert('Courier added successfully!');
      navigate('/dashboard/couriers');
    } catch (err) {
      console.error(err);
      alert('Failed to create courier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/couriers')}>
          <ArrowLeft size={20} />
          Back to Couriers
        </button>
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <Truck size={20} color="#fff" />
            </span>
            Add New Courier
          </h1>
          <p>Register a new courier company</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Truck size={20} />Courier Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Courier Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., FedEx, DHL, UPS"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="contact@courier.com"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contact">Contact Number *</label>
                  <div className="input-with-icon">
                    <Phone size={18} />
                    <input
                      type="tel"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      placeholder="+1234567890"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><DollarSign size={20} />Pricing & Rating</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pricing">Base Pricing ($) *</label>
                  <input
                    type="number"
                    id="pricing"
                    name="pricing"
                    value={formData.pricing}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="10.00"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rating">Rating (0-5)</label>
                  <div className="input-with-icon">
                    <Star size={18} />
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><MapPin size={20} />Service Coverage</h4>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="serviceAreas">Service Areas (comma-separated)</label>
                  <input
                    type="text"
                    id="serviceAreas"
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleChange}
                    placeholder="New York, Los Angeles, Chicago, Houston"
                  />
                  <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Enter cities or regions separated by commas
                  </small>
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
              {loading ? 'Saving...' : 'Save Courier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourier;
