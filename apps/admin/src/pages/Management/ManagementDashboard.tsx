import React from 'react';
import { FiUsers, FiDollarSign, FiTruck, FiBarChart2, FiSettings } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import StatsCard from '../../components/Dashboard/StatsCard';

const ManagementDashboard = () => {
  const stats = [
    {
      title: "Abahinzi Bose",
      value: "1,234",
      icon: <FiUsers className="w-6 h-6" />,
      change: "+12%",
      timespan: "Ukwezi"
    },
    {
      title: "Amata Yose",
      value: "45,678L",
      icon: <FiTruck className="w-6 h-6" />,
      change: "+23%",
      timespan: "Ukwezi"
    },
    {
      title: "Amafaranga Yose",
      value: "12.4M RWF",
      icon: <FiDollarSign className="w-6 h-6" />,
      change: "+8%",
      timespan: "Ukwezi"
    },
    {
      title: "POCs Zose",
      value: "48",
      icon: <FiBarChart2 className="w-6 h-6" />,
      change: "+4",
      timespan: "Ukwezi"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Management Dashboard" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ikigega</h1>
        <p className="text-gray-600">Incamake y'imibare y'ingenzi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Activity items */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <FiTruck className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">New delivery completed</p>
                <p className="text-sm text-gray-500">500L delivered to Production</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            {/* Add more activity items */}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {/* Metric items */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Production Efficiency</span>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            {/* Add more metrics */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard; 