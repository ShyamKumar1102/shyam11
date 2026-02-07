import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, UserPlus, Building } from 'lucide-react';
import { customerService } from '../services/userService';
import { generateCustomerId } from '../utils/idGenerator';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const customerData = {
        customerId: generateCustomerId(),
        ...formData
      };
      
      const result = await customerService.createCustomer(customerData);
      
      if (result.success) {
        showSuccessMessage('Customer added successfully!');
        setTimeout(() => {
          navigate('/dashboard/users/customers');
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      showErrorMessage('Failed to add customer');
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
          <h1>Add New Customer</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <UserPlus size={24} />
          </div>
          <div>
            <h2>Customer Information</h2>
            <p>Add a new customer to your database</p>
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
              {loading ? 'Adding Customer...' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
