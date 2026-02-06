import { X, Package, Eye } from 'lucide-react';
import '../styles/MobileEnhanced.css';
import '../styles/DynamicModal.css';

const ViewModal = ({ isOpen, onClose, title, data, fields }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <Eye size={20} />
            </div>
            <h3>{title}</h3>
          </div>
          <button 
            className="btn-icon delete"
            onClick={onClose}
            style={{ background: 'transparent', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="dynamic-details-grid">
            {fields.map((field, index) => (
              <div key={index} className="dynamic-detail-item">
                <div className="detail-label">{field.label}</div>
                <div className="detail-value">
                  {typeof data[field.key] === 'object' && data[field.key] !== null 
                    ? JSON.stringify(data[field.key]) 
                    : (field.prefix || '') + (data[field.key] || 'N/A') + (field.suffix || '')
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            <Package size={18} />
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;