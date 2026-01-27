import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Eye, Download, Search, X } from 'lucide-react';
import { invoiceService } from '../services/billingService';

const Invoice = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const result = await invoiceService.getInvoices();
      if (result.success) {
        setInvoices(result.data);
      } else {
        alert(result.error || 'Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      alert('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = () => {
    navigate('/dashboard/billing/invoice/create');
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice) => {
    alert(`Downloading invoice ${invoice.id}...`);
  };

  const filteredInvoices = invoices.filter(invoice =>
    (invoice.invoiceId || invoice.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.customerName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', marginRight: '12px', verticalAlign: 'middle' }}>
              <FileText size={20} color="#fff" />
            </span>
            Invoices
          </h1>
          <p>Manage customer invoices</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateInvoice}>
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Invoice List</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                <tr key={invoice.invoiceId || invoice.id}>
                  <td>{invoice.invoiceId || invoice.id || '-'}</td>
                  <td>{invoice.customerName || '-'}</td>
                  <td>{invoice.date || '-'}</td>
                  <td>{invoice.items?.length || 0}</td>
                  <td>${(invoice.amount || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status ${invoice.status === 'Paid' ? 'good' : 'pending'}`}>
                      {invoice.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon view" 
                        title="View"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-icon" 
                        title="Download"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="stock-form-overlay">
          <div className="stock-form-modal">
            <div className="form-header">
              <h3>Invoice Details - {selectedInvoice.invoiceId || selectedInvoice.id}</h3>
              <button className="btn-icon" onClick={() => setSelectedInvoice(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="stock-details">
              <div className="detail-row">
                <label>Invoice ID:</label>
                <span>{selectedInvoice.invoiceId || selectedInvoice.id}</span>
              </div>
              <div className="detail-row">
                <label>Customer Name:</label>
                <span>{selectedInvoice.customerName || '-'}</span>
              </div>
              <div className="detail-row">
                <label>Date:</label>
                <span>{selectedInvoice.date || '-'}</span>
              </div>
              <div className="detail-row">
                <label>Total Amount:</label>
                <span>${(selectedInvoice.amount || 0).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status ${selectedInvoice.status === 'Paid' ? 'good' : 'pending'}`}>
                  {selectedInvoice.status || 'Pending'}
                </span>
              </div>
              {selectedInvoice.details && selectedInvoice.details.length > 0 && (
                <div className="detail-row">
                  <label>Items:</label>
                  <div>
                    {selectedInvoice.details.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '8px' }}>
                        {item.product || 'N/A'} - Qty: {item.quantity || 0} - ${(item.price || 0).toLocaleString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
