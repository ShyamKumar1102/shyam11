import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, Package, Calculator, Calendar, Trash2 } from 'lucide-react';
import { invoiceService } from '../services/billingService';
import { customerService } from '../services/userService';
import { productService } from '../services/productService';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';

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
    const customer = customers.find(c => (c.customerId || c.id) === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || ''
    });
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => (p.id || p.productId) === productId);
    if (product && !formData.selectedProducts.find(p => p.id === productId)) {
      const newProduct = {
        id: product.id || product.productId,
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
        showSuccessMessage(`Invoice ${formData.invoiceId} created successfully!`);
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
          <h1>Auto Generate Invoice</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <FileText size={24} />
          </div>
          <div>
            <h2>Auto-Generate Invoice</h2>
            <p>Create invoice with auto-generated ID and product selection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4>
                <FileText size={20} />
                Invoice Details
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="invoiceId">Invoice ID</label>
                  <input
                    type="text"
                    id="invoiceId"
                    name="invoiceId"
                    value={formData.invoiceId}
                    readOnly
                    className="barcode-input"
                  />
                </div>
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
              </div>
              <div className="form-row">
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
                    className={formData.taxRate ? 'filled' : ''}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <User size={20} />
                Customer Information
              </h4>
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
                          {(customer.customerId || customer.id)} - {customer.name}
                        </option>
                      ))
                    )}
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
                    className="barcode-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <Package size={20} />
                Product Selection
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="productSelect">Add Product</label>
                  <select
                    id="productSelect"
                    onChange={(e) => handleProductSelect(e.target.value)}
                    value=""
                    className="enhanced-select"
                  >
                    <option value="">Select Product to Add</option>
                    {products.length === 0 ? (
                      <option disabled>No products available - Add product first</option>
                    ) : (
                      products.map(product => (
                        <option key={product.id || product.productId} value={product.id || product.productId}>
                          {product.name} - ${product.price || 0}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {formData.selectedProducts.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  {formData.selectedProducts.map((product) => (
                    <div key={product.id} style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      alignItems: 'end', 
                      padding: '1rem', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px', 
                      marginBottom: '0.5rem',
                      background: '#f8fafc'
                    }}>
                      <div className="form-group" style={{ flex: '2' }}>
                        <label>Product</label>
                        <div style={{ padding: '0.75rem', background: 'white', borderRadius: '6px', fontWeight: '600' }}>
                          {product.name}
                        </div>
                      </div>
                      <div className="form-group" style={{ flex: '1' }}>
                        <label>Quantity</label>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                          min="1"
                        />
                      </div>
                      <div className="form-group" style={{ flex: '1' }}>
                        <label>Price</label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProductPrice(product.id, e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="form-group" style={{ flex: '1' }}>
                        <label>Total</label>
                        <div style={{ padding: '0.75rem', background: '#dbeafe', borderRadius: '6px', fontWeight: 'bold', color: '#1e40af' }}>
                          ${(product.quantity * product.price).toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-icon delete"
                        onClick={() => removeProduct(product.id)}
                        style={{ marginBottom: '0' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-section">
              <h4>
                <Calculator size={20} />
                Invoice Summary
              </h4>
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