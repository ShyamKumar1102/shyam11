import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, Search, CheckCircle, Calendar, Truck, User } from 'lucide-react';
import { shipmentService } from '../services/courierService';
import '../styles/Products.css';

const ShipmentHistory = () => {
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveredShipments();
  }, []);

  const fetchDeliveredShipments = async () => {
    try {
      setLoading(true);
      const data = await shipmentService.getAllShipments();
      // Filter only delivered shipments
      const deliveredShipments = data.filter(s => s.status === 'Delivered');
      setShipments(deliveredShipments);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch shipment history');
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.courierName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalDelivered = shipments.length;
  const thisMonth = shipments.filter(s => {
    const deliveryDate = new Date(s.deliveryDate);
    const now = new Date();
    return deliveryDate.getMonth() === now.getMonth() && deliveryDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) return <div className="loading">Loading shipment history...</div>;

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
            <p className="stat-value">3 days</p>
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
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    {searchTerm ? 'No matching shipments found' : 'No delivered shipments yet'}
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const shipDate = new Date(shipment.shipmentDate);
                  const deliveryDate = new Date(shipment.deliveryDate);
                  const duration = Math.ceil((deliveryDate - shipDate) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={shipment.id}>
                      <td>
                        <div className="item-info">
                          <Package size={16} />
                          <span><strong>{shipment.trackingNumber}</strong></span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} color="#6b7280" />
                          {shipment.customerName}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Truck size={14} color="#6b7280" />
                          {shipment.courierName}
                        </div>
                      </td>
                      <td>
                        <span className="stock-badge high">
                          {shipment.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} units
                        </span>
                      </td>
                      <td>{shipment.shipmentDate}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#059669" />
                          <strong>{shipment.deliveryDate}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="stock-badge medium">
                          {duration} {duration === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="status-badge success"
                          style={{ 
                            backgroundColor: '#10b981', 
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          ✓ Delivered
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-icon view" 
                          onClick={() => navigate(`/dashboard/shipments/view/${shipment.id}`)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShipmentHistory;
