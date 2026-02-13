import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Package, Hash, DollarSign, Barcode } from 'lucide-react';
import { productService } from '../services/productService';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'A',
    barcode: '',
    quantity: '',
    price: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const result = await productService.getProduct(id);
      if (result.success) {
        const product = result.data;
        setFormData({
          id: product.id || '',
          name: product.name || '',
          category: product.category || 'A',
          barcode: product.barcode || '',
          quantity: product.quantity ? product.quantity.toString() : '0',
          price: product.price ? product.price.toString() : '0'
        });
      } else {
        alert(result.error || 'Failed to fetch product');
        navigate('/dashboard/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to fetch product');
      navigate('/dashboard/products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        barcode: formData.barcode,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price)
      };

      const result = await productService.updateProduct(id, productData);
      
      if (result.success) {
        alert('Product updated successfully!');
        navigate('/dashboard/products');
      } else {
        alert(result.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
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
            Edit Product
          </h1>
          <p>Update product information</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Package size={20} />Product Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="id">Product ID</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    disabled
                    style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                </div>
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
              </div>
              <div className="form-row">
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
                  <label htmlFor="barcode">Barcode</label>
                  <div className="input-with-icon">
                    <Barcode size={18} />
                    <input
                      type="text"
                      id="barcode"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      placeholder="Enter barcode"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
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
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
