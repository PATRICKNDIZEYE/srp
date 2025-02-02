import React from 'react';
import { FiUsers, FiDollarSign, FiTruck, FiBox, FiMapPin, FiActivity } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';

const AnalyticsDashboard = () => {
  const stats = {
    totalMilk: 25000,
    activePOCs: 12,
    activeDiaries: 8,
    totalFarmers: 450,
    totalEmployees: 120,
    totalRevenue: 15000000,
    activeLoans: 25,
    deliveriesToday: 45
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="System Analytics" />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Total Milk Collection</h3>
              <p className="text-2xl font-bold">{stats.totalMilk}L</p>
              <p className="text-sm text-green-600">From {stats.activePOCs} POCs</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiBox className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Active Sites</h3>
              <p className="text-2xl font-bold">{stats.activeDiaries + stats.activePOCs}</p>
              <p className="text-sm text-blue-600">{stats.activeDiaries} Diaries, {stats.activePOCs} POCs</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiMapPin className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Total Revenue</h3>
              <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} RWF</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiDollarSign className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Active Loans</h3>
              <p className="text-2xl font-bold">{stats.activeLoans}</p>
              <p className="text-sm text-orange-600">To Qualified Farmers</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FiDollarSign className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* HR Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiUsers className="text-blue-600" />
            Human Resources Overview
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Total Employees</span>
                <span className="text-sm text-gray-500">{stats.totalEmployees}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Active POC Workers</span>
                <span className="text-sm text-gray-500">45</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Diary Workers</span>
                <span className="text-sm text-gray-500">35</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operations Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiActivity className="text-green-600" />
            Operations Overview
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Today's Deliveries</h4>
                <p className="text-xl font-semibold">{stats.deliveriesToday}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Active Transporters</h4>
                <p className="text-xl font-semibold">15</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Equipment Status</h4>
                <p className="text-xl font-semibold text-green-600">92%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Quality Issues</h4>
                <p className="text-xl font-semibold text-red-600">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiDollarSign className="text-purple-600" />
          Financial Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Milk Payments</h4>
            <p className="text-2xl font-bold">8.5M RWF</p>
            <p className="text-sm text-green-600">To Farmers</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Active Loans</h4>
            <p className="text-2xl font-bold">2.3M RWF</p>
            <p className="text-sm text-blue-600">25 Active Loans</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Transport Costs</h4>
            <p className="text-2xl font-bold">1.2M RWF</p>
            <p className="text-sm text-orange-600">This Month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 