import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { supplierService } from '../services/userService';
import '../styles/ToggleButton.css';

const EditSupplier = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    status: 'active'
  });

  useEffect(() => {
    if (location.state?.supplier) {
      const supplier = location.state.supplier;
      setFormData({
        supplierId: supplier.supplierId || supplier.id,
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        company: supplier.company || '',
        status: supplier.status || 'active'
      });
    } else {
      navigate('/dashboard/users/suppliers');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { supplierId, ...supplierData } = formData;
      const result = await supplierService.updateSupplier(supplierId, supplierData);
      
      if (result.success) {
        alert('Supplier updated successfully!');
        navigate('/dashboard/users/suppliers');
      } else {
        alert(result.error || 'Failed to update supplier');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('Failed to update supplier');
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
              <Truck size={20} color="#fff" />
            </span>
            Edit Supplier
          </h1>
          <p>Update supplier information</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Truck size={20} />Supplier Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="supplierId">Supplier ID</label>
                  <input
                    type="text"
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    disabled
                    style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                </div>
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
              </div>
              <div className="form-row">
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
              <h4><MapPin size={20} />Address & Status</h4>
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
                <div className="form-group">
                  <label>Supplier Status</label>
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

export default EditSupplier;
