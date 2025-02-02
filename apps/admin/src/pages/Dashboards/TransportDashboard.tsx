import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiTruck, FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';
import ChartTwo from '../../components/Charts/ChartTwo';

const TransportDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Transport Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Active Deliveries"
          total="8"
          rate="On Track"
          levelUp={true}
        >
          <FiTruck className="fill-primary dark:fill-white" />
        </CardDataStats>

        <CardDataStats
          title="Total Routes Today"
          total="12"
          rate="2 Completed"
          levelUp={true}
        >
          <FiMapPin className="fill-primary dark:fill-white" />
        </CardDataStats>

        <CardDataStats
          title="Average Delivery Time"
          total="45 min"
          rate="5min faster"
          levelUp={true}
        >
          <FiClock className="fill-primary dark:fill-white" />
        </CardDataStats>

        <CardDataStats
          title="Pending Collections"
          total="4"
          rate="Urgent"
          levelUp={false}
        >
          <FiAlertCircle className="fill-primary dark:fill-white" />
        </CardDataStats>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Delivery Performance Chart */}
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Delivery Performance</h3>
          <ChartTwo />
        </div>

        {/* Active Routes */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Active Routes</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((route) => (
              <div key={route} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Route #{route}</span>
                  <span className="text-green-600">In Progress</span>
                </div>
                <div className="text-sm text-gray-600">
                  3 Stops • Est. completion: 2 hours
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>Volume: 850L</span>
                  <span>Distance: 12km</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Schedule */}
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Today's Schedule</h3>
            <button className="text-blue-600 hover:underline">View Full Schedule</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Volume</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">09:00 AM</td>
                  <td>Kigali POC #1</td>
                  <td>450 L</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">10:30 AM</td>
                  <td>Gasabo POC #3</td>
                  <td>380 L</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      In Progress
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Vehicle Status</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Truck RAA 123K</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="text-sm text-gray-600">
                Driver: John Doe • Fuel: 75%
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Last Maintenance: 3 days ago
              </div>
            </div>
            {/* Add more vehicle status cards */}
          </div>
          <button className="w-full mt-4 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100">
            View Fleet Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard; 