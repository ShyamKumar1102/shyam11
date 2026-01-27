import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Package, Tag, DollarSign, Barcode } from 'lucide-react';
import { productService } from '../services/productService';
import '../styles/Products.css';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await productService.getProducts();
      if (result.success) {
        setProducts(result.data);
      } else {
        console.error('Error fetching products:', result.error);
        alert(result.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await productService.deleteProduct(productId);
        if (result.success) {
          setProducts(products.filter(p => p.id !== productId));
          alert('Product deleted successfully');
        } else {
          alert(result.error || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= 10).length;
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const categoryA = products.filter(p => p.category === 'A').length;

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📦 Product Management</h1>
          <p>Manage your product catalog and inventory</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/products/add')}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{totalProducts}</p>
            <span className="stat-label">Active products</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <Tag size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <p className="stat-value">{lowStockProducts}</p>
            <span className="stat-label">Items need restock</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <DollarSign size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Total Value</h3>
            <p className="stat-value">${totalValue.toFixed(2)}</p>
            <span className="stat-label">Inventory worth</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Barcode size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Category A</h3>
            <p className="stat-value">{categoryA}</p>
            <span className="stat-label">Premium items</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Product Catalog</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Barcode</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.id}</strong></td>
                    <td>
                      <div className="item-info">
                        <Package size={16} />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`category-badge category-${product.category.toLowerCase()}`}>
                        Category {product.category}
                      </span>
                    </td>
                    <td>
                      <div className="barcode-display">
                        <Barcode size={14} />
                        {product.barcode}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-badge ${product.quantity <= 5 ? 'low' : product.quantity <= 50 ? 'medium' : 'high'}`}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="currency">${product.price.toFixed(2)}</td>
                    <td className="currency"><strong>${(product.quantity * product.price).toFixed(2)}</strong></td>
                    <td>
                      <span className={`status-badge ${product.quantity <= 10 ? 'warning' : 'success'}`}>
                        {product.quantity <= 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon edit"
                          onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon delete"
                          onClick={() => handleDelete(product.id)}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;