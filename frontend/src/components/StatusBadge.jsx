import '../styles/StatusBadges.css';

const StatusBadge = ({ status, children, className = '' }) => {
  const getStatusClass = (status) => {
    if (typeof status === 'boolean') {
      return status ? 'success' : 'danger';
    }
    
    const statusLower = status?.toString().toLowerCase();
    
    // Green - Good/High/Success
    if (['delivered', 'completed', 'success', 'active', 'high', 'good', 'in stock'].includes(statusLower)) {
      return 'success';
    }
    
    // Yellow - Pending/In Transit
    if (['in transit', 'pending', 'processing'].includes(statusLower)) {
      return 'warning';
    }
    
    // Orange - Out for Delivery
    if (['out for delivery', 'warning', 'medium', 'normal'].includes(statusLower)) {
      return 'orange';
    }
    
    // Red - Low/Bad/Critical/Danger
    if (['cancelled', 'failed', 'error', 'danger', 'critical', 'low', 'low stock', 'very low', 'out of stock', 'bad', 'inactive'].includes(statusLower)) {
      return 'danger';
    }
    
    return 'info';
  };

  const statusClass = getStatusClass(status);
  
  return (
    <span className={`status-badge ${statusClass} ${className}`}>
      {children || status}
    </span>
  );
};

export default StatusBadge;