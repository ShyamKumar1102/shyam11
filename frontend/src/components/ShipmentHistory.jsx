import { useState, useEffect } from 'react';
import { Search, CheckCircle, Calendar, Truck, User, Package, Eye } from 'lucide-react';
import { shipmentService } from '../services/courierService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
import '../styles/Products.css';
import '../styles/DynamicModal.css';

const ShipmentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const result = await shipmentService.getShipments();
      if (result.success) {
        const deliveredShipments = (result.data || []).filter(s => s.status === 'Delivered');
        setShipments(deliveredShipments);
      } else {
        console.error('Failed to fetch shipments:', result.error);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    (shipment.trackingNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shipment.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shipment.courierName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDelivered = shipments.length;
  const thisMonth = shipments.filter(s => {
    const shipmentDate = new Date(s.deliveryDate || s.shipmentDate);
    const now = new Date();
    return shipmentDate.getMonth() === now.getMonth() && shipmentDate.getFullYear() === now.getFullYear();
  }).length;

  const avgDeliveryTime = shipments.length > 0 ? 
    Math.round(shipments.reduce((sum, s) => {
      const shipDate = new Date(s.shipmentDate);
      const deliveryDate = new Date(s.deliveryDate || s.shipmentDate);
      return sum + Math.abs(deliveryDate - shipDate) / (1000 * 60 * 60 * 24);
    }, 0) / shipments.length) : 0;

  const handleViewShipment = (shipment) => {
    setSelectedShipment(shipment);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📦 Shipment History</h1>
          <p>View all completed and delivered shipments</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <CheckCircle size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Total Delivered</h3>
            <p className="stat-value">{totalDelivered}</p>
            <span className="stat-label">All time deliveries</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <Calendar size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p className="stat-value">{thisMonth}</p>
            <span className="stat-label">Delivered this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Truck size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Avg Delivery Time</h3>
            <p className="stat-value">{avgDeliveryTime} days</p>
            <span className="stat-label">Average duration</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Success Rate</h3>
            <p className="stat-value">100%</p>
            <span className="stat-label">Delivery success</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Delivered Shipments</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by tracking number, customer, or courier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Customer</th>
                <th>Courier</th>
                <th>Items/Quantity</th>
                <th>Shipment Date</th>
                <th>Delivery Date</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading shipment history...
                  </td>
                </tr>
              ) : filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td><Badge variant="blue">{shipment.trackingNumber}</Badge></td>
                    <td><Badge variant="gray">{shipment.customerName}</Badge></td>
                    <td><Badge variant="teal">{shipment.courierName}</Badge></td>
                    <td><Badge variant="purple">{Array.isArray(shipment.items) ? shipment.items.length : (shipment.items || 'N/A')}/{shipment.quantity || 0}</Badge></td>
                    <td><Badge variant="cyan">{shipment.shipmentDate}</Badge></td>
                    <td><Badge variant="cyan">{shipment.deliveryDate || shipment.estimatedDelivery}</Badge></td>
                    <td>
                      <Badge variant="gray">
                        {shipment.deliveryDate && shipment.shipmentDate ? 
                          `${Math.abs(new Date(shipment.deliveryDate) - new Date(shipment.shipmentDate)) / (1000 * 60 * 60 * 24)} days` : 
                          'N/A'
                        }
                      </Badge>
                    </td>
                    <td>
                      <StatusBadge status="Delivered" />
                    </td>
                    <td>
                      <button 
                        className="btn-icon view"
                        onClick={() => handleViewShipment(shipment)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    {searchTerm ? 'No matching delivered shipments found' : 'No delivered shipments yet. Complete some shipments to see history.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ViewModal
        isOpen={showModal}
        onClose={closeModal}
        title="Shipment History Details"
        data={selectedShipment}
        fields={[
          { key: 'trackingNumber', label: 'Tracking Number' },
          { key: 'customerName', label: 'Customer' },
          { key: 'courierName', label: 'Courier' },
          { key: 'items', label: 'Items' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'shipmentDate', label: 'Shipment Date' },
          { key: 'deliveryDate', label: 'Delivery Date' },
          { key: 'status', label: 'Status' },
          { key: 'notes', label: 'Notes' }
        ]}
      />
    </div>
  );
};

export default ShipmentHistory;