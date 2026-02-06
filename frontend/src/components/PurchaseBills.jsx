import { useState, useEffect } from 'react';
import { Search, Plus, Eye, FileText, Calendar, User, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ViewModal from './ViewModal';
import { purchaseBillService } from '../services/billingService';
import StatusBadge from './StatusBadge';
import '../styles/Products.css';
import '../styles/DynamicModal.css';
import '../styles/StatusBadges.css';

const PurchaseBills = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchaseBills();
  }, []);

  const fetchPurchaseBills = async () => {
    try {
      const result = await purchaseBillService.getPurchaseBills();
      if (result.success) {
        setBills(result.data || []);
      } else {
        console.error('Failed to fetch purchase bills:', result.error);
        setBills([]);
      }
    } catch (error) {
      console.error('Error fetching purchase bills:', error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBill = (bill) => {
    const billData = {
      billId: bill.billId,
      supplierName: bill.supplierName,
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      items: bill.items || [],
      subtotal: bill.subtotal,
      tax: bill.tax,
      totalAmount: bill.totalAmount,
      supplierType: bill.supplierType,
      notes: bill.notes
    };
    
    const dataStr = JSON.stringify(billData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purchase-bill-${bill.billId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBill(null);
    setShowModal(false);
  };
  const filteredBills = bills.filter(bill =>
    (bill.billId || bill.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bill.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading purchase bills...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🧾 Purchase Bills</h1>
          <p>Manage supplier purchase bills and payments</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard/billing/purchase-bill/create')}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            border: 'none'
          }}
        >
          <Plus size={20} />
          Create Purchase Bill
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Purchase Bill List</h2>
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search purchase bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Amount</th>
                <th>GST</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.billId || bill.id}>
                    <td>
                      <div className="item-info">
                        <FileText size={16} />
                        <span><strong>{bill.billId || bill.id}</strong></span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} />
                        {bill.supplierName || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {bill.billDate || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <span className="amount">${(bill.totalAmount || 0).toFixed(2)}</span>
                    </td>
                    <td>
                      <StatusBadge status={bill.supplierType === 'registered' ? '18%' :
                                           bill.supplierType === 'unregistered' ? '12%' : '5%'} />
                    </td>
                    <td>
                      <StatusBadge status={bill.status || 'Pending'} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-icon view" 
                          title="View Purchase Bill"
                          onClick={() => handleViewBill(bill)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon download" 
                          title="Download Purchase Bill"
                          onClick={() => handleDownloadBill(bill)}
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                    {searchTerm ? 'No matching purchase bills found' : 'No purchase bills found. Create your first purchase bill.'}
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
        title="Purchase Bill Details"
        data={selectedBill}
        fields={[
          { key: 'billId', label: 'Bill ID' },
          { key: 'supplierName', label: 'Supplier Name' },
          { key: 'billDate', label: 'Bill Date' },
          { key: 'totalAmount', label: 'Total Amount', prefix: '$' },
          { key: 'supplierType', label: 'Supplier Type' },
          { key: 'status', label: 'Status' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'notes', label: 'Notes' }
        ]}
      />
    </div>
  );
};

export default PurchaseBills;