import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, FileText, User, Calendar, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/billingService';
import { customerService } from '../services/userService';
import { generateInvoiceId } from '../utils/idGenerator';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerType: 'registered', // registered, unregistered, consumer
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    // Set due date to 30 days from invoice date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    setFormData(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
  }, []);

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

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => (c.customerId || c.id) === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || ''
    });
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
    
    if (formData.customerType === 'unregistered') {
      gstRate = 0.12; // 12% for unregistered
    } else if (formData.customerType === 'consumer') {
      gstRate = 0.05; // 5% for consumer
    }
    
    return subtotal * gstRate;
  };

  const getGSTPercentage = () => {
    if (formData.customerType === 'unregistered') return '12%';
    if (formData.customerType === 'consumer') return '5%';
    return '18%'; // registered
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        invoiceId: generateInvoiceId(),
        invoiceNumber: `INV-${Date.now()}`,
        ...formData,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        totalAmount: calculateTotal(),
        status: 'Pending'
      };

      const result = await invoiceService.createInvoice(invoiceData);
      if (result.success) {
        showSuccessMessage('Invoice created successfully!');
        setTimeout(() => {
          navigate('/dashboard/billing/invoice');
        }, 2000);
      } else {
        showErrorMessage('Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      showErrorMessage('Failed to create invoice');
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
          <h1>Create Invoice</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <FileText size={24} />
          </div>
          <div>
            <h2>Invoice Information</h2>
            <p>Generate a new invoice for customer billing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4><FileText size={20} />Invoice Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerId">Customer *</label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    required
                    className="enhanced-select"
                  >
                    <option value="">Select Customer</option>
                    {customers.length === 0 ? (
                      <option disabled>No customers available - Add customer first</option>
                    ) : (
                      customers.map(customer => (
                        <option key={customer.customerId || customer.id} value={customer.customerId || customer.id}>
                          {customer.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="customerType">Customer Type *</label>
                  <select
                    id="customerType"
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleChange}
                    required
                    className="enhanced-select"
                    style={{
                      background: formData.customerType === 'registered' ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' :
                                 formData.customerType === 'unregistered' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
                                 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      border: '2px solid',
                      borderColor: formData.customerType === 'registered' ? '#3b82f6' :
                                  formData.customerType === 'unregistered' ? '#f59e0b' : '#10b981',
                      fontWeight: '600'
                    }}
                  >
                    <option value="registered">Registered (18% GST)</option>
                    <option value="unregistered">Unregistered (12% GST)</option>
                    <option value="consumer">Consumer (5% GST)</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    readOnly
                    placeholder="Auto-filled from customer"
                    className="barcode-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="invoiceDate">Invoice Date *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} />
                    <input
                      type="date"
                      id="invoiceDate"
                      name="invoiceDate"
                      value={formData.invoiceDate}
                      onChange={handleChange}
                      required
                      className={formData.invoiceDate ? 'filled' : ''}
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
                <h4><Plus size={20} />Invoice Items</h4>
                <button type="button" className="btn btn-secondary" onClick={addItem}>
                  <Plus size={16} />
                  Add Item
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="item-row" style={{ display: 'flex', gap: '1rem', alignItems: 'end', marginBottom: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
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
                    <div style={{ padding: '0.75rem', background: '#f3f4f6', borderRadius: '6px', fontWeight: 'bold' }}>
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
                <Truck size={20} />
                Shipping Address
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shippingContactPerson">Contact Person *</label>
                  <div className="input-with-icon">
                    <User size={18} />
                    <input
                      type="text"
                      id="shippingContactPerson"
                      name="shippingContactPerson"
                      value={formData.shippingContactPerson || ''}
                      onChange={handleChange}
                      placeholder="Enter contact person name"
                      required
                      className={formData.shippingContactPerson ? 'filled' : ''}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="shippingMobile">Mobile Number *</label>
                  <div className="input-with-icon">
                    <Phone size={18} />
                    <input
                      type="tel"
                      id="shippingMobile"
                      name="shippingMobile"
                      value={formData.shippingMobile || ''}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      required
                      className={formData.shippingMobile ? 'filled' : ''}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="shippingAddress">Shipping Address *</label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress || ''}
                      onChange={handleChange}
                      placeholder="Enter complete shipping address"
                      rows="3"
                      required
                      className={formData.shippingAddress ? 'filled' : ''}
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
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>GST ({getGSTPercentage()}):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
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
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;