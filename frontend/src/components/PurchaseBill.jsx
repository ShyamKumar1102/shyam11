import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, FileText, User, Calendar, ShoppingCart, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supplierService } from '../services/supplierService';
import { purchaseBillService } from '../services/billingService';
import { generatePurchaseId } from '../utils/idGenerator';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';

const PurchaseBill = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    supplierType: 'registered', // registered, unregistered, consumer
    billDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    billNumber: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
    // Set due date to 30 days from bill date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    setFormData(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
  }, []);

  const fetchSuppliers = async () => {
    try {
      const result = await supplierService.getSuppliers();
      if (result.success) {
        console.log('Suppliers fetched:', result.data);
        setSuppliers(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSupplierChange = (supplierId) => {
    const supplier = suppliers.find(s => (s.id || s.supplierId) === supplierId);
    setFormData(prev => ({
      ...prev,
      supplierId: supplierId,
      supplierName: supplier ? supplier.name || '' : ''
    }));
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = formData.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    let gstRate = 0.18; // Default 18% for registered
    
    if (formData.supplierType === 'unregistered') {
      gstRate = 0.12; // 12% for unregistered
    } else if (formData.supplierType === 'consumer') {
      gstRate = 0.05; // 5% for consumer
    }
    
    return subtotal * gstRate;
  };

  const getGSTPercentage = () => {
    if (formData.supplierType === 'unregistered') return '12%';
    if (formData.supplierType === 'consumer') return '5%';
    return '18%'; // registered
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const billData = {
        purchaseId: generatePurchaseId(),
        ...formData,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        totalAmount: calculateTotal(),
        status: 'Pending'
      };

      const result = await purchaseBillService.createPurchaseBill(billData);
      if (result.success) {
        showSuccessMessage('Purchase bill created successfully!');
        setTimeout(() => {
          navigate('/dashboard/billing/invoice');
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Failed to create purchase bill');
      }
    } catch (error) {
      console.error('Error creating purchase bill:', error);
      showErrorMessage('Failed to create purchase bill');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard/billing/invoice')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1>Create Purchase Bill</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h2>Purchase Bill Information</h2>
            <p>Generate a new purchase bill for supplier payments</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4>
                <ShoppingCart size={20} />
                Purchase Details
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="supplierId">Supplier ID *</label>
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    required
                    className="enhanced-select"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id || supplier.supplierId} value={supplier.id || supplier.supplierId}>
                        {supplier.id || supplier.supplierId} - {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="supplierName">Supplier Name</label>
                  <input
                    type="text"
                    id="supplierName"
                    name="supplierName"
                    value={formData.supplierName}
                    readOnly
                    placeholder="Auto-filled from supplier"
                    className="barcode-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="supplierType">Supplier Type *</label>
                  <select
                    id="supplierType"
                    name="supplierType"
                    value={formData.supplierType}
                    onChange={handleChange}
                    required
                    className="enhanced-select"
                    style={{
                      background: formData.supplierType === 'registered' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' :
                                 formData.supplierType === 'unregistered' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
                                 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      border: '2px solid',
                      borderColor: formData.supplierType === 'registered' ? '#3b82f6' :
                                  formData.supplierType === 'unregistered' ? '#f59e0b' : '#10b981',
                      fontWeight: '600'
                    }}
                  >
                    <option value="registered" key="registered">Registered (18% GST)</option>
                    <option value="unregistered" key="unregistered">Unregistered (12% GST)</option>
                    <option value="consumer" key="consumer">Consumer (5% GST)</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billNumber">Bill Number</label>
                  <input
                    type="text"
                    id="billNumber"
                    name="billNumber"
                    value={formData.billNumber}
                    onChange={handleChange}
                    placeholder="Enter bill number"
                    className={formData.billNumber ? 'filled' : ''}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billDate">Bill Date *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input
                      type="date"
                      id="billDate"
                      name="billDate"
                      value={formData.billDate}
                      onChange={handleChange}
                      required
                      className={formData.billDate ? 'filled' : ''}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                      className={formData.dueDate ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4><Plus size={20} />Purchase Items</h4>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={addItem}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="item-row" style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  alignItems: 'end', 
                  marginBottom: '1rem', 
                  padding: '1rem', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}>
                  <div className="form-group" style={{ flex: '2' }}>
                    <label>Description *</label>
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: '1' }}>
                    <label>Quantity *</label>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: '1' }}>
                    <label>Price *</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: '1' }}>
                    <label>Total</label>
                    <div style={{ 
                      padding: '0.75rem', 
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
                      borderRadius: '6px', 
                      fontWeight: 'bold',
                      border: '2px solid #3b82f6',
                      color: '#1e40af'
                    }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon delete"
                      onClick={() => removeItem(index)}
                      style={{ marginBottom: '0' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-section">
              <h4>
                <User size={20} />
                Billing Address
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billingContactPerson">Contact Person *</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      type="text"
                      id="billingContactPerson"
                      name="billingContactPerson"
                      value={formData.billingContactPerson || ''}
                      onChange={handleChange}
                      placeholder="Enter contact person name"
                      required
                      className={formData.billingContactPerson ? 'filled' : ''}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="billingMobile">Mobile Number *</label>
                  <div className="input-with-icon">
                    <Phone size={18} />
                    <input
                      type="tel"
                      id="billingMobile"
                      name="billingMobile"
                      value={formData.billingMobile || ''}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      required
                      className={formData.billingMobile ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="billingAddress">Billing Address *</label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <textarea
                      id="billingAddress"
                      name="billingAddress"
                      value={formData.billingAddress || ''}
                      onChange={handleChange}
                      placeholder="Enter complete billing address"
                      rows="3"
                      required
                      className={formData.billingAddress ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <Calendar size={20} />
                Additional Information
              </h4>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes..."
                    rows="3"
                    className={formData.notes ? 'filled' : ''}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div style={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                border: '2px solid #0ea5e9' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#0c4a6e' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: '600' }}>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#0c4a6e' }}>
                  <span>GST ({getGSTPercentage()}):</span>
                  <span style={{ fontWeight: '600' }}>${calculateTax().toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  borderTop: '2px solid #0ea5e9', 
                  paddingTop: '0.5rem',
                  color: '#0c4a6e'
                }}>
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard/billing/invoice')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Creating...' : 'Create Purchase Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseBill;