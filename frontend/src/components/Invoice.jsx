import { useState, useEffect } from 'react';
import { Search, Plus, Eye, FileText, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/billingService';
import '../styles/Products.css';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const result = await invoiceService.getInvoices();
      if (result.success) {
        console.log('Invoices fetched:', result.data);
        setInvoices(result.data || []);
      } else {
        console.error('Failed to fetch invoices:', result.error);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
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
          <h1>📄 Invoices</h1>
          <p>Manage billing and invoices</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard/billing/invoice/create')}
          >
            <Plus size={20} />
            Manual Invoice
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard/billing/invoice/auto-generate')}
          >
            <Plus size={20} />
            Auto Generate
          </button>
        </div>
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
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoiceId || invoice.id}>
                    <td>
                      <div className="item-info">
                        <FileText size={16} />
                        <span><strong>{invoice.invoiceId || invoice.id}</strong></span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} />
                        {invoice.customerName || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {invoice.invoiceDate || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="amount">${(invoice.totalAmount || 0).toFixed(2)}</span>
                    </td>
                    <td>
                      <span className="status-badge success">
                        {invoice.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon view" title="View Invoice">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    {searchTerm ? 'No matching invoices found' : 'No invoices found. Create your first invoice.'}
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

export default Invoice;