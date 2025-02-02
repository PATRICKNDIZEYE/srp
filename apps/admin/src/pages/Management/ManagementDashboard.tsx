import React from 'react';
import { FiUsers, FiDollarSign, FiTruck, FiBox, FiBarChart2 } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';

const ManagementDashboard = () => {
  const stats = {
    totalUsers: 150,
    activeUsers: 120,
    totalRevenue: 15000000,
    deliveries: 45,
    production: 2500,
    efficiency: 92
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Management Dashboard" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              <p className="text-sm text-green-600">{stats.activeUsers} active</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} RWF</h3>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiDollarSign className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Production</p>
              <h3 className="text-2xl font-bold">{stats.production}L</h3>
              <p className="text-sm text-blue-600">{stats.efficiency}% efficiency</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiBox className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
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