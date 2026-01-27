import { useState, useEffect } from 'react';
import { TrendingUp, Search, Package, X, Calendar, User, FileText, Box, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import { dispatchService } from '../services/dispatchService';
import { invoiceService } from '../services/billingService';
import { customerService } from '../services/customerService';
import { stockService } from '../services/productService';
import { courierService, shipmentService } from '../services/courierService';
import '../styles/DispatchStock.css';

const DispatchStock = () => {
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [formData, setFormData] = useState({
    dispatchQuantity: '',
    invoiceId: '',
    customerId: '',
    customerName: '',
    notes: '',
    courierId: '',
    courierName: '',
    customerPhone: '',
    customerAddress: '',
    estimatedDelivery: ''
  });
  const [errors, setErrors] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    fetchStockData();
    fetchInvoices();
    fetchCustomers();
    fetchCouriers();
  }, []);

  const fetchInvoices = async () => {
    try {
      const result = await invoiceService.getInvoices();
      if (result.success) {
        console.log('Invoices fetched:', result.data);
        setInvoices(result.data || []);
      } else {
        console.error('Failed to fetch invoices:', result.error);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const result = await customerService.getAllCustomers();
      if (result.success) {
        console.log('Customers fetched:', result.data);
        setCustomers(result.data || []);
      } else {
        console.error('Failed to fetch customers:', result.error);
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchCouriers = async () => {
    try {
      const data = await courierService.getAllCouriers();
      setCouriers(data.filter(c => c.isActive) || []);
    } catch (error) {
      console.error('Error fetching couriers:', error);
      setCouriers([]);
    }
  };

  const fetchStockData = async () => {
    try {
      const result = await stockService.getStock();
      if (result.success) {
        const formattedStock = result.data.map(item => ({
          id: item.id,
          itemName: item.itemName || item.productName || 'Unknown',
          availableQuantity: item.quantity || 0,
          location: item.location || 'N/A',
          lastUpdated: new Date().toISOString().split('T')[0],
          status: (item.quantity || 0) < 20 ? 'Low Stock' : 'Available'
        }));
        setStockData(formattedStock);
      } else {
        console.error('Failed to fetch stock:', result.error);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDispatchModal = (stock) => {
    setSelectedStock(stock);
    setFormData({
      dispatchQuantity: '',
      invoiceId: '',
      customerId: '',
      customerName: '',
      notes: '',
      courierId: '',
      courierName: '',
      customerPhone: '',
      customerAddress: '',
      estimatedDelivery: ''
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setFormData({
      dispatchQuantity: '',
      invoiceId: '',
      customerId: '',
      customerName: '',
      notes: '',
      courierId: '',
      courierName: '',
      customerPhone: '',
      customerAddress: '',
      estimatedDelivery: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dispatchQuantity || formData.dispatchQuantity <= 0) {
      newErrors.dispatchQuantity = 'Please enter a valid quantity';
    }
    if (formData.dispatchQuantity > selectedStock?.availableQuantity) {
      newErrors.dispatchQuantity = 'Quantity exceeds available stock';
    }
    if (!formData.invoiceId.trim()) {
      newErrors.invoiceId = 'Invoice ID is required';
    }
    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.courierId) {
      newErrors.courierId = 'Please select a courier';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Customer phone is required';
    }
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Delivery address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => (c.customerId || c.id) === customerId);
    if (customer) {
      setFormData({
        ...formData,
        customerId: customerId,
        customerName: customer.name || '',
        customerPhone: customer.phone || '',
        customerAddress: customer.address || ''
      });
    }
  };

  const handleInvoiceChange = (invoiceId) => {
    const invoice = invoices.find(inv => (inv.invoiceId || inv.id) === invoiceId);
    if (invoice) {
      const customer = customers.find(c => (c.customerId || c.id) === invoice.customerId);
      setFormData({
        ...formData,
        invoiceId: invoiceId,
        customerId: invoice.customerId || '',
        customerName: invoice.customerName || '',
        customerPhone: customer?.phone || '',
        customerAddress: customer?.address || ''
      });
    }
  };

  const handleCourierChange = (courierId) => {
    const courier = couriers.find(c => c.id === courierId);
    if (courier) {
      setFormData({
        ...formData,
        courierId: courierId,
        courierName: courier.name || ''
      });
    }
  };

  const handleSubmitDispatch = async () => {
    if (!validateForm()) return;

    try {
      // First create shipment
      const shipmentData = {
        orderId: formData.invoiceId,
        courierId: formData.courierId,
        courierName: formData.courierName,
        customerName: formData.customerName,
        customerAddress: formData.customerAddress,
        customerPhone: formData.customerPhone,
        estimatedDelivery: formData.estimatedDelivery || null,
        items: [{
          itemName: selectedStock.itemName,
          quantity: formData.dispatchQuantity
        }]
      };

      const shipmentResult = await shipmentService.createShipment(shipmentData);
      
      if (shipmentResult) {
        // Then create dispatch record with shipmentId
        const dispatchData = {
          stockId: selectedStock.id,
          itemName: selectedStock.itemName,
          dispatchedQuantity: formData.dispatchQuantity,
          invoiceId: formData.invoiceId,
          customerId: formData.customerId,
          customerName: formData.customerName,
          notes: formData.notes,
          shipmentId: shipmentResult.id
        };

        const dispatchResult = await dispatchService.createDispatch(dispatchData);
        
        if (dispatchResult.success) {
          // Update stock quantity in database
          const newQuantity = selectedStock.availableQuantity - parseInt(formData.dispatchQuantity);
          const stockUpdateResult = await stockService.updateStock(selectedStock.id, {
            quantity: newQuantity
          });

          if (stockUpdateResult.success) {
            // Update local state
            const updatedStock = stockData.map(item => {
              if (item.id === selectedStock.id) {
                return { 
                  ...item, 
                  availableQuantity: newQuantity,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  status: newQuantity < 20 ? 'Low Stock' : 'Available'
                };
              }
              return item;
            });
            setStockData(updatedStock);
            alert(`Stock dispatched successfully!\nTracking Number: ${shipmentResult.trackingNumber}\nCourier: ${shipmentResult.courierName}`);
            closeModal();
          } else {
            alert('Dispatch and shipment created but failed to update stock quantity');
          }
        } else {
          alert('Shipment created but failed to create dispatch record');
        }
      } else {
        alert('Failed to create shipment');
      }
    } catch (error) {
      console.error('Error dispatching stock:', error);
      alert('Failed to dispatch stock');
    }
  };

  const filteredStock = stockData.filter(item =>
    (item.itemName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading stock data...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <TrendingUp size={20} color="#fff" />
            </span>
            Dispatch Management
          </h1>
          <p>Manage stock dispatching and outbound inventory operations</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Stock Items</h3>
            <p className="stat-value">{stockData.length}</p>
            <span className="stat-label">Available for dispatch</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <CheckCircle size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Ready to Dispatch</h3>
            <p className="stat-value">{stockData.filter(s => s.availableQuantity >= 20).length}</p>
            <span className="stat-label">Sufficient stock</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <p className="stat-value">{stockData.filter(s => s.availableQuantity < 20).length}</p>
            <span className="stat-label">Items below threshold</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Available Stock for Dispatch</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by stock ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Item Name</th>
                <th>Available Quantity</th>
                <th>Location</th>
                <th>Last Updated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.length > 0 ? (
                filteredStock.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td>
                      <div className="item-info">
                        <Package size={16} />
                        <span>{item.itemName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`stock-badge ${item.availableQuantity < 20 ? 'low' : item.availableQuantity < 50 ? 'medium' : 'high'}`}>
                        {item.availableQuantity} units
                      </span>
                    </td>
                    <td>{item.location || 'N/A'}</td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {item.lastUpdated}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${item.status === 'Low Stock' ? 'warning' : 'success'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => openDispatchModal(item)}
                        disabled={item.availableQuantity === 0}
                        title="Dispatch Stock"
                      >
                        <TrendingUp size={16} />
                        Dispatch
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No stock items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedStock && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dispatch Stock</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="stock-info-card">
                <div className="info-row">
                  <Box size={18} />
                  <div>
                    <span className="label">Stock Item:</span>
                    <span className="value">{selectedStock.itemName}</span>
                  </div>
                </div>
                <div className="info-row">
                  <Package size={18} />
                  <div>
                    <span className="label">Stock ID:</span>
                    <span className="value">{selectedStock.id}</span>
                  </div>
                </div>
                <div className="info-row">
                  <CheckCircle size={18} />
                  <div>
                    <span className="label">Available Quantity:</span>
                    <span className="value highlight">{selectedStock.availableQuantity} units</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Dispatch Quantity *</label>
                <input
                  type="number"
                  placeholder="Enter quantity to dispatch"
                  value={formData.dispatchQuantity}
                  onChange={(e) => setFormData({...formData, dispatchQuantity: e.target.value})}
                  className={errors.dispatchQuantity ? 'error' : ''}
                  min="1"
                  max={selectedStock.availableQuantity}
                />
                {errors.dispatchQuantity && <span className="error-text">{errors.dispatchQuantity}</span>}
              </div>

              <div className="form-group">
                <label>Invoice ID *</label>
                <select
                  value={formData.invoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className={errors.invoiceId ? 'error' : ''}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                >
                  <option value="">Select Invoice</option>
                  {invoices.length === 0 ? (
                    <option disabled>No invoices available - Create invoice first</option>
                  ) : (
                    invoices.map((invoice) => (
                      <option key={invoice.invoiceId || invoice.id} value={invoice.invoiceId || invoice.id}>
                        {invoice.invoiceId || invoice.id} - {invoice.customerName || 'N/A'}
                      </option>
                    ))
                  )}
                </select>
                {errors.invoiceId && <span className="error-text">{errors.invoiceId}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Customer ID *</label>
                  <input
                    type="text"
                    placeholder="Auto-filled from invoice"
                    value={formData.customerId}
                    readOnly
                    style={{ background: '#f3f4f6' }}
                  />
                  {errors.customerId && <span className="error-text">{errors.customerId}</span>}
                </div>

                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    placeholder="Auto-filled from invoice"
                    value={formData.customerName}
                    readOnly
                    style={{ background: '#f3f4f6' }}
                  />
                  {errors.customerName && <span className="error-text">{errors.customerName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label><Truck size={16} style={{ display: 'inline', marginRight: '6px' }} />Select Courier *</label>
                <select
                  value={formData.courierId}
                  onChange={(e) => handleCourierChange(e.target.value)}
                  className={errors.courierId ? 'error' : ''}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                >
                  <option value="">-- Select Courier Company --</option>
                  {couriers.length === 0 ? (
                    <option disabled>No active couriers - Add courier first</option>
                  ) : (
                    couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.name} - ${courier.pricing} (⭐ {courier.rating})
                      </option>
                    ))
                  )}
                </select>
                {errors.courierId && <span className="error-text">{errors.courierId}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Customer Phone *</label>
                  <input
                    type="tel"
                    placeholder="Customer phone number"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    className={errors.customerPhone ? 'error' : ''}
                  />
                  {errors.customerPhone && <span className="error-text">{errors.customerPhone}</span>}
                </div>

                <div className="form-group">
                  <label>Estimated Delivery</label>
                  <input
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData({...formData, estimatedDelivery: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  placeholder="Enter complete delivery address"
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
                  className={errors.customerAddress ? 'error' : ''}
                  rows="2"
                />
                {errors.customerAddress && <span className="error-text">{errors.customerAddress}</span>}
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="2"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitDispatch}>
                <TrendingUp size={18} />
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchStock;