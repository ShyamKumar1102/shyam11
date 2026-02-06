import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AddPurchaseOrder = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/dashboard/procurement')}>
        <ArrowLeft size={18} />
        Back
      </button>
      <h1>Add Purchase Order - Test Version</h1>
      <p>API URL: {import.meta.env.VITE_API_BASE_URL || 'NOT SET'}</p>
      <p>If you see this, the component loads correctly.</p>
    </div>
  );
};

export default AddPurchaseOrder;
