import { Package, TrendingUp, FileText, Users, BarChart3, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService, stockService, orderService } from '../services/productService';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
    totalOrders: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, stocksRes, ordersRes] = await Promise.all([
        productService.getProducts().catch(() => ({ success: false, data: [] })),
        stockService.getStock().catch(() => ({ success: false, data: [] })),
        orderService.getOrders().catch(() => ({ success: false, data: [] }))
      ]);

      const products = productsRes.success ? productsRes.data : [];
      const stocks = stocksRes.success ? stocksRes.data : [];
      const orders = ordersRes.success ? ordersRes.data : [];

      const totalStock = stocks.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const lowStock = products.filter(p => (p.quantity || 0) < 10).length;

      setStats({
        totalProducts: products.length,
        totalStock,
        lowStockItems: lowStock,
        totalOrders: orders.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const sections = [
    {
      title: 'Overview',
      icon: BarChart3,
      color: '#3b82f6',
      description: 'View stock summary, available stocks, and procurement orders.',
      path: '/dashboard/overview'
    },
    {
      title: 'Products',
      icon: Package,
      color: '#22c55e',
      description: 'Manage products with auto-generated barcodes and categories.',
      path: '/dashboard/products'
    },
    {
      title: 'Dispatch Stock',
      icon: Truck,
      color: '#f59e0b',
      description: 'Dispatch items and track delivery status.',
      path: '/dashboard/dispatch'
    },
    {
      title: 'Billing',
      icon: FileText,
      color: '#8b5cf6',
      description: 'Generate invoices with auto-filled customer details.',
      path: '/dashboard/billing/invoice'
    },
    {
      title: 'Users',
      icon: Users,
      color: '#06b6d4',
      description: 'Manage customers and suppliers.',
      path: '/dashboard/users/customers'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Inventory Management System</h1>
        <p>Complete overview of your inventory operations and management tools</p>
      </div>

      <div className="stats-summary">
        <div className="stat-box">
          <Package size={32} color="#3b82f6" />
          <div>
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-box">
          <TrendingUp size={32} color="#22c55e" />
          <div>
            <h3>{stats.totalStock}</h3>
            <p>Total Stock Units</p>
          </div>
        </div>
        <div className="stat-box">
          <BarChart3 size={32} color="#f59e0b" />
          <div>
            <h3>{stats.lowStockItems}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
        <div className="stat-box">
          <FileText size={32} color="#8b5cf6" />
          <div>
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
      </div>

      <div className="sections-overview">
        <h2>System Sections</h2>
        <div className="sections-grid">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={index} 
                className="section-card"
                onClick={() => navigate(section.path)}
                style={{ cursor: 'pointer' }}
              >
                <div className="section-header">
                  <div className="section-icon" style={{ backgroundColor: `${section.color}15` }}>
                    <Icon size={28} style={{ color: section.color }} />
                  </div>
                  <h3>{section.title}</h3>
                </div>
                <p className="section-description">{section.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
