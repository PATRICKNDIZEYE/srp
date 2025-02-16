import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiTruck, 
  FiPackage, 
  FiUsers, 
  FiSettings,
  FiBarChart2,
  FiDatabase,
  FiFileText,
  FiDollarSign,
  FiMap,
  FiCheckCircle,
  FiShoppingCart,
  FiActivity,
  FiUser,
  FiDroplet,
  FiCreditCard
} from 'react-icons/fi';

interface SidebarProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const menuItems = {
    farmer: [
      { name: 'AHABANZA', icon: FiHome, path: '/farmer/dashboard' },
      { name: 'AMATA', icon: FiDroplet, path: '/farmer/submit-milk' },
      { name: 'UBWISHYU', icon: FiDollarSign, path: '/farmer/payments' },
      { name: 'INGUZANYO', icon: FiCreditCard, path: '/farmer/loan' },
      { name: 'IGENAMITERERE', icon: FiSettings, path: '/farmer/settings' },
    ],
    poc: [
      { name: 'Dashboard', icon: FiHome, path: '/poc/dashboard' },
      { name: 'Farmer Management', icon: FiUsers, path: '/poc/farmers' },
      { name: 'Milk Submissions', icon: FiDroplet, path: '/poc/submissions' },
      { name: 'Delivery Management', icon: FiTruck, path: '/poc/deliveries' },
      { name: 'Settings', icon: FiSettings, path: '/poc/settings' },
    ],
    transport: [
      { name: 'Dashboard', icon: FiHome, path: '/transport/dashboard' },
      { name: 'Assigned Deliveries', icon: FiTruck, path: '/transport/deliveries' },
      { name: 'Settings', icon: FiSettings, path: '/transport/settings' },
    ],
    production: [
      { name: 'Dashboard', icon: FiHome, path: '/production/dashboard' },
      { name: 'Deliveries', icon: FiTruck, path: '/production/deliveries' },
      { name: 'Sales', icon: FiFileText, path: '/production/sales' },
      { name: 'Settings', icon: FiSettings, path: '/production/settings' },
    ],
    diary: [
      { name: 'Dashboard', icon: FiHome, path: '/diary/dashboard' },
      { name: 'Operations', icon: FiActivity, path: '/diary/operations' },
      { name: 'Receive Milk', icon: FiDroplet, path: '/diary/receiving' },
      { name: 'Sales', icon: FiDollarSign, path: '/diary/sales' },
      { name: 'Financial Reports', icon: FiBarChart2, path: '/diary/finances' },
      { name: 'Settings', icon: FiSettings, path: '/diary/settings' },
    ],
    management: [
      { name: 'Dashboard', icon: FiHome, path: '/management/dashboard' },
      { name: 'User Management', icon: FiUsers, path: '/management/users' },
      { name: 'Financial Reports', icon: FiDollarSign, path: '/management/finance' },
      { name: 'Operations', icon: FiActivity, path: '/management/operations' },
      { name: 'Analytics', icon: FiBarChart2, path: '/management/analytics' },
      { name: 'Settings', icon: FiSettings, path: '/management/settings' },
    ],
  };

  const currentMenuItems = menuItems[role as keyof typeof menuItems] || [];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-600">
            <span className="text-white text-xl font-bold">SRP System</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {currentMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? 'bg-blue-50 text-blue-600' : ''
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser size={20} />
              </div>
              <div>
                <div className="font-medium">RSP DEMO</div>
                <div className="text-sm text-gray-500">{role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar; 