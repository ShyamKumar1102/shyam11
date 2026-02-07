import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Mail, Phone, MapPin, Building, ToggleLeft } from 'lucide-react';
import { supplierService } from '../services/userService';
import { generateSupplierId } from '../utils/idGenerator';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';
import '../styles/ToggleButton.css';

const AddSupplier = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supplierData = {
        supplierId: generateSupplierId(),
        ...formData
      };
      
      console.log('Submitting supplier data:', supplierData);
      const result = await supplierService.createSupplier(supplierData);
      console.log('Result:', result);
      
      if (result.success) {
        showSuccessMessage('Supplier added successfully!');
        setTimeout(() => {
          navigate('/dashboard/users/suppliers');
        }, 2000);
      } else {
        console.error('Error from API:', result.error);
        showErrorMessage(result.error || 'Failed to add supplier');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      showErrorMessage('Failed to add supplier: ' + (error.message || 'Unknown error'));
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
          <button className="btn-back" onClick={() => navigate('/dashboard/users/suppliers')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1>Add New Supplier</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <Truck size={24} />
          </div>
          <div>
            <h2>Supplier Information</h2>
            <p>Add a new supplier to your network</p>
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
                  <label htmlFor="name">Supplier Name *</label>
                  <div className="input-with-icon">
                    <Truck size={18} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter supplier name"
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
                Address & Status
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
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Supplier Status</label>
                  <div className="toggle-wrapper">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={formData.status === 'active'}
                        onChange={(e) => setFormData({...formData, status: e.target.checked ? 'active' : 'inactive'})}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className={`toggle-status ${formData.status === 'active' ? 'active' : 'inactive'}`}>
                      {formData.status === 'active' ? 'Active' : 'Inactive'}
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
              onClick={() => navigate('/dashboard/users/suppliers')}
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
              {loading ? 'Adding Supplier...' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
