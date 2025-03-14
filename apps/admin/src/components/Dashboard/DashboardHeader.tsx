import React, { useEffect, useState, useRef } from 'react';
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
  const { user: contextUser } = useUserContext();
  const [user, setUser] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      if (Array.isArray(parsedUserData)) {
        setUser(parsedUserData[0]);
      } else {
        setUser(parsedUserData);
      }
    } else {
      setUser(contextUser);
    }
  }, [contextUser]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleLogoutVisibility = () => {
    setShowLogout(!showLogout);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuButtonClick}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <FiMenu size={24} />
          </button>
          <div className="text-xl font-semibold text-gray-800 truncate">
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

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleLogoutVisibility}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser size={20} />
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">
                {user ? 
                  (user.firstName || user.lastName ? `${user.firstName || user.lastName}` : user.phoneNumber) 
                  : 'Loading...'}
              </span>
            </button>

            {showLogout && (
              <div className="fixed top-16 right-4 w-48 bg-white rounded-lg shadow-xl py-1 border border-gray-100 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user ? 
                      (user.firstName || user.lastName ? `${user.firstName || user.lastName}` : user.phoneNumber) 
                      : 'Loading...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.phoneNumber}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors duration-150"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
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