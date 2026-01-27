import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, Package, DollarSign } from 'lucide-react';
import { invoiceService } from '../services/billingService';
import { customerService } from '../services/customerService';
import { generateInvoiceId } from '../utils/generators';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    invoiceId: '',
    customerName: '',
    customerId: '',
    productId: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, invoiceId: generateInvoiceId() }));
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const result = await customerService.getAllCustomers();
    if (result.success) {
      setCustomers(result.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        invoiceId: formData.invoiceId,
        customerName: formData.customerName,
        customerId: formData.customerId,
        items: [{
          productId: formData.productId,
          productName: formData.productName,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.unitPrice)
        }],
        totalAmount: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
        date: formData.date,
        status: 'Pending'
      };

      const result = await invoiceService.createInvoice(invoiceData);
      
      if (result.success) {
        alert('Invoice created successfully!');
        navigate('/dashboard/billing/invoice');
      } else {
        alert(result.error || 'Failed to create invoice');
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
    if (name === 'customerId') {
      const customer = customers.find(c => c.customerId === value);
      setFormData(prev => ({
        ...prev,
        customerId: value,
        customerName: customer ? customer.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/billing/invoice')}>
          <ArrowLeft size={20} />
          Back to Invoices
        </button>
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <FileText size={20} color="#fff" />
            </span>
            Create New Invoice
          </h1>
          <p>Generate invoice for customer orders</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><FileText size={20} />Invoice Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="invoiceId">Invoice ID (Auto-generated)</label>
                  <input
                    type="text"
                    id="invoiceId"
                    name="invoiceId"
                    value={formData.invoiceId}
                    disabled
                    style={{ background: '#f3f4f6', fontWeight: 'bold' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Invoice Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><User size={20} />Customer Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerId">Select Customer *</label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map(customer => (
                      <option key={customer.customerId} value={customer.customerId}>
                        {customer.name} ({customer.customerId})
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
                    disabled
                    style={{ background: '#f3f4f6' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Package size={20} />Product Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="productId">Product ID *</label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                    placeholder="Enter product ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Product Name *</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
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
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><DollarSign size={20} />Pricing</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="unitPrice">Unit Price *</label>
                  <input
                    type="number"
                    id="unitPrice"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter unit price"
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
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
