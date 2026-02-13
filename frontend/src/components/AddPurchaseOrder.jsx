import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ShoppingCart, Package, User, Calendar, DollarSign } from 'lucide-react';
import { supplierService } from '../services/supplierService';
import { purchaseOrderService } from '../services/billingService';
import { generateOrderId } from '../utils/idGenerator';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';

const AddPurchaseOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    status: 'Pending',
    notes: ''
  });

  useEffect(() => {
    try {
      fetchSuppliers();
    } catch (err) {
      console.error('Component mount error:', err);
      setPageError(err.message);
    }
  }, []);

  const fetchSuppliers = async () => {
    try {
      const result = await supplierService.getSuppliers();
      if (result.success) {
        setSuppliers(result.data || []);
      } else {
        console.error('Failed to fetch suppliers:', result.error);
        setSuppliers([]);
        setError('Failed to load suppliers. You can still create an order.');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
      setError('Failed to load suppliers. You can still create an order.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderId: generateOrderId(),
        ...formData
      };
      
      const result = await purchaseOrderService.createPurchaseOrder(orderData);
      
      if (result.success) {
        showSuccessMessage('Purchase order created successfully!');
        setTimeout(() => {
          navigate('/dashboard/procurement');
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Failed to create purchase order');
      }
    } catch (error) {
      console.error('Error adding purchase order:', error);
      showErrorMessage('Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Handle supplier selection
      if (name === 'supplierId') {
        const supplier = suppliers.find(s => (s.id || s.supplierId) === value);
        if (supplier) {
          setSelectedSupplier(supplier);
          updated.supplierName = supplier.name || '';
          updated.supplierEmail = supplier.email || '';
          updated.supplierPhone = supplier.phone || '';
          updated.supplierAddress = supplier.address || '';
        } else {
          setSelectedSupplier(null);
          updated.supplierName = '';
          updated.supplierEmail = '';
          updated.supplierPhone = '';
          updated.supplierAddress = '';
        }
      }
      
      // Calculate total amount when quantity or unit price changes
      if (name === 'quantity' || name === 'unitPrice') {
        const qty = parseFloat(name === 'quantity' ? value : updated.quantity) || 0;
        const price = parseFloat(name === 'unitPrice' ? value : updated.unitPrice) || 0;
        updated.totalAmount = (qty * price).toFixed(2);
      }
      
      return updated;
    });
  };

  if (pageError) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate('/dashboard/procurement')}>
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
        <div style={{
          background: '#fef2f2',
          border: '2px solid #dc2626',
          borderRadius: '12px',
          padding: '24px',
          margin: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>Error Loading Page</h3>
          <p style={{ color: '#991b1b' }}>{pageError}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px' }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard/procurement')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1>Add Purchase Order</h1>
        </div>
      </div>

      <div className="form-container">
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}
        <div className="form-header">
          <div className="form-icon">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2>Purchase Order Information</h2>
            <p>Create a new purchase order for inventory procurement</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4>
                <User size={20} />
                Supplier Information
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="supplierId">Select Supplier *</label>
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    required
                    className="enhanced-select"
                  >
                    <option value="">Choose a supplier...</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id || supplier.supplierId} value={supplier.id || supplier.supplierId}>
                        {supplier.id || supplier.supplierId} - {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {selectedSupplier && (
                <div className="supplier-details" style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  border: '2px solid #0ea5e9',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '12px'
                }}>
                  <h5 style={{ color: '#0c4a6e', marginBottom: '12px', fontWeight: '600' }}>Supplier Details</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <span style={{ fontWeight: '500', color: '#0369a1' }}>Name:</span>
                      <div style={{ color: '#0c4a6e', fontWeight: '600' }}>{selectedSupplier.name}</div>
                    </div>
                    <div>
                      <span style={{ fontWeight: '500', color: '#0369a1' }}>Email:</span>
                      <div style={{ color: '#0c4a6e' }}>{selectedSupplier.email}</div>
                    </div>
                    <div>
                      <span style={{ fontWeight: '500', color: '#0369a1' }}>Phone:</span>
                      <div style={{ color: '#0c4a6e' }}>{selectedSupplier.phone}</div>
                    </div>
                    <div>
                      <span style={{ fontWeight: '500', color: '#0369a1' }}>Address:</span>
                      <div style={{ color: '#0c4a6e' }}>{selectedSupplier.address}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="orderDate">Order Date *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input
                      type="date"
                      id="orderDate"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleChange}
                      required
                      className={formData.orderDate ? 'filled' : ''}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="expectedDelivery">Expected Delivery</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input
                      type="date"
                      id="expectedDelivery"
                      name="expectedDelivery"
                      value={formData.expectedDelivery}
                      onChange={handleChange}
                      className={formData.expectedDelivery ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <Package size={20} />
                Product Details
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="productName">Select Product *</label>
                  <select
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    className="enhanced-select"
                  >
                    <option value="">Choose a product...</option>
                    <option value="Product A">Product A</option>
                    <option value="Product B">Product B</option>
                    <option value="Product C">Product C</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Enter quantity"
                    className={formData.quantity ? 'filled' : ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unitPrice">Unit Price *</label>
                  <div className="input-with-icon">
                    <DollarSign size={18} />
                    <input
                      type="number"
                      id="unitPrice"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={formData.unitPrice ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <DollarSign size={20} />
                Order Summary
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalAmount">Total Amount</label>
                  <div className="calculated-value">
                    ${formData.totalAmount || '0.00'}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="enhanced-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Enter any additional notes"
                    rows="3"
                    className={formData.notes ? 'filled' : ''}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/procurement')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !formData.supplierId || !formData.productName || !formData.quantity || !formData.unitPrice}
            >
              <Save size={18} />
              {loading ? 'Creating Order...' : 'Create Purchase Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseOrder;