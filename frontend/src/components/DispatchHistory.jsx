import { useState, useEffect } from 'react';
import { TrendingUp, Search, Package, Calendar, User, FileText, Filter } from 'lucide-react';
import { dispatchService } from '../services/dispatchService';
import StatusBadge from './StatusBadge';
import Badge from './Badge';
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
      const token = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!token);
      if (!token) {
        console.error('No auth token found');
        setDispatchHistory([]);
        setLoading(false);
        return;
      }
      const result = await dispatchService.getDispatchHistory();
      console.log('Dispatch history result:', result);
      if (result.success) {
        setDispatchHistory(result.data || []);
      } else {
        console.error('Failed to fetch:', result.error);
        setDispatchHistory([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setDispatchHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = dispatchHistory.filter(item => {
    const matchesSearch = 
      (item.itemName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.stockId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.invoiceId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div className="stat-content">
            <h3>Total Dispatches</h3>
            <p className="stat-value">{dispatchHistory.length}</p>
            <span className="stat-label">All time records</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <Package size={24} color="#059669" />
          </div>
          <div className="stat-content">
            <h3>Delivered</h3>
            <p className="stat-value">{dispatchHistory.filter(d => d.status === 'Delivered').length}</p>
            <span className="stat-label">Successfully delivered</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <TrendingUp size={24} color="#d97706" />
          </div>
          <div className="stat-content">
            <h3>In Transit</h3>
            <p className="stat-value">{dispatchHistory.filter(d => d.status === 'In Transit').length}</p>
            <span className="stat-label">On the way</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <Package size={24} color="#dc2626" />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{dispatchHistory.filter(d => d.status === 'Pending').length}</p>
            <span className="stat-label">Awaiting dispatch</span>
          </div>
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
                    <td><Badge variant="blue">{item.dispatchId || item.id || 'N/A'}</Badge></td>
                    <td><Badge variant="gray">{item.stockId || 'N/A'}</Badge></td>
                    <td><Badge variant="blue">{item.itemName || 'N/A'}</Badge></td>
                    <td><Badge variant="green">{item.dispatchedQuantity || 0} units</Badge></td>
                    <td><Badge variant="gray">{item.invoiceId || 'N/A'}</Badge></td>
                    <td><Badge variant="blue">{item.customerId || 'N/A'}</Badge></td>
                    <td><Badge variant="gray">{item.customerName || 'N/A'}</Badge></td>
                    <td><Badge variant="blue">{item.dispatchDate || 'N/A'}</Badge></td>
                    <td>
                      <StatusBadge status={item.status || 'Pending'} />
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
      </div>
    </div>
  );
};

export default DispatchHistory;
