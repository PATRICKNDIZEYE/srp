import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FarmerDashboard from '../pages/Farmer/Dashboard';
import SubmitMilk from '../pages/Farmer/SubmitMilk';
import Payments from '../pages/Farmer/Payments';
import Loans from '../pages/Farmer/Loans';
import FarmerLayout from '../layouts/FarmerLayout';

const FarmerRoutes = () => {
  return (
    <Routes>
      <Route element={<FarmerLayout />}>
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="submit-milk" element={<SubmitMilk />} />
        <Route path="payments" element={<Payments />} />
        <Route path="loan" element={<Loans />} />
        <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default FarmerRoutes; 