import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Home from './Home';
import Stock from './Stock';
import AddStock from './AddStock';
import UpdateStock from './UpdateStock';
import Products from './Products';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import DispatchStock from './DispatchStock';
import DispatchHistory from './DispatchHistory';
import Procurement from './Procurement';
import AvailableStocks from './AvailableStocks';
import Invoice from './Invoice';
import CreateInvoice from './CreateInvoice';
import AutoGenerateInvoice from './AutoGenerateInvoice';
import PurchaseBills from './PurchaseBills';
import PurchaseBill from './PurchaseBill';
import Customer from './Customer';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import Supplier from './Supplier';
import AddSupplier from './AddSupplier';
import EditSupplier from './EditSupplier';
import Couriers from './Couriers';
import AddCourier from './AddCourier';
import EditCourier from './EditCourier';
import Shipments from './Shipments';
import AddPurchaseOrder from './AddPurchaseOrder';
import ShipmentHistory from './ShipmentHistory';
import ErrorBoundary from './ErrorBoundary';
import '../styles/Dashboard.css';

const Dashboard = ({ setAuth }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setAuth(false);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="dashboard">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        onMobileClose={closeMobileMenu}
      />
      
      {/* Enhanced Mobile Menu Toggle */}
      {isMobile && (
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <main className={`dashboard-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/overview" element={<Stock />} />
            <Route path="/stock/add" element={<AddStock />} />
            <Route path="/stock/update" element={<UpdateStock />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/dispatch" element={<DispatchStock />} />
            <Route path="/dispatch/history" element={<DispatchHistory />} />
            <Route path="/available-stocks" element={<AvailableStocks />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/purchase-orders/add" element={<AddPurchaseOrder />} />
            <Route path="/billing/invoice" element={<Invoice />} />
            <Route path="/billing/invoice/create" element={<CreateInvoice />} />
            <Route path="/billing/invoice/auto-generate" element={<AutoGenerateInvoice />} />
            <Route path="/billing/purchase-bills" element={<PurchaseBills />} />
            <Route path="/billing/purchase-bill/create" element={<PurchaseBill />} />
            <Route path="/users/customers" element={<Customer />} />
            <Route path="/users/customers/add" element={<AddCustomer />} />
            <Route path="/users/customers/edit" element={<EditCustomer />} />
            <Route path="/users/suppliers" element={<Supplier />} />
            <Route path="/users/suppliers/add" element={<AddSupplier />} />
            <Route path="/users/suppliers/edit" element={<EditSupplier />} />
            <Route path="/couriers" element={<Couriers />} />
            <Route path="/couriers/add" element={<AddCourier />} />
            <Route path="/couriers/edit" element={<EditCourier />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/shipments/history" element={<ShipmentHistory />} />

          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default Dashboard;