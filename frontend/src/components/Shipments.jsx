import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, Search, TrendingUp, Clock, CheckCircle, Truck, X, Edit } from 'lucide-react';
import { shipmentService } from '../services/courierService';
import '../styles/Products.css';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const statusOptions = ['All', 'Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const data = await shipmentService.getAllShipments();
      setShipments(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === selectedShipment.status) {
      setShowStatusModal(false);
      return;
    }

    setUpdating(true);
    try {
      const statusData = { status: newStatus };
      
      if (newStatus === 'Picked Up' && !selectedShipment.pickupDate) {
        statusData.pickupDate = new Date().toISOString().split('T')[0];
      }
      
      if (newStatus === 'Delivered' && !selectedShipment.deliveryDate) {
        statusData.deliveryDate = new Date().toISOString().split('T')[0];
      }

      await shipmentService.updateShipmentStatus(selectedShipment.id, statusData);
      await fetchShipments();
      setShowStatusModal(false);
      alert('Status updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.courierName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'Picked Up': '#3b82f6',
      'In Transit': '#8b5cf6',
      'Out for Delivery': '#06b6d4',
      'Delivered': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const totalShipments = shipments.length;
  const pendingShipments = shipments.filter(s => s.status === 'Pending').length;
  const inTransitShipments = shipments.filter(s => s.status === 'In Transit' || s.status === 'Out for Delivery').length;
  const deliveredShipments = shipments.filter(s => s.status === 'Delivered').length;

  if (loading) return <div className="loading">Loading shipments...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📦 Shipment Tracking</h1>
          <p>Track and manage all shipments in real-time</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Shipments</h3>
            <p className="stat-value">{totalShipments}</p>
            <span className="stat-label">All shipments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{pendingShipments}</p>
            <span className="stat-label">Awaiting pickup</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <TrendingUp size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>In Transit</h3>
            <p className="stat-value">{inTransitShipments}</p>
            <span className="stat-label">On the way</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <CheckCircle size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Delivered</h3>
            <p className="stat-value">{deliveredShipments}</p>
            <span className="stat-label">Successfully delivered</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Shipment List</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
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
                <th>Est. Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No shipments found</td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <div className="item-info">
                        <Package size={16} />
                        <span><strong>{shipment.trackingNumber}</strong></span>
                      </div>
                    </td>
                    <td>{shipment.customerName}</td>
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
                    <td>{shipment.estimatedDelivery || 'N/A'}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(shipment.status), 
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => openStatusModal(shipment)}
                          title="Update Status"
                          style={{ background: '#3b82f6', color: 'white' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon view" 
                          onClick={() => navigate(`/dashboard/shipments/view/${shipment.id}`)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showStatusModal && selectedShipment && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Update Shipment Status</h2>
              <button className="close-btn" onClick={() => setShowStatusModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <strong>Tracking Number:</strong> {selectedShipment.trackingNumber}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Customer:</strong> {selectedShipment.customerName}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Current Status:</strong> 
                <span style={{ 
                  marginLeft: '8px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: getStatusColor(selectedShipment.status),
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {selectedShipment.status}
                </span>
              </div>
              
              <div className="form-group">
                <label>New Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px', 
                    fontSize: '0.875rem' 
                  }}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowStatusModal(false)}
                disabled={updating}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === selectedShipment.status}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments;
