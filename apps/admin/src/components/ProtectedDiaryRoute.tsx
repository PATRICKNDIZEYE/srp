import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedDiaryRoute = ({ children }: { children: JSX.Element }) => {
  // Remove authentication logic
  return children;
};

export default ProtectedDiaryRoute; 