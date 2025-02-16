import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  role: 'farmer' | 'poc' | 'transport' | 'production' | 'management' | 'diary';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (role === 'management') {
      localStorage.removeItem('mgmt_token');
      localStorage.removeItem('mgmt_user');
    }
    // ... handle other role logouts

    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar 
        role={role} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader 
          onMenuButtonClick={() => setSidebarOpen(true)}
          role={role}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 