import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, FileText, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/billingService';
import { customerService } from '../services/userService';
import '../styles/Products.css';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
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
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.customerId === customerId);
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
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        ...formData,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        totalAmount: calculateTotal(),
        status: 'Pending'
      };

      const result = await invoiceService.createInvoice(invoiceData);
      if (result.success) {
        alert('Invoice created successfully!');
        navigate('/dashboard/billing/invoice');
      } else {
        alert('Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
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
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/billing/invoice')}>
          <ArrowLeft size={20} />
          Back to Invoices
        </button>
        <div className="page-title">
          <h1>Create Invoice</h1>
          <p>Generate a new invoice for customer billing</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><FileText size={20} />Invoice Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerId">Customer *</label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    readOnly
                    placeholder="Auto-filled from customer"
                    style={{ background: '#f3f4f6' }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="invoiceDate">Invoice Date *</label>
                  <input
                    type="date"
                    id="invoiceDate"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
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
              <h4><Calendar size={20} />Additional Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes..."
                    rows="3"
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
                  <span>Tax (10%):</span>
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