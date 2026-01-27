import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, Phone, Calendar } from 'lucide-react';
import { shipmentService } from '../services/courierService';
import '../styles/Common.css';

const ShipmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShipment();
  }, [id]);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      const data = await shipmentService.getShipment(id);
      setShipment(data);
    } catch (err) {
      setError('Failed to fetch shipment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading shipment details...</div>;
  if (!shipment) return <div className="error-message">Shipment not found</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/dashboard/shipments')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Shipment Details</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="details-container">
        <div className="details-card">
          <h3>Tracking Information</h3>
          <div className="detail-row">
            <Package size={20} />
            <div>
              <strong>Tracking Number:</strong>
              <p>{shipment.trackingNumber}</p>
            </div>
          </div>
          <div className="detail-row">
            <Truck size={20} />
            <div>
              <strong>Courier:</strong>
              <p>{shipment.courierName}</p>
            </div>
          </div>
          <div className="detail-row">
            <Calendar size={20} />
            <div>
              <strong>Shipment Date:</strong>
              <p>{shipment.shipmentDate}</p>
            </div>
          </div>
          {shipment.estimatedDelivery && (
            <div className="detail-row">
              <Calendar size={20} />
              <div>
                <strong>Estimated Delivery:</strong>
                <p>{shipment.estimatedDelivery}</p>
              </div>
            </div>
          )}
        </div>

        <div className="details-card">
          <h3>Customer Information</h3>
          <div className="detail-row">
            <strong>Name:</strong>
            <p>{shipment.customerName}</p>
          </div>
          <div className="detail-row">
            <Phone size={20} />
            <div>
              <strong>Phone:</strong>
              <p>{shipment.customerPhone}</p>
            </div>
          </div>
          <div className="detail-row">
            <MapPin size={20} />
            <div>
              <strong>Delivery Address:</strong>
              <p>{shipment.customerAddress}</p>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h3>Status Information</h3>
          <div className="status-timeline">
            <p><strong>Current Status:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{shipment.status}</span></p>
            {shipment.pickupDate && <p>Picked up on: {shipment.pickupDate}</p>}
            {shipment.deliveryDate && <p>Delivered on: {shipment.deliveryDate}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
