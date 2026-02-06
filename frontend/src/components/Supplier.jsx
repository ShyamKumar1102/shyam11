import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Eye, Edit, Trash2, Search, Users, MapPin, Building, Phone, Mail, TrendingUp } from 'lucide-react';
import { supplierService } from '../services/userService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
import '../styles/Products.css';

const Supplier = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ isOpen: false, supplier: null });

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

  const handleView = (supplier) => {
    setViewModal({ isOpen: true, supplier });
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

  const supplierFields = [
    { label: 'Supplier ID', key: 'supplierId' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Address', key: 'address' },
    { label: 'Company', key: 'company' },
    { label: 'Status', key: 'status' }
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    (supplier.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.supplierId || supplier.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status !== 'inactive').length;
  const companiesCount = [...new Set(suppliers.map(s => s.company).filter(Boolean))].length;
  const locationsCount = [...new Set(suppliers.map(s => s.address).filter(Boolean))].length;

  if (loading) {
    return <div className="loading">Loading suppliers...</div>;
  }

  // Prepare supplier data for modal
  const modalSupplier = viewModal.supplier ? {
    ...viewModal.supplier,
    supplierId: viewModal.supplier.supplierId || viewModal.supplier.id,
    status: viewModal.supplier.status || 'Active'
  } : null;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🚚 Supplier Management</h1>
          <p>Manage your supplier network and vendor relationships with enhanced mobile experience</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <Plus size={20} />
          Add Supplier
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
            <Users size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Suppliers</h3>
            <p className="stat-value">{totalSuppliers}</p>
            <span className="stat-label">Registered vendors</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
            <TrendingUp size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Active Suppliers</h3>
            <p className="stat-value">{activeSuppliers}</p>
            <span className="stat-label">Currently active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
            <Building size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3>Companies</h3>
            <p className="stat-value">{companiesCount}</p>
            <span className="stat-label">Unique companies</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>
            <MapPin size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <h3>Locations</h3>
            <p className="stat-value">{locationsCount}</p>
            <span className="stat-label">Different locations</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Supplier Directory</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search suppliers, companies, or locations..."
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                <tr key={supplier.supplierId || supplier.id}>
                  <td><strong>{supplier.supplierId || supplier.id || '-'}</strong></td>
                  <td><Badge variant="blue">{supplier.name || '-'}</Badge></td>
                  <td><Badge variant="gray">{supplier.email || '-'}</Badge></td>
                  <td><Badge variant="gray">{supplier.phone || '-'}</Badge></td>
                  <td><Badge variant="cyan">{supplier.address || '-'}</Badge></td>
                  <td><Badge variant="teal">{supplier.company || '-'}</Badge></td>
                  <td>
                    <StatusBadge status={supplier.status || 'Active'} />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon view"
                        onClick={() => handleView(supplier)}
                        title="View Supplier"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-icon edit"
                        onClick={() => openEditModal(supplier)}
                        title="Edit Supplier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => handleDelete(supplier.supplierId || supplier.id)}
                        title="Delete Supplier"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <Truck size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <div style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      No suppliers found
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first supplier'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ViewModal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, supplier: null })}
        title="Supplier Details"
        data={modalSupplier}
        fields={supplierFields}
      />
    </div>
  );
};

export default Supplier;
