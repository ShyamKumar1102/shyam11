import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, Hash, DollarSign, Barcode, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';
import { generateBarcode } from '../utils/generators';
import { generateProductId } from '../utils/idGenerator';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
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
        productId: formData.unitId || generateProductId(),
        category: formData.category,
        barcode: formData.barcode,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price)
      };

      const result = await productService.createProduct(productData);
      
      if (result.success) {
        showSuccessMessage('Product added successfully!');
        setTimeout(() => {
          navigate('/dashboard/products');
        }, 2000);
      } else {
        showErrorMessage(result.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showErrorMessage('Failed to add product');
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

  const generateNewBarcode = () => {
    setFormData(prev => ({ ...prev, barcode: generateBarcode() }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard/products')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1>Add New Product</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <Package size={24} />
          </div>
          <div>
            <h2>Product Information</h2>
            <p>Add products to your inventory catalog with enhanced mobile experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4>
                <Package size={20} />
                Basic Information
              </h4>
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
                    className={formData.name ? 'filled' : ''}
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
                    className="enhanced-select"
                  >
                    <option value="A">Category A - Premium</option>
                    <option value="B">Category B - Standard</option>
                    <option value="C">Category C - Basic</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <Hash size={20} />
                Product Details
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="unitId">Unit ID (Optional)</label>
                  <input
                    type="text"
                    id="unitId"
                    name="unitId"
                    value={formData.unitId}
                    onChange={handleChange}
                    placeholder="Auto-generated if empty"
                    className={formData.unitId ? 'filled' : ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="barcode">Barcode</label>
                  <div className="input-group">
                    <div className="input-with-icon">
                      <Barcode size={18} />
                      <input
                        type="text"
                        id="barcode"
                        name="barcode"
                        value={formData.barcode}
                        disabled
                        className="barcode-input"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={generateNewBarcode}
                      title="Generate new barcode"
                    >
                      <Sparkles size={16} />
                    </button>
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
                    placeholder="0"
                    className={formData.quantity ? 'filled' : ''}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <DollarSign size={20} />
                Pricing Information
              </h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Unit Price *</label>
                  <div className="input-with-icon">
                    <DollarSign size={18} />
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={formData.price ? 'filled' : ''}
                    />
                  </div>
                </div>
                {formData.quantity && formData.price && (
                  <div className="form-group">
                    <label>Total Value</label>
                    <div className="calculated-value">
                      ${(parseFloat(formData.quantity || 0) * parseFloat(formData.price || 0)).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/products')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !formData.name || !formData.quantity || !formData.price}
            >
              <Save size={18} />
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
