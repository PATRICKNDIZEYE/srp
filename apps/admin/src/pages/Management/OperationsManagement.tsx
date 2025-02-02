import React from 'react';
import { FiActivity, FiTruck, FiBox, FiAlertCircle } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';

const OperationsManagement = () => {
  const operations = {
    activeDeliveries: 12,
    productionStatus: 'Normal',
    qualityIssues: 2,
    efficiency: 94
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Operations Management" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Active Deliveries</h3>
              <p className="text-2xl font-bold">{operations.activeDeliveries}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiTruck className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Production Status</h3>
              <p className="text-2xl font-bold">{operations.productionStatus}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiBox className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Quality Issues</h3>
              <p className="text-2xl font-bold">{operations.qualityIssues}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiAlertCircle className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm">Efficiency</h3>
              <p className="text-2xl font-bold">{operations.efficiency}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiActivity className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Active Operations</h3>
        <div className="space-y-4">
          {/* Add operation items/table here */}
        </div>
      </div>
    </div>
  );
};

export default OperationsManagement; 