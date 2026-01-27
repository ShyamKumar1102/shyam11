import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, Truck, User, Phone, MapPin, Calendar } from 'lucide-react';
import { shipmentService, courierService } from '../services/courierService';

const CreateShipment = () => {
  const navigate = useNavigate();
  const [couriers, setCouriers] = useState([]);
  const [formData, setFormData] = useState({
    orderId: '',
    courierId: '',
    courierName: '',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    estimatedDelivery: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      const data = await courierService.getAllCouriers();
      setCouriers(data.filter(c => c.isActive));
    } catch (err) {
      console.error('Failed to fetch couriers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'courierId') {
      const selectedCourier = couriers.find(c => c.id === value);
      setFormData({
        ...formData,
        courierId: value,
        courierName: selectedCourier?.name || ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await shipmentService.createShipment(formData);
      alert('Shipment created successfully!');
      navigate('/dashboard/shipments');
    } catch (err) {
      console.error(err);
      alert('Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/shipments')}>
          <ArrowLeft size={20} />
          Back to Shipments
        </button>
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <Package size={20} color="#fff" />
            </span>
            Create New Shipment
          </h1>
          <p>Create a new shipment for order delivery</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Package size={20} />Order Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="orderId">Order ID *</label>
                  <input
                    type="text"
                    id="orderId"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    required
                    placeholder="e.g., ORD123456"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="courierId">Select Courier *</label>
                  <div className="input-with-icon">
                    <Truck size={18} />
                    <select
                      id="courierId"
                      name="courierId"
                      value={formData.courierId}
                      onChange={handleChange}
                      required
                      style={{ paddingLeft: '2.5rem' }}
                    >
                      <option value="">-- Select Courier --</option>
                      {couriers.map(courier => (
                        <option key={courier.id} value={courier.id}>
                          {courier.name} (${courier.pricing})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="estimatedDelivery">Estimated Delivery</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input
                      type="date"
                      id="estimatedDelivery"
                      name="estimatedDelivery"
                      value={formData.estimatedDelivery}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><User size={20} />Customer Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="customerPhone">Customer Phone *</label>
                  <div className="input-with-icon">
                    <Phone size={18} />
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
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
              <h4><MapPin size={20} />Delivery Address</h4>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="customerAddress">Full Delivery Address *</label>
                  <textarea
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Enter complete delivery address with street, city, state, and zip code"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/shipments')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;
