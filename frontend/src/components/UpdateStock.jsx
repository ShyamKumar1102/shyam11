import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, MapPin, Hash, Plus } from 'lucide-react';
import { stockService } from '../services/productService';
import { supplierService } from '../services/supplierService';
import '../styles/Forms.css';

const UpdateStock = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    stockId: '',
    itemName: '',
    category: '',
    currentQuantity: '',
    location: '',
    supplier: '',
    supplierName: '',
    batchNumber: '',
    addQuantity: ''
  });

  useEffect(() => {
    fetchStocks();
    fetchSuppliers();
  }, []);

  const fetchStocks = async () => {
    try {
      const result = await stockService.getStock();
      if (result.success) {
        setStocks(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
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

  const handleStockChange = (stockId) => {
    const stock = stocks.find(s => s.id === stockId);
    if (stock) {
      const supplier = suppliers.find(s => (s.supplierId || s.id) === stock.supplier);
      setFormData({
        ...formData,
        stockId: stockId,
        itemName: stock.itemName || stock.name || '',
        category: stock.category || '',
        currentQuantity: stock.quantity || stock.availableStock || 0,
        location: stock.location || '',
        supplier: stock.supplier || '',
        supplierName: supplier?.name || '',
        batchNumber: stock.batchNumber || '',
        addQuantity: ''
      });
    }
  };

  const handleSupplierChange = (supplierId) => {
    const supplier = suppliers.find(s => (s.id || s.supplierId) === supplierId);
    setFormData(prev => ({
      ...prev,
      supplier: supplierId,
      supplierName: supplier ? supplier.name || '' : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newQuantity = parseInt(formData.currentQuantity) + parseInt(formData.addQuantity);
      const result = await stockService.updateStock(formData.stockId, {
        quantity: newQuantity,
        category: formData.category,
        location: formData.location,
        supplier: formData.supplier,
        batchNumber: formData.batchNumber
      });
      
      if (result.success) {
        alert('Stock updated successfully!');
        navigate('/dashboard/overview');
      } else {
        alert(result.error || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
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
          <h1>Update Stock</h1>
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
            <h2>Update Stock Information</h2>
            <p>Update stock quantity and details for existing items</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="form-section">
              <h4><Package size={20} />Stock Selection</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stockId">Select Stock Item *</label>
                  <select
                    id="stockId"
                    name="stockId"
                    value={formData.stockId}
                    onChange={(e) => handleStockChange(e.target.value)}
                    required
                    className="enhanced-select"
                  >
                    <option value="">Select Stock</option>
                    {stocks.map((stock) => (
                      <option key={stock.id} value={stock.id}>
                        {stock.id} - {stock.itemName || stock.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="itemName">Item Name</label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    readOnly
                    placeholder="Auto-filled from stock"
                    className="barcode-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Package size={20} />Product Details</h4>
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
                  <label htmlFor="currentQuantity">Current Quantity</label>
                  <input
                    type="number"
                    id="currentQuantity"
                    name="currentQuantity"
                    value={formData.currentQuantity}
                    readOnly
                    className="barcode-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="addQuantity">Add Quantity *</label>
                  <input
                    type="number"
                    id="addQuantity"
                    name="addQuantity"
                    value={formData.addQuantity}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Enter quantity to add"
                    className={formData.addQuantity ? 'filled' : ''}
                  />
                </div>
                {formData.currentQuantity && formData.addQuantity && (
                  <div className="form-group">
                    <label>New Total Quantity</label>
                    <div className="calculated-value">
                      {parseInt(formData.currentQuantity || 0) + parseInt(formData.addQuantity || 0)} units
                    </div>
                  </div>
                )}
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
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    className="enhanced-select"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id || supplier.supplierId} value={supplier.id || supplier.supplierId}>
                        {supplier.id || supplier.supplierId} - {supplier.name}
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
                    className="barcode-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><Hash size={20} />Batch Information</h4>
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
                    className={formData.batchNumber ? 'filled' : ''}
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
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !formData.stockId || !formData.addQuantity}
            >
              <Save size={18} />
              {loading ? 'Updating Stock...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStock;
