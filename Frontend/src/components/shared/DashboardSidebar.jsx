import React from 'react';
import { Layout, Menu, Button, Avatar } from 'antd';
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Store, 
  ClipboardList,
  User,
  Utensils
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Item from 'antd/es/list/Item';

const { Sider } = Layout;

// --- Har Role Ke Liye Menu Items ---

// 1. Regular User ke liye
const userItems = [
  { key: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { key: '/my-orders', icon: <Package size={18} />, label: 'My Orders' },
  { key: '/profile', icon: <User size={18} />, label: 'My Profile' },
];

// 2. Restaurant Owner ke liye
const ownerItems = [
  { key: '/owner/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { key: '/owner/my-shop', icon: <Store size={18} />, label: 'My Shop' },
  { key: '/owner/my-item', icon: <Utensils size={18} />, label: 'Food item' },
  { key: '/owner/orders', icon: <Package size={18} />, label: 'Manage Orders' },
  { key: '/owner/menu', icon: <ClipboardList size={18} />, label: 'Manage Menu' },
];

// 3. Delivery Boy ke liye
const deliveryBoyItems = [
  { key: '/delivery/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { key: '/delivery/tasks', icon: <ClipboardList size={18} />, label: 'Delivery Tasks' },
  { key: '/delivery/profile', icon: <User size={18} />, label: 'Profile' },
];

const DashboardSidebar = ({ collapsed, userRole }) => {
  const { logoutUser } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (userRole) {
      case 'owner': return ownerItems;
      case 'deliveryBoy': return deliveryBoyItems;
      case 'user':
      default:
        return userItems;
    }
  };

  const menuItems = getMenuItems();
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || menuItems[0]?.key;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: '#fff',
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Link to="/" className={`text-2xl font-bold ${collapsed ? 'text-orange-600' : 'text-gray-800'}`}>
          {collapsed ? 'Z' : 
            <span><span className="text-orange-600">Z</span>aika<span className="text-orange-600">Z</span>aroor</span>
          }
        </Link>
      </div>

      {/* 2. Menu (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(item) => navigate(item.key)}
          style={{ border: 'none', padding: '8px' }}
        />
      </div>

      {/* 3. Logout (Fixed at bottom) */}
      <div className="border-t border-gray-200 p-2">
        <Button
          type="text"
          danger
          block
          icon={<LogOut size={16} />}
          onClick={handleLogout}
          className="flex items-center justify-center"
        >
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </Sider>
  );
};

export default DashboardSidebar;