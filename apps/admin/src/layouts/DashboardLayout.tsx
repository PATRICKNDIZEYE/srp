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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onMenuButtonClick={handleSidebarToggle} role={role} />
      <div className="pt-16 relative">
        <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
          {/* Sidebar */}
          <DashboardSidebar 
            role={role} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />

          {/* Main Content */}
          <div className="flex-1 overflow-x-hidden">
            <main className="h-full bg-gray-50">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 