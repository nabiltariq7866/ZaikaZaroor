import React from 'react';
import { Layout, Avatar, Dropdown, Button } from 'antd';
import { User, LogOut, Menu } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const DashboardHeader = ({ collapsed, onCollapseToggle }) => {
  const { user, logoutUser } = useApi();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const items = [
    { key: '1', label: 'My Profile', icon: <User size={16} />, onClick: () => navigate('/profile') }, // Dummy link
    { key: '2', label: 'Logout', icon: <LogOut size={16} />, danger: true, onClick: handleLogout },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: "1px solid #f0f0f0",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      <Button
        type="text"
        icon={<Menu size={20} />}
        onClick={onCollapseToggle}
      />
      
      <div className="flex items-center gap-3">
        <span className="font-medium text-gray-700 hidden sm:block">{user?.fullName}</span>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Avatar className="bg-orange-600 text-white cursor-pointer">
            {user?.fullName ? user.fullName[0].toUpperCase() : <User size={18} />}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
};

export default DashboardHeader;