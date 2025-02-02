import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 1,
      title: 'Diary Management System',
      description: 'Manage milk collection, quality control, and distribution',
      icon: '🥛',
      enabled: true,
      path: '/signin'
    },
    {
      id: 2,
      title: 'Sales Management System',
      description: 'Track and manage product sales and revenue',
      icon: '💰',
      enabled: false,
      path: '/sales'
    },
    {
      id: 3,
      title: 'Stock Management System',
      description: 'Monitor and control inventory levels',
      icon: '📦',
      enabled: false,
      path: '/stock'
    },
    {
      id: 4,
      title: 'Reports & Analytics',
      description: 'Generate insights and detailed reports',
      icon: '📊',
      enabled: false,
      path: '/reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to SRP
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Smart Resource Planning for Dairy Industry
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              whileHover={{ scale: module.enabled ? 1.05 : 1 }}
              className={`relative rounded-xl overflow-hidden shadow-lg ${
                module.enabled
                  ? 'bg-white cursor-pointer'
                  : 'bg-gray-100 cursor-not-allowed'
              }`}
              onClick={() => module.enabled && navigate(module.path)}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{module.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600">{module.description}</p>
                
                {!module.enabled && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 SRP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 