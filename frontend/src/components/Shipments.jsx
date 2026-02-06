import { useState, useEffect } from 'react';
import { Search, Package, TrendingUp, Clock, CheckCircle, Eye, MapPin, X, Truck, Navigation, CheckCircle2 } from 'lucide-react';
import { shipmentService } from '../services/courierService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
import '../styles/Products.css';
import '../styles/DynamicModal.css';

const Shipments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedShipment, setTrackedShipment] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingSteps, setTrackingSteps] = useState([]);

  const statusOptions = ['All', 'Pending', 'In Transit', 'Delivered'];

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const result = await shipmentService.getShipments();
      if (result.success) {
        setShipments(result.data || []);
      } else {
        console.error('Failed to fetch shipments:', result.error);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      (shipment.trackingNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.courierName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalShipments = shipments.length;
  const pendingShipments = shipments.filter(s => s.status === 'Pending').length;
  const inTransitShipments = shipments.filter(s => s.status === 'In Transit').length;
  const deliveredShipments = shipments.filter(s => s.status === 'Delivered').length;

  const handleViewShipment = (shipment) => {
    setSelectedShipment(shipment);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setShowModal(false);
  };

  const handleTrackOrder = () => {
    setShowTracker(true);
  };

  const handleTrackingSearch = () => {
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number');
      return;
    }
    
    setIsTracking(true);
    
    // Simulate tracking process
    setTimeout(() => {
      const found = shipments.find(s => s.trackingNumber === trackingNumber);
      if (found) {
        setTrackedShipment(found);
        // Generate dynamic tracking steps based on status
        const steps = generateTrackingSteps(found.status);
        setTrackingSteps(steps);
      } else {
        alert('Tracking number not found');
        setTrackedShipment(null);
        setTrackingSteps([]);
      }
      setIsTracking(false);
    }, 2000);
  };

  const generateTrackingSteps = (status) => {
    const allSteps = [
      { id: 1, title: 'Order Confirmed', desc: 'Your order has been confirmed', completed: true },
      { id: 2, title: 'Package Prepared', desc: 'Package is being prepared for shipment', completed: true },
      { id: 3, title: 'In Transit', desc: 'Package is on the way to destination', completed: status !== 'Pending' },
      { id: 4, title: 'Out for Delivery', desc: 'Package is out for final delivery', completed: status === 'Delivered' },
      { id: 5, title: 'Delivered', desc: 'Package has been delivered successfully', completed: status === 'Delivered' }
    ];
    return allSteps;
  };

  const closeTracker = () => {
    setShowTracker(false);
    setTrackingNumber('');
    setTrackedShipment(null);
    setTrackingSteps([]);
    setIsTracking(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1><Package size={20} style={{ marginRight: '8px' }} />Shipment Tracking</h1>
          <p>Track and manage all shipments in real-time</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleTrackOrder}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          <MapPin size={18} />
          Locate Order
        </button>
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
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading shipments...
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
                    <td><Badge variant="cyan">{shipment.estimatedDelivery}</Badge></td>
                    <td>
                      <StatusBadge status={shipment.status} />
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
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    {searchTerm || statusFilter !== 'All' ? 'No matching shipments found' : 'No shipments found. Create your first shipment from dispatch.'}
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
        title="Shipment Details"
        data={selectedShipment}
        fields={[
          { key: 'trackingNumber', label: 'Tracking Number' },
          { key: 'customerName', label: 'Customer' },
          { key: 'courierName', label: 'Courier' },
          { key: 'items', label: 'Items' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'shipmentDate', label: 'Shipment Date' },
          { key: 'estimatedDelivery', label: 'Estimated Delivery' },
          { key: 'status', label: 'Status' },
          { key: 'notes', label: 'Notes' }
        ]}
      />

      {showTracker && (
        <div className="modal-overlay" onClick={closeTracker}>
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              maxWidth: '500px',
              width: '90%'
            }}
          >
            <div className="modal-header" style={{ borderBottom: '2px solid #e2e8f0' }}>
              <div className="modal-title-section">
                <div 
                  className="modal-icon"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    padding: '8px'
                  }}
                >
                  <MapPin size={20} color="white" />
                </div>
                <h3 style={{ color: '#1e293b', fontWeight: '700' }}>Track Your Order</h3>
              </div>
              <button 
                className="btn-icon delete"
                onClick={closeTracker}
                style={{ background: 'transparent', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body" style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#374151'
                }}>Enter Tracking Number</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button
                    onClick={handleTrackingSearch}
                    disabled={isTracking}
                    style={{
                      background: isTracking ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: isTracking ? 'not-allowed' : 'pointer',
                      transition: 'transform 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseEnter={(e) => !isTracking && (e.target.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => !isTracking && (e.target.style.transform = 'scale(1)')}
                  >
                    {isTracking ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ffffff',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Locating...
                      </>
                    ) : (
                      <>
                        <Navigation size={16} />
                        Track
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {isTracking && (
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '2px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f59e0b',
                    borderTop: '4px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 12px'
                  }} />
                  <h4 style={{ color: '#92400e', marginBottom: '8px', fontWeight: '700' }}>Locating Your Package...</h4>
                  <p style={{ color: '#b45309', fontSize: '14px' }}>Searching through our tracking system</p>
                </div>
              )}
              
              {trackedShipment && !isTracking && (
                <>
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                      border: '2px solid #10b981',
                      borderRadius: '12px',
                      padding: '20px',
                      marginTop: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <CheckCircle2 size={24} color="#10b981" />
                      <h4 style={{ color: '#065f46', fontWeight: '700', margin: 0 }}>Package Located!</h4>
                    </div>
                    <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>Customer:</strong></span>
                        <span>{trackedShipment.customerName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>Courier:</strong></span>
                        <span>{trackedShipment.courierName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><strong>Status:</strong></span>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: trackedShipment.status === 'Delivered' ? '#10b981' : 
                                     trackedShipment.status === 'In Transit' ? '#f59e0b' : '#6b7280',
                          color: 'white'
                        }}>
                          {trackedShipment.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>Est. Delivery:</strong></span>
                        <span>{trackedShipment.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '16px'
                  }}>
                    <h4 style={{ color: '#1e293b', marginBottom: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={20} />
                      Tracking Timeline
                    </h4>
                    <div style={{ position: 'relative' }}>
                      {trackingSteps.map((step, index) => (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: index < trackingSteps.length - 1 ? '20px' : '0' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: step.completed ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            position: 'relative',
                            zIndex: 2
                          }}>
                            {step.completed && <CheckCircle2 size={14} color="white" />}
                          </div>
                          {index < trackingSteps.length - 1 && (
                            <div style={{
                              position: 'absolute',
                              left: '11px',
                              top: '24px',
                              width: '2px',
                              height: '20px',
                              background: step.completed ? '#10b981' : '#e5e7eb',
                              zIndex: 1
                            }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <h5 style={{ 
                              margin: '0 0 4px 0', 
                              color: step.completed ? '#065f46' : '#6b7280',
                              fontWeight: '600',
                              fontSize: '14px'
                            }}>
                              {step.title}
                            </h5>
                            <p style={{ 
                              margin: 0, 
                              color: step.completed ? '#047857' : '#9ca3af',
                              fontSize: '12px'
                            }}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Shipments;