import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedManagementRoute = ({ children }: { children: JSX.Element }) => {
  // Remove authentication logic
  return children;
};

export default ProtectedManagementRoute; 