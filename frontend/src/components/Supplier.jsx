import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Eye, Edit, Trash2, Search, X } from 'lucide-react';
import { supplierService } from '../services/userService';

const Supplier = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const result = await supplierService.getSuppliers();
      if (result.success) {
        setSuppliers(result.data);
      } else {
        alert(result.error || 'Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      alert('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    navigate('/dashboard/users/suppliers/add');
  };

  const openViewModal = (supplier) => {
    setSelectedSupplier(supplier);
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    navigate('/dashboard/users/suppliers/edit', { state: { supplier } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const result = await supplierService.deleteSupplier(id);
        if (result.success) {
          setSuppliers(suppliers.filter(s => s.supplierId !== id && s.id !== id));
          alert('Supplier deleted successfully');
        } else {
          alert(result.error || 'Failed to delete supplier');
        }
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier');
      }
    }
  };



  const filteredSuppliers = suppliers.filter(supplier =>
    (supplier.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading suppliers...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <Truck size={20} color="#fff" />
            </span>
            Suppliers
          </h1>
          <p>Manage supplier information</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          Add Supplier
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Supplier List</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                <tr key={supplier.supplierId || supplier.id}>
                  <td>{supplier.supplierId || supplier.id || '-'}</td>
                  <td>{supplier.name || '-'}</td>
                  <td>{supplier.email || '-'}</td>
                  <td>{supplier.phone || '-'}</td>
                  <td>{supplier.address || '-'}</td>
                  <td>{supplier.company || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon view" onClick={() => openViewModal(supplier)} title="View">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon edit" onClick={() => openEditModal(supplier)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(supplier.supplierId || supplier.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedSupplier && (
        <div className="stock-form-overlay">
          <div className="stock-form-modal">
            <div className="form-header">
              <h3>Supplier Details</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="stock-details">
              <div className="detail-row">
                <label>Supplier ID:</label>
                <span>{selectedSupplier.supplierId || selectedSupplier.id}</span>
              </div>
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedSupplier.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedSupplier.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{selectedSupplier.phone}</span>
              </div>
              <div className="detail-row">
                <label>Address:</label>
                <span>{selectedSupplier.address}</span>
              </div>
              <div className="detail-row">
                <label>Company:</label>
                <span>{selectedSupplier.company}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supplier;
