import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, MapPin, Hash, User } from 'lucide-react';
import { stockService, productService } from '../services/productService';
import { supplierService } from '../services/userService';

const AddStock = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    category: '',
    quantity: '',
    location: '',
    supplier: '',
    supplierName: '',
    batchNumber: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

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

  const fetchSuppliers = async () => {
    try {
      const result = await supplierService.getSuppliers();
      if (result.success) {
        setSuppliers(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleProductIdChange = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        ...formData,
        productId: productId,
        productName: product.name || ''
      });
    } else {
      setFormData({
        ...formData,
        productId: productId,
        productName: ''
      });
    }
  };

  const handleSupplierIdChange = (supplierId) => {
    const supplier = suppliers.find(s => (s.supplierId || s.id) === supplierId);
    if (supplier) {
      setFormData({
        ...formData,
        supplier: supplierId,
        supplierName: supplier.name || ''
      });
    } else {
      setFormData({
        ...formData,
        supplier: supplierId,
        supplierName: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stockData = {
        productId: formData.productId,
        itemName: formData.productName,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        location: formData.location,
        supplier: formData.supplier,
        batchNumber: formData.batchNumber
      };

      const result = await stockService.addStock(stockData);
      
      if (result.success) {
        alert('Stock added successfully!');
        navigate('/dashboard/overview');
      } else {
        alert(result.error || 'Failed to add stock');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock');
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
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/overview')}>
          <ArrowLeft size={20} />
          Back to Stock Summary
        </button>
        <div className="page-title">
          <h1>Add New Stock</h1>
          <p>Add stock items to your inventory</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-sections">
            <div className="form-section">
              <h4><Package size={20} />Product Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="productId">Product ID *</label>
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={(e) => handleProductIdChange(e.target.value)}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.id} - {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Product Name *</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    readOnly
                    placeholder="Auto-filled from product"
                    style={{ background: '#f3f4f6' }}
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
                    <option value="">Select Category</option>
                    <option value="A">Category A</option>
                    <option value="B">Category B</option>
                    <option value="C">Category C</option>
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
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><MapPin size={20} />Location & Supplier</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="Warehouse A">Warehouse A</option>
                    <option value="Warehouse B">Warehouse B</option>
                    <option value="Warehouse C">Warehouse C</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="supplier">Supplier ID</label>
                  <select
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={(e) => handleSupplierIdChange(e.target.value)}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.supplierId || supplier.id} value={supplier.supplierId || supplier.id}>
                        {supplier.supplierId || supplier.id} - {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="supplierName">Supplier Name</label>
                  <input
                    type="text"
                    id="supplierName"
                    name="supplierName"
                    value={formData.supplierName}
                    readOnly
                    placeholder="Auto-filled from supplier"
                    style={{ background: '#f3f4f6' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Hash size={20} />Batch & Expiry</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="batchNumber">Batch Number</label>
                  <input
                    type="text"
                    id="batchNumber"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    placeholder="Enter batch number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/overview')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStock;
