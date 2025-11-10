import React from 'react';
import { useApi } from '../../context/ApiContext';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import Cookies from 'js-cookie';
const PublicOnlyRoute = ({ children }) => {
  const {isAuthenticated, loading, user } = useApi();

  if (loading?.getProfile) {
    return <Spin fullscreen size="large" tip="Loading session..." />;
  }
  console.log(isAuthenticated)
  if (isAuthenticated) {    
    let redirectTo = '/'; // Default fallback
    
    if (user?.role === 'user') {
      redirectTo = '/dashboard';
    } else if (user?.role === 'owner') {
      redirectTo = '/owner/dashboard';
    } else if (user?.role === 'deliveryBoy') {
      redirectTo = '/delivery/dashboard';
    }

    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default PublicOnlyRoute;