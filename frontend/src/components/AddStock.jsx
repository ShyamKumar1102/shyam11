import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, MapPin, Hash, User, Plus } from 'lucide-react';
import { stockService, productService } from '../services/productService';
import { supplierService } from '../services/supplierService';
import { generateStockId, generateBatchId } from '../utils/idGenerator';
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';
import '../styles/Forms.css';

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
    batchNumber: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await productService.getProducts();
      if (result.success) {
        console.log('Products fetched:', result.data);
        setProducts(Array.isArray(result.data) ? result.data : []);
      } else {
        console.error('Failed to fetch products:', result.error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const result = await supplierService.getSuppliers();
      if (result.success) {
        console.log('Suppliers fetched:', result.data);
        setSuppliers(result.data || []);
      } else {
        console.error('Failed to fetch suppliers:', result.error);
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
    }
  };

  const handleProductIdChange = (productId) => {
    const product = products.find(p => (p.id || p.productId) === productId);
    setFormData(prev => ({
      ...prev,
      productId: productId,
      productName: product?.name || '',
      batchNumber: '' // Clear batch number when product changes
    }));
  };

  const generateBatchNumber = () => {
    return generateBatchId();
  };

  const handleSupplierIdChange = (supplierId) => {
    console.log('Selected supplier ID:', supplierId);
    console.log('Available suppliers:', suppliers);
    const supplier = suppliers.find(s => (s.id || s.supplierId) === supplierId);
    console.log('Found supplier:', supplier);
    setFormData(prev => ({
      ...prev,
      supplier: supplierId,
      supplierName: supplier?.name || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stockData = {
        stockId: generateStockId(),
        productId: formData.productId,
        itemName: formData.productName,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        location: formData.location,
        supplier: formData.supplier,
        batchNumber: formData.batchNumber || generateBatchNumber()
      };

      const result = await stockService.addStock(stockData);
      
      if (result.success) {
        showSuccessMessage('Stock added successfully!');
        navigate('/dashboard/overview');
      } else {
        showErrorMessage(result.error || 'Failed to add stock');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      showErrorMessage('Failed to add stock');
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
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/dashboard/overview')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <h1>Add New Stock</h1>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/products/add')}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <Package size={24} />
          </div>
          <div>
            <h2>Stock Information</h2>
            <p>Add stock items to your inventory with enhanced mobile experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
                    className="enhanced-select"
                  >
                    <option value="">Select Product</option>
                    {products.length === 0 ? (
                      <option disabled>No products available - Add product first</option>
                    ) : (
                      products.map((product) => (
                        <option key={product.id || product.productId} value={product.id || product.productId}>
                          {product.id || product.productId} - {product.name}
                        </option>
                      ))
                    )}
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
                    className="barcode-input"
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
                    className="enhanced-select"
                  >
                    <option value="">Select Category</option>
                    <option value="A">Category A - Premium</option>
                    <option value="B">Category B - Standard</option>
                    <option value="C">Category C - Basic</option>
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
                    className={formData.quantity ? 'filled' : ''}
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
                    className="enhanced-select"
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
                    className="enhanced-select"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.length === 0 ? (
                      <option disabled>No suppliers available - Add supplier first</option>
                    ) : (
                      suppliers.map((supplier) => (
                        <option key={supplier.id || supplier.supplierId} value={supplier.id || supplier.supplierId}>
                          {supplier.id || supplier.supplierId} - {supplier.name}
                        </option>
                      ))
                    )}
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
                    placeholder={formData.supplierName ? '' : 'Auto-filled from supplier'}
                    className={formData.supplierName ? 'barcode-input filled' : 'barcode-input'}
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
                    placeholder="Enter custom batch or leave empty for auto-generation"
                    className={formData.batchNumber ? 'filled' : ''}
                  />
                  <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Leave empty to auto-generate 6-digit batch number
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/dashboard/overview')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !formData.productId || !formData.quantity || !formData.location}
            >
              <Save size={18} />
              {loading ? 'Adding Stock...' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStock;
