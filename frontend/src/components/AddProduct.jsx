import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, Hash, DollarSign, Barcode } from 'lucide-react';
import { productService } from '../services/productService';
import { generateBarcode } from '../utils/generators';
import '../styles/Forms.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'A',
    unitId: '',
    barcode: '',
    quantity: '',
    price: ''
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, barcode: generateBarcode() }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        productId: formData.unitId || `P${Date.now()}`,
        category: formData.category,
        barcode: formData.barcode,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price)
      };

      const result = await productService.createProduct(productData);
      
      if (result.success) {
        alert('Product added successfully!');
        navigate('/dashboard/products');
      } else {
        alert(result.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/products')}>
          <ArrowLeft size={20} />
          Back to Products
        </button>
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <Package size={20} color="#fff" />
            </span>
            Add New Product
          </h1>
          <p>Add products to your inventory catalog</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Package size={20} />Product Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="A">Category A</option>
                    <option value="B">Category B</option>
                    <option value="C">Category C</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Hash size={20} />Product Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="unitId">Unit ID</label>
                  <input
                    type="text"
                    id="unitId"
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    placeholder="Enter unit ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="barcode">Barcode (Auto-generated)</label>
                  <div className="input-with-icon">
                    <Barcode size={18} />
                    <input
                      type="text"
                      id="barcode"
                      name="barcode"
                      value={formData.barcode}
                      disabled
                      style={{ paddingLeft: '2.5rem', background: '#f3f4f6', fontWeight: 'bold' }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Initial Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><DollarSign size={20} />Pricing</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Unit Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/products')}
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

export default AddProduct;
