import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedTransportRoute = ({ children }: { children: JSX.Element }) => {
  // Remove authentication logic
  return children;
};

export default ProtectedTransportRoute; 