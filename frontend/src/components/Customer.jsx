import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Eye, Edit, Trash2, Search, X } from 'lucide-react';
import { customerService } from '../services/userService';

const Customer = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const result = await customerService.getCustomers();
      if (result.success) {
        setCustomers(result.data);
      } else {
        alert(result.error || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    navigate('/dashboard/users/customers/add');
  };

  const openViewModal = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    navigate('/dashboard/users/customers/edit', { state: { customer } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const result = await customerService.deleteCustomer(id);
        if (result.success) {
          setCustomers(customers.filter(c => c.customerId !== id && c.id !== id));
          alert('Customer deleted successfully');
        } else {
          alert(result.error || 'Failed to delete customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };



  const filteredCustomers = customers.filter(customer =>
    (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <Users size={20} color="#fff" />
            </span>
            Customers
          </h1>
          <p>Manage customer information</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Customer List</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                <tr key={customer.customerId || customer.id}>
                  <td>{customer.customerId || customer.id || '-'}</td>
                  <td>{customer.name || '-'}</td>
                  <td>{customer.email || '-'}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{customer.address || '-'}</td>
                  <td>{customer.company || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon view" onClick={() => openViewModal(customer)} title="View">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon edit" onClick={() => openEditModal(customer)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(customer.customerId || customer.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedCustomer && (
        <div className="stock-form-overlay">
          <div className="stock-form-modal">
            <div className="form-header">
              <h3>Customer Details</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="stock-details">
              <div className="detail-row">
                <label>Customer ID:</label>
                <span>{selectedCustomer.customerId || selectedCustomer.id}</span>
              </div>
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedCustomer.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="detail-row">
                <label>Address:</label>
                <span>{selectedCustomer.address}</span>
              </div>
              <div className="detail-row">
                <label>Company:</label>
                <span>{selectedCustomer.company}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
