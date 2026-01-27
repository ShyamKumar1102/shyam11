import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Mail, Phone, MapPin, TruckIcon } from 'lucide-react';
import { supplierService } from '../services/userService';

const AddSupplier = () => {
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
      console.log('Submitting supplier data:', formData);
      const result = await supplierService.createSupplier(formData);
      console.log('Result:', result);
      
      if (result.success) {
        alert('Supplier added successfully!');
        navigate('/dashboard/users/suppliers');
      } else {
        console.error('Error from API:', result.error);
        alert(result.error || 'Failed to add supplier');
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier: ' + (error.message || 'Unknown error'));
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
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/users/suppliers')}>
          <ArrowLeft size={20} />
          Back to Suppliers
        </button>
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <TruckIcon size={20} color="#fff" />
            </span>
            Add New Supplier
          </h1>
          <p>Add supplier to your database</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Truck size={20} />Supplier Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Supplier Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Mail size={20} />Contact Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
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
              </div>
            </div>

            <div className="form-section">
              <h4><MapPin size={20} />Address</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/users/suppliers')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
