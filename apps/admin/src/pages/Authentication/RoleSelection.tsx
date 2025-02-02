import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 1,
      title: 'Farmer',
      description: 'Register or login as a milk supplier',
      icon: '👨‍🌾',
      path: '/farmer/register',
      allowRegistration: true
    },
    {
      id: 2,
      title: 'Collection Point (POC)',
      description: 'Manage milk collection and testing',
      icon: '🏢',
      path: '/poc/signin',
      allowRegistration: false
    },
    {
      id: 3,
      title: 'Delivery/Transport',
      description: 'Manage milk transportation',
      icon: '🚛',
      path: '/transport/signin',
      allowRegistration: false
    },
    {
      id: 4,
      title: 'Production Site',
      description: 'Manage milk processing and production',
      icon: '🏭',
      path: '/production/signin',
      allowRegistration: false
    },
    {
      id: 5,
      title: 'Management',
      description: 'Admin, HR, and System Management',
      icon: '👥',
      path: '/management/signin',
      allowRegistration: false
    },
    {
      id: 6,
      title: 'Diary',
      description: 'Manage milk sales and inventory',
      icon: '🏪',
      path: '/diary/signin',
      allowRegistration: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Select Your Role
          </h2>
          <p className="text-gray-600">
            Choose your role to continue to the appropriate portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              onClick={() => navigate(role.path)}
            >
              <div className="p-6 cursor-pointer">
                <div className="text-4xl mb-4">{role.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <button
                  className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
                >
                  {role.allowRegistration ? 'Register/Login' : 'Login'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection; 