import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const ServerWakeup = ({ onRetry }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderRadius: '12px',
      margin: '20px',
      border: '2px solid #f59e0b'
    }}>
      <RefreshCw size={48} color="#f59e0b" className="spinning" />
      <h3 style={{ color: '#92400e', marginTop: '20px', marginBottom: '10px' }}>
        Server is waking up{dots}
      </h3>
      <p style={{ color: '#78350f', textAlign: 'center', marginBottom: '20px' }}>
        The backend server is starting. This may take 30-60 seconds on first request.
      </p>
      <button 
        onClick={onRetry}
        style={{
          padding: '10px 20px',
          background: '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Retry Now
      </button>
    </div>
  );
};

export default ServerWakeup;
