import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  LogOut,
  ChevronRight,
  FileText,
  Users,
  Menu,
  X,
  Edit,
  Home,
  Truck,
  CheckCircle
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, onLogout, mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [productsOpen, setProductsOpen] = useState(true);
  const [dispatchOpen, setDispatchOpen] = useState(true);
  const [billingOpen, setBillingOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(true);
  const [courierOpen, setCourierOpen] = useState(true);

  // Auto-expand submenu based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/overview') || path.includes('/available-stocks') || path.includes('/income')) {
      setOverviewOpen(true);
    }
    if (path.includes('/products')) {
      setProductsOpen(true);
    }
    if (path.includes('/dispatch')) {
      setDispatchOpen(true);
    }
    if (path.includes('/billing')) {
      setBillingOpen(true);
    }
    if (path.includes('/users')) {
      setUsersOpen(true);
    }
    if (path.includes('/couriers') || path.includes('/shipments')) {
      setCourierOpen(true);
    }
  }, [location.pathname]);

  const menuItems = [
    {
      title: 'Home',
      icon: Home,
      path: '/dashboard/home'
    },
    {
      title: 'Overview',
      icon: BarChart3,
      path: '/dashboard/overview',
      submenu: [
        { title: 'Stock Summary', path: '/dashboard/overview' },
        { title: 'Available Stocks', path: '/dashboard/available-stocks' },
        { title: 'Procurement', path: '/dashboard/income' }
      ]
    },
    {
      title: 'Products',
      icon: Package,
      path: '/dashboard/products',
      submenu: [
        { title: 'Product List', path: '/dashboard/products', icon: Edit }
      ]
    },
    {
      title: 'Dispatch Stock',
      icon: TrendingUp,
      path: '/dashboard/dispatch',
      submenu: [
        { title: 'Dispatch Items', path: '/dashboard/dispatch', icon: TrendingUp },
        { title: 'Dispatch History', path: '/dashboard/dispatch/history', icon: TrendingUp }
      ]
    },
    {
      title: 'Billing',
      icon: FileText,
      path: '/dashboard/billing',
      submenu: [
        { title: 'Invoice', path: '/dashboard/billing/invoice', icon: FileText }
      ]
    },
    {
      title: 'Users',
      icon: Users,
      path: '/dashboard/users',
      submenu: [
        { title: 'Customers', path: '/dashboard/users/customers', icon: Users },
        { title: 'Suppliers', path: '/dashboard/users/suppliers', icon: Users }
      ]
    },
    {
      title: 'Courier Service',
      icon: Truck,
      path: '/dashboard/couriers',
      submenu: [
        { title: 'Manage Couriers', path: '/dashboard/couriers', icon: Truck },
        { title: 'Shipment Tracking', path: '/dashboard/shipments', icon: Package },
        { title: 'Shipment History', path: '/dashboard/shipments/history', icon: CheckCircle }
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;
  
  const isParentActive = (submenu) => {
    return submenu.some(subItem => location.pathname === subItem.path);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Open Sidebar' : 'Close Sidebar'}
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>
      
      <div className="sidebar-header">
        <h2>{collapsed ? 'INV' : 'Inventory'}</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          // If no submenu, render as simple link
          if (!item.submenu) {
            return (
              <Link
                key={item.title}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={onMobileClose}
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          }
          
          // Render with submenu
          const isOverview = item.title === 'Overview';
          const isProducts = item.title === 'Products';
          const isDispatch = item.title === 'Dispatch Stock';
          const isBilling = item.title === 'Billing';
          const isUsers = item.title === 'Users';
          const isCourier = item.title === 'Courier Service';
          
          const getToggleState = () => {
            if (isOverview) return overviewOpen;
            if (isProducts) return productsOpen;
            if (isDispatch) return dispatchOpen;
            if (isBilling) return billingOpen;
            if (isUsers) return usersOpen;
            if (isCourier) return courierOpen;
            return true;
          };
          
          const handleToggle = (e) => {
            if (collapsed) {
              e.stopPropagation();
              setCollapsed(false);
              if (isOverview) setOverviewOpen(true);
              if (isProducts) setProductsOpen(true);
              if (isDispatch) setDispatchOpen(true);
              if (isBilling) setBillingOpen(true);
              if (isUsers) setUsersOpen(true);
              if (isCourier) setCourierOpen(true);
              navigate(item.submenu[0].path);
              return;
            }
            if (isOverview) setOverviewOpen(!overviewOpen);
            if (isProducts) setProductsOpen(!productsOpen);
            if (isDispatch) setDispatchOpen(!dispatchOpen);
            if (isBilling) setBillingOpen(!billingOpen);
            if (isUsers) setUsersOpen(!usersOpen);
            if (isCourier) setCourierOpen(!courierOpen);
          };
          
          return (
            <div key={item.title} className="nav-group">
              <div 
                className={`nav-item ${isParentActive(item.submenu) ? 'active' : ''}`}
                onClick={handleToggle}
                style={{ cursor: 'pointer' }}
              >
                <Icon size={20} />
                <span>{item.title}</span>
                <ChevronRight size={16} className={`chevron ${getToggleState() ? 'rotated' : ''}`} />
              </div>
              
              <div className={`submenu ${!getToggleState() || collapsed ? 'collapsed' : ''}`}>
                {item.submenu.map((subItem) => {
                  const SubIcon = subItem.icon;
                  return (
                    <Link
                      key={subItem.title}
                      to={subItem.path}
                      className={`submenu-item ${isActive(subItem.path) ? 'active' : ''}`}
                      onClick={onMobileClose}
                    >
                      {SubIcon && <SubIcon size={16} />}
                      <span>{subItem.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;