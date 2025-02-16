import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedManagementRouteProps {
  children: React.ReactNode;
}

const ProtectedManagementRoute: React.FC<ProtectedManagementRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Check for management token
  const token = localStorage.getItem('mgmt_token');
  const user = JSON.parse(localStorage.getItem('mgmt_user') || '{}');

  // Verify if user is management
  const isManagement = user.role === 'super_admin' || user.role === 'admin';

  if (!token || !isManagement) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/management/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedManagementRoute; 