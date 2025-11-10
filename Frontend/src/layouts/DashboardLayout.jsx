import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/shared/DashboardSidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { useApi } from '../context/ApiContext';

const { Content } = Layout;

const DashboardLayout = () => {
  const { user } = useApi();
  const [collapsed, setCollapsed] = useState(false);

  // Sidebar ki width
  const sidebarWidth = collapsed ? 80 : 250;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar
        collapsed={collapsed}
        userRole={user?.role}
      />
      <Layout 
        style={{ 
          marginLeft: sidebarWidth, 
          transition: 'margin-left 0.2s',
          background: '#f5f5f5' // Light grey background
        }}
      >
        <DashboardHeader
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed(!collapsed)}
        />
        <Content 
          style={{ 
            padding: '24px', 
            minHeight: 'calc(100vh - 64px)', // 64px header ki height
            overflow: 'auto' 
          }}
        >
          {/* Aapke purane project ki tarah, white content area */}
          <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;