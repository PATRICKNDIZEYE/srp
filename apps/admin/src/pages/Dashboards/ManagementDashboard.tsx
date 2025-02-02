import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiUsers, FiDollarSign, FiTruck, FiActivity } from 'react-icons/fi';
import ChartTwo from '../../components/Charts/ChartTwo';

const ManagementDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Management Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Revenue"
          total="RF 1.2M"
          rate="12% up"
          levelUp={true}
        >
          <FiDollarSign />
        </CardDataStats>

        <CardDataStats
          title="Active Users"
          total="245"
          rate="15 new"
          levelUp={true}
        >
          <FiUsers />
        </CardDataStats>

        <CardDataStats
          title="Operations"
          total="85%"
          rate="Efficient"
          levelUp={true}
        >
          <FiActivity />
        </CardDataStats>

        <CardDataStats
          title="Fleet Status"
          total="12/15"
          rate="Active"
          levelUp={true}
        >
          <FiTruck />
        </CardDataStats>
      </div>

      {/* System Overview */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">System Performance</h3>
          <ChartTwo />
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              'Generate Reports',
              'User Management',
              'System Settings',
              'Financial Overview'
            ].map((action) => (
              <button
                key={action}
                className="w-full p-3 text-left border rounded hover:bg-blue-50 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard; 