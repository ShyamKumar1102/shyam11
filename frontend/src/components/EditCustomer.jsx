import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, UserCog, Building } from 'lucide-react';
import { customerService } from '../services/userService';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';

const EditCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  useEffect(() => {
    if (location.state?.customer) {
      const customer = location.state.customer;
      setFormData({
        customerId: customer.customerId || customer.id,
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        company: customer.company || ''
      });
    } else {
      navigate('/dashboard/users/customers');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { customerId, ...customerData } = formData;
      const result = await customerService.updateCustomer(customerId, customerData);
      
      if (result.success) {
        showSuccessMessage('Customer updated successfully!');
        setTimeout(() => {
          navigate('/dashboard/users/customers');
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      showErrorMessage('Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard/users/customers')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1>Edit Customer</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <UserCog size={24} />
          </div>
          <div>
            <h2>Update Customer Information</h2>
            <p>Modify customer details in your database</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4>
                <User size={20} />
                Personal Information
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerId">Customer ID</label>
                  <input
                    type="text"
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    disabled
                    className="barcode-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Customer Name *</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter customer name"
                      className={formData.name ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <div className="input-with-icon">
                    <Building size={18} />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      className={formData.company ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <Phone size={20} />
                Contact Details
              </h4>
              <div className="form-row">
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
                      placeholder="Enter email address"
                      className={formData.email ? 'filled' : ''}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <div className="input-with-icon">
                    <Phone size={18} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className={formData.phone ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <MapPin size={20} />
                Address Information
              </h4>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="address">Address</label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      rows="3"
                      className={formData.address ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/users/customers')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !formData.name || !formData.email || !formData.phone}
            >
              <Save size={18} />
              {loading ? 'Updating...' : 'Update Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
