import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, MapPin, Hash } from 'lucide-react';
import { stockService } from '../services/productService';
import { supplierService } from '../services/userService';

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
    const supplier = suppliers.find(s => (s.supplierId || s.id) === supplierId);
    if (supplier) {
      setFormData({
        ...formData,
        supplier: supplierId,
        supplierName: supplier.name || ''
      });
    }
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
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard/overview')}>
          <ArrowLeft size={20} />
          Back to Stock Summary
        </button>
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <Package size={20} color="#fff" />
            </span>
            Update Stock
          </h1>
          <p>Update stock quantity and details for existing items</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="stock-form">
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
                    style={{ background: '#f3f4f6' }}
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
                  >
                    <option value="">Select Category</option>
                    <option value="A">Category A</option>
                    <option value="B">Category B</option>
                    <option value="C">Category C</option>
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
                    style={{ background: '#f3f4f6' }}
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
                    onChange={(e) => handleSupplierChange(e.target.value)}
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
              {loading ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStock;
