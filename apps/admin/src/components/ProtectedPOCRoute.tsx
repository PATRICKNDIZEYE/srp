import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedPOCRoute = ({ children }: { children: React.ReactNode }) => {
  // Remove authentication logic
  return <>{children}</>;
};

export default ProtectedPOCRoute; 