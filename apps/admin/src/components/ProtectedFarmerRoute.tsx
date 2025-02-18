import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const ProtectedFarmerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Remove authentication logic
  return <>{children}</>;
};

export default ProtectedFarmerRoute; 