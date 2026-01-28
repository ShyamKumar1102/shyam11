import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, Package, Calculator } from 'lucide-react';
import { invoiceService } from '../services/billingService';
import { customerService } from '../services/userService';
import { productService } from '../services/productService';

const AutoGenerateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    invoiceId: '',
    customerId: '',
    customerName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    selectedProducts: [],
    taxRate: 10,
    notes: ''
  });

  useEffect(() => {
    generateInvoiceId();
    fetchCustomers();
    fetchProducts();
    // Set due date to 30 days from invoice date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    setFormData(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
  }, []);

  const generateInvoiceId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceId = `INV-${timestamp}-${random}`;
    setFormData(prev => ({ ...prev, invoiceId }));
  };

  const fetchCustomers = async () => {
    try {
      const result = await customerService.getAllCustomers();
      if (result.success) {
        setCustomers(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

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

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.customerId === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || ''
    });
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product && !formData.selectedProducts.find(p => p.id === productId)) {
      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price || 0,
        quantity: 1
      };
      setFormData({
        ...formData,
        selectedProducts: [...formData.selectedProducts, newProduct]
      });
    }
  };

  const updateProductQuantity = (productId, quantity) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.map(p =>
        p.id === productId ? { ...p, quantity: parseInt(quantity) || 1 } : p
      )
    });
  };

  const updateProductPrice = (productId, price) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.map(p =>
        p.id === productId ? { ...p, price: parseFloat(price) || 0 } : p
      )
    });
  };

  const removeProduct = (productId) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.filter(p => p.id !== productId)
    });
  };

  const calculateSubtotal = () => {
    return formData.selectedProducts.reduce((sum, product) => 
      sum + (product.quantity * product.price), 0
    );
  };

  const calculateTax = () => {
    return (calculateSubtotal() * formData.taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invoiceData = {
        invoiceId: formData.invoiceId,
        customerId: formData.customerId,
        customerName: formData.customerName,
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        items: formData.selectedProducts.map(p => ({
          description: p.name,
          quantity: p.quantity,
          price: p.price
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        taxRate: formData.taxRate,
        totalAmount: calculateTotal(),
        notes: formData.notes,
        status: 'Pending'
      };

      const result = await invoiceService.createInvoice(invoiceData);
      if (result.success) {
        alert(`Invoice ${formData.invoiceId} created successfully!`);
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
          <h1>Auto Generate Invoice</h1>
          <p>Create invoice with auto-generated ID and product selection</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><FileText size={20} />Invoice Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="invoiceId">Invoice ID</label>
                  <input
                    type="text"
                    id="invoiceId"
                    name="invoiceId"
                    value={formData.invoiceId}
                    readOnly
                    style={{ background: '#f3f4f6', fontWeight: 'bold' }}
                  />
                </div>
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
              </div>
              <div className="form-row">
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
                <div className="form-group">
                  <label htmlFor="taxRate">Tax Rate (%)</label>
                  <input
                    type="number"
                    id="taxRate"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><User size={20} />Customer Information</h4>
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
                        {customer.customerId} - {customer.name}
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
            </div>

            <div className="form-section">
              <h4><Package size={20} />Product Selection</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="productSelect">Add Product</label>
                  <select
                    id="productSelect"
                    onChange={(e) => handleProductSelect(e.target.value)}
                    value=""
                  >
                    <option value="">Select Product to Add</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price || 0}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.selectedProducts.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h5>Selected Products:</h5>
                  {formData.selectedProducts.map((product) => (
                    <div key={product.id} style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      alignItems: 'center', 
                      padding: '1rem', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px', 
                      marginBottom: '0.5rem',
                      background: '#f8fafc'
                    }}>
                      <div style={{ flex: '2', fontWeight: 'bold' }}>
                        {product.name}
                      </div>
                      <div style={{ flex: '1' }}>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Quantity</label>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                          min="1"
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ flex: '1' }}>
                        <label style={{ fontSize: '0.875rem', marginBottom: '0.25rem', display: 'block' }}>Price</label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProductPrice(product.id, e.target.value)}
                          min="0"
                          step="0.01"
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ flex: '1', textAlign: 'center', fontWeight: 'bold' }}>
                        ${(product.quantity * product.price).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        style={{ 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.5rem', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-section">
              <h4><Calculator size={20} />Invoice Summary</h4>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Tax ({formData.taxRate}%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  borderTop: '1px solid #e2e8f0', 
                  paddingTop: '0.5rem' 
                }}>
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="form-row" style={{ marginTop: '1rem' }}>
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
              disabled={loading || formData.selectedProducts.length === 0}
            >
              <Save size={18} />
              {loading ? 'Creating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutoGenerateInvoice;