import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiDroplet, FiDollarSign, FiCreditCard, FiSettings, FiLogOut } from 'react-icons/fi';

const FarmerLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">SRP System</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user.firstName} {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600"
              >
                <FiLogOut className="mr-2" />
                Sohoka
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation and Content */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] fixed">
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

        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout; 