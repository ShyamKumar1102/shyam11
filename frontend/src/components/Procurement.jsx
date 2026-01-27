import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Calendar, Search, Truck, User, Plus, X, CheckCircle, Eye, Download } from 'lucide-react';
import { productService } from '../services/productService';
import { supplierService } from '../services/supplierService';
import { purchaseOrderService } from '../services/billingService';
import { generatePOId } from '../utils/generators';
import '../styles/Income.css';

const Procurement = () => {
  const [procurementData, setProcurementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    poId: '',
    supplierId: '',
    supplierName: '',
    productId: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    deliveryDate: '',
    orderDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProcurementData();
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await productService.getProducts();
      if (result.success) {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const result = await supplierService.getSuppliers();
      if (result.success) {
        setSuppliers(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchProcurementData = async () => {
    try {
      const result = await purchaseOrderService.getPurchaseOrders();
      if (result.success) {
        setProcurementData(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching procurement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        ...formData,
        productId: productId,
        productName: product.name || '',
        unitPrice: product.price || ''
      });
    }
  };

  const handleSupplierChange = (supplierId) => {
    const supplier = suppliers.find(s => (s.supplierId || s.id) === supplierId);
    if (supplier) {
      setFormData({
        ...formData,
        supplierId: supplierId,
        supplierName: supplier.name || ''
      });
    }
  };

  const openModal = () => {
    setFormData({
      poId: generatePOId(),
      supplierId: '',
      supplierName: '',
      productId: '',
      productName: '',
      quantity: '',
      unitPrice: '',
      deliveryDate: '',
      orderDate: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplierId.trim()) newErrors.supplierId = 'Supplier is required';
    if (!formData.productId.trim()) newErrors.productId = 'Product is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const totalAmount = parseFloat(formData.quantity || 0) * parseFloat(formData.unitPrice || 0);

    const newPO = {
      poId: formData.poId,
      supplierName: formData.supplierName,
      supplierId: formData.supplierId,
      items: [{
        productId: formData.productId,
        productName: formData.productName,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.unitPrice)
      }],
      totalAmount: totalAmount,
      date: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      status: 'Pending'
    };

    try {
      const result = await purchaseOrderService.createPurchaseOrder(newPO);
      if (result.success) {
        await fetchProcurementData();
        closeModal();
        alert('Procurement details added successfully!');
      } else {
        alert(result.error || 'Failed to add procurement details');
      }
    } catch (error) {
      console.error('Error creating procurement:', error);
      alert('Failed to add procurement details');
    }
  };

  const handleViewPO = (order) => {
    setSelectedOrder(order);
  };

  const handleDownloadPO = (order) => {
    alert(`Downloading purchase order ${order.purchaseorderId || order.id}...`);
  };

  const filteredProcurement = procurementData.filter(item => {
    const productName = item.items?.[0]?.productName || '';
    const supplierName = item.supplierName || '';
    const orderId = item.purchaseorderId || item.id || '';
    
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || item.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const totalOrders = filteredProcurement.length;
  const pendingOrders = filteredProcurement.filter(item => item.status === 'Pending').length;
  const deliveredOrders = filteredProcurement.filter(item => item.status === 'Delivered' || item.status === 'Received').length;
  const inTransitOrders = filteredProcurement.filter(item => item.status === 'In Transit').length;

  if (loading) {
    return <div className="loading">Loading procurement data...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🛒 Procurement Management</h1>
          <p>Manage purchase orders and supplier relationships</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size={20} />
          Add Purchase Order
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <ShoppingCart size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrders}</p>
            <span className="stat-label">Purchase orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Package size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Pending Orders</h3>
            <p className="stat-value">{pendingOrders}</p>
            <span className="stat-label">Awaiting delivery</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <Truck size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <h3>In Transit</h3>
            <p className="stat-value">{inTransitOrders}</p>
            <span className="stat-label">On the way</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <CheckCircle size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Delivered</h3>
            <p className="stat-value">{deliveredOrders}</p>
            <span className="stat-label">Completed orders</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Purchase Orders</h2>
          <div className="filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="date-filter">
              <Calendar size={20} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier Name</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Expected Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcurement.length > 0 ? (
                filteredProcurement.map((item) => (
                  <tr key={item.purchaseorderId || item.id}>
                    <td><strong>{item.purchaseorderId || item.id}</strong></td>
                    <td>
                      <div className="item-info">
                        <User size={16} />
                        <span>{item.supplierName || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {item.date || '-'}
                      </div>
                    </td>
                    <td>{item.items?.length || 0}</td>
                    <td className="currency"><strong>${(item.amount || 0).toLocaleString()}</strong></td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {item.deliveryDate || '-'}
                      </div>
                    </td>
                    <td>
                      <span className={`status ${item.status === 'Received' || item.status === 'Delivered' ? 'good' : 'pending'}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon view" 
                          title="View"
                          onClick={() => handleViewPO(item)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Download"
                          onClick={() => handleDownloadPO(item)}
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No procurement orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Purchase Order</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>PO ID (Auto-generated)</label>
                <input
                  type="text"
                  value={formData.poId}
                  disabled
                  style={{ background: '#f3f4f6', fontWeight: 'bold' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Supplier *</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    className={errors.supplierId ? 'error' : ''}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplierId || supplier.id} value={supplier.supplierId || supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  {errors.supplierId && <span className="error-text">{errors.supplierId}</span>}
                </div>

                <div className="form-group">
                  <label>Product *</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className={errors.productId ? 'error' : ''}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {errors.productId && <span className="error-text">{errors.productId}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className={errors.quantity ? 'error' : ''}
                    min="1"
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                </div>

                <div className="form-group">
                  <label>Unit Price (Auto-filled)</label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    disabled
                    style={{ background: '#f3f4f6' }}
                  />
                </div>

                <div className="form-group">
                  <label>Total Amount</label>
                  <input
                    type="text"
                    value={formData.quantity && formData.unitPrice ? `$${(formData.quantity * formData.unitPrice).toFixed(2)}` : '$0.00'}
                    disabled
                    style={{ background: '#f3f4f6', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Expected Delivery Date *</label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                  className={errors.deliveryDate ? 'error' : ''}
                />
                {errors.deliveryDate && <span className="error-text">{errors.deliveryDate}</span>}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                <ShoppingCart size={18} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="stock-form-overlay">
          <div className="stock-form-modal">
            <div className="form-header">
              <h3>Purchase Order Details - {selectedOrder.purchaseorderId || selectedOrder.id}</h3>
              <button className="btn-icon" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="stock-details">
              <div className="detail-row">
                <label>PO Number:</label>
                <span>{selectedOrder.purchaseorderId || selectedOrder.id}</span>
              </div>
              <div className="detail-row">
                <label>Supplier Name:</label>
                <span>{selectedOrder.supplierName}</span>
              </div>
              <div className="detail-row">
                <label>Date:</label>
                <span>{selectedOrder.date}</span>
              </div>
              <div className="detail-row">
                <label>Expected Delivery:</label>
                <span>{selectedOrder.deliveryDate || '-'}</span>
              </div>
              <div className="detail-row">
                <label>Total Amount:</label>
                <span>${(selectedOrder.amount || 0).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status ${selectedOrder.status === 'Received' ? 'good' : 'pending'}`}>
                  {selectedOrder.status || 'Pending'}
                </span>
              </div>
              <div className="detail-row">
                <label>Items:</label>
                <div>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}>
                      {item.productName || 'N/A'} - Qty: {item.quantity || 0} - ${(item.price || 0).toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Procurement;
