import React, { useEffect, useState } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserContext } from '../../context/UserContext';

interface DashboardHeaderProps {
  onMenuButtonClick: () => void;
  role: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuButtonClick, role }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData[0]); // Assuming the user data is an array and we need the first user
    }
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    sessionStorage.clear();
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleLogoutVisibility = () => {
    setShowLogout(!showLogout);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuButtonClick}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <FiMenu size={24} />
          </button>
          <div className="text-xl font-semibold text-gray-800">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 relative">
            <FiBell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={toggleLogoutVisibility}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <FiUser size={20} />
              <span className="hidden md:inline">
                {user ? 
                  (user.firstName || user.lastName ? `${user.firstName || user.lastName}` : user.phoneNumber) 
                  : 'Loading...'}
              </span>
            </button>

            {showLogout && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <FiLogOut size={16} />
                  <span>Sohoka</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 