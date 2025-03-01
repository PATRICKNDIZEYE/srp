import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiDroplet, FiDollarSign, FiCreditCard, FiSettings, FiLogOut } from 'react-icons/fi';
import DashboardHeader from '../components/Dashboard/DashboardHeader';

const FarmerLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/farmer/dashboard', icon: <FiHome />, label: 'Ahabanza' },
    { path: '/farmer/submit-milk', icon: <FiDroplet />, label: 'Gutanga Amata' },
    { path: '/farmer/payments', icon: <FiDollarSign />, label: 'Kwishyurwa' },
    { path: '/farmer/loan', icon: <FiCreditCard />, label: 'Inguzanyo' },
    { path: '/farmer/settings', icon: <FiSettings />, label: 'Igenamiterere' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardHeader onMenuButtonClick={toggleSidebar} role="farmer" />

      {/* Side Navigation and Content */}
      <div className="flex">
        <aside className={`w-64 bg-white shadow-sm h-[calc(100vh-4rem)] fixed lg:static transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <nav className="mt-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? 'bg-blue-50 text-blue-600' : ''
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : ''} p-8`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout; 