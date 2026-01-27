import { useState, useEffect } from 'react';
import { TrendingUp, Search, Package, Calendar, User, FileText, Filter } from 'lucide-react';
import { dispatchService } from '../services/dispatchService';
import '../styles/DispatchStock.css';

const DispatchHistory = () => {
  const [dispatchHistory, setDispatchHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDispatchHistory();
  }, []);

  const fetchDispatchHistory = async () => {
    try {
      const result = await dispatchService.getDispatchHistory();
      if (result.success) {
        setDispatchHistory(result.data);
      } else {
        console.error('Failed to fetch dispatch history:', result.error);
      }
    } catch (error) {
      console.error('Error fetching dispatch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = dispatchHistory.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stockId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="loading">Loading dispatch history...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📋 Dispatch History</h1>
          <p>View complete dispatch records and delivery status</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Dispatch Records</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by item, invoice, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dispatch ID</th>
                <th>Stock ID</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Invoice ID</th>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Dispatch Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.dispatchId || item.id}>
                    <td><strong>{item.dispatchId || item.id}</strong></td>
                    <td>{item.stockId}</td>
                    <td>
                      <div className="item-info">
                        <Package size={16} />
                        <span>{item.itemName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="stock-badge high">
                        {item.dispatchedQuantity} units
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={14} />
                        {item.invoiceId}
                      </div>
                    </td>
                    <td>{item.customerId}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} />
                        {item.customerName}
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <Calendar size={14} />
                        {item.dispatchDate}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        item.status === 'Delivered' ? 'success' : 
                        item.status === 'In Transit' ? 'warning' : 
                        'pending'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.notes || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
                    No dispatch records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Total Dispatches
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
              {dispatchHistory.length}
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #d1fae515 0%, #a7f3d015 100%)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Delivered
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669' }}>
              {dispatchHistory.filter(d => d.status === 'Delivered').length}
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #fef3c715 0%, #fde68a15 100%)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              In Transit
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d97706' }}>
              {dispatchHistory.filter(d => d.status === 'In Transit').length}
            </div>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #fee2e215 0%, #fecaca15 100%)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Pending
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
              {dispatchHistory.filter(d => d.status === 'Pending').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchHistory;
