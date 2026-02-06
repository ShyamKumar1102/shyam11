import { useState, useEffect } from 'react';
import { Search, Plus, Eye, FileText, Calendar, User, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/billingService';
import ViewModal from './ViewModal';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
import '../styles/Products.css';
import '../styles/DynamicModal.css';

const Invoices = () => {
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
    (invoice.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📄 Invoices</h1>
          <p>Manage customer invoices and billing</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/billing/invoice/create')}
        >
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
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>GST</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoiceId || invoice.id}>
                    <td>
                      <Badge variant="indigo">{invoice.invoiceNumber || invoice.invoiceId}</Badge>
                    </td>
                    <td>
                      <Badge variant="pink">{invoice.customerName || 'N/A'}</Badge>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {invoice.invoiceDate || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <Badge variant="green">${(invoice.totalAmount || 0).toFixed(2)}</Badge>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: invoice.customerType === 'registered' ? '#dbeafe' :
                                   invoice.customerType === 'unregistered' ? '#fef3c7' : '#d1fae5',
                        color: invoice.customerType === 'registered' ? '#1e40af' :
                               invoice.customerType === 'unregistered' ? '#92400e' : '#065f46'
                      }}>
                        {invoice.customerType === 'registered' ? '18%' :
                         invoice.customerType === 'unregistered' ? '12%' : '5%'}
                      </span>
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
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
          { key: 'invoiceNumber', label: 'Invoice Number' },
          { key: 'customerName', label: 'Customer Name' },
          { key: 'invoiceDate', label: 'Invoice Date' },
          { key: 'totalAmount', label: 'Total Amount', prefix: '$' },
          { key: 'customerType', label: 'Customer Type' },
          { key: 'status', label: 'Status' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'notes', label: 'Notes' }
        ]}
      />
    </div>
  );
};

export default Invoices;