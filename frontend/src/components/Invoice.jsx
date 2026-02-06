import { useState, useEffect } from 'react';
import { Search, Plus, Eye, FileText, Calendar, User, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/billingService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import '../styles/Products.css';
import '../styles/DynamicModal.css';
import '../styles/StatusBadges.css';

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleDownloadInvoice = (invoice) => {
    const invoiceData = {
      invoiceId: invoice.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      items: invoice.items || [],
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      totalAmount: invoice.totalAmount,
      customerType: invoice.customerType,
      notes: invoice.notes
    };
    
    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoice.invoiceNumber || invoice.invoiceId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setShowModal(false);
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
                      <StatusBadge status={invoice.status || 'Pending'} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-icon view" 
                          title="View Invoice"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon download" 
                          title="Download Invoice"
                          onClick={() => handleDownloadInvoice(invoice)}
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: 'white'
                          }}
                        >
                          <Download size={16} />
                        </button>
                      </div>
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

      <ViewModal
        isOpen={showModal}
        onClose={closeModal}
        title="Invoice Details"
        data={selectedInvoice}
        fields={[
          { key: 'invoiceId', label: 'Invoice ID' },
          { key: 'customerName', label: 'Customer Name' },
          { key: 'invoiceDate', label: 'Invoice Date' },
          { key: 'totalAmount', label: 'Total Amount', prefix: '$' },
          { key: 'status', label: 'Status' },
          { key: 'paymentMethod', label: 'Payment Method' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'notes', label: 'Notes' }
        ]}
      />
    </div>
  );
};

export default Invoice;