import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiUsers, FiDroplet, FiTruck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';

const POCDashboard = () => {
  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedTab, setSelectedTab] = useState('milk-submissions');

  // This would come from your backend
  const stats = {
    totalMilk: {
      current: '500L',
      pending: '150L',
      assigned: '250L',
      available: '100L',
    },
    farmers: {
      total: 48,
      active: 35,
      pending: 4,
    },
    quality: {
      passed: 95,
      failed: 5,
      pending: 8,
    },
    transport: {
      assigned: 15,
      pending: 3,
      completed: 12,
    }
  };

  // Dummy data
  const milkSubmissions = [
    {
      id: '1',
      date: '2024-02-20',
      farmerName: 'John Doe',
      farmerPhone: '0780000000',
      type: 'Inshushyu',
      quantity: '85L',
      status: 'Pending',
    },
    // Add more submissions...
  ];

  const pendingFarmers = [
    {
      id: '1',
      name: 'Alice Smith',
      phone: '0780000001',
      registrationDate: '2024-02-19',
      location: 'Kigali',
    },
    // Add more farmers...
  ];

  const handleConfirmMilk = (submissionId: string) => {
    toast.success('Milk submission confirmed successfully');
  };

  const handleRejectMilk = (submissionId: string) => {
    toast.success('Milk submission rejected');
  };

  const handleConfirmFarmer = (farmerId: string) => {
    toast.success('Farmer registration confirmed');
  };

  const handleAssignTransport = (submissionId: string) => {
    toast.success('Transport assigned successfully');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="POC Dashboard" />

      {/* Milk Collection Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Milk Collection Overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <CardDataStats
            title="Total Collection"
            total={stats.totalMilk.current}
            rate="Today's total"
            levelUp={true}
          >
            <FiDroplet className="text-primary" />
          </CardDataStats>

          <CardDataStats
            title="Pending Quality Check"
            total={stats.totalMilk.pending}
            rate="Needs verification"
            levelUp={false}
          >
            <FiAlertCircle className="text-yellow-500" />
          </CardDataStats>

          <CardDataStats
            title="Assigned to Transport"
            total={stats.totalMilk.assigned}
            rate="In transit"
            levelUp={true}
          >
            <FiTruck className="text-green-500" />
          </CardDataStats>

          <CardDataStats
            title="Available for Transport"
            total={stats.totalMilk.available}
            rate="Ready to assign"
            levelUp={true}
          >
            <FiCheckCircle className="text-blue-500" />
          </CardDataStats>
        </div>
      </div>

      {/* Farmer Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Farmer Management</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Registered Farmers</h3>
              <FiUsers className="text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">{stats.farmers.total}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Active Today</span>
                <span className="font-semibold">{stats.farmers.active}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Pending Approval</span>
                <span className="font-semibold">{stats.farmers.pending}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Quality Metrics</h3>
              <FiCheckCircle className="text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-green-600">
                <span>Passed</span>
                <span className="font-semibold">{stats.quality.passed}%</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Failed</span>
                <span className="font-semibold">{stats.quality.failed}%</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Pending Tests</span>
                <span className="font-semibold">{stats.quality.pending}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Transport Status</h3>
              <FiTruck className="text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-blue-600">
                <span>Assigned Today</span>
                <span className="font-semibold">{stats.transport.assigned}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Pending Assignment</span>
                <span className="font-semibold">{stats.transport.pending}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Completed Today</span>
                <span className="font-semibold">{stats.transport.completed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 bg-white rounded-lg shadow-lg">
        {/* Tabs & Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedTab('milk-submissions')}
                className={`px-4 py-2 rounded-lg ${
                  selectedTab === 'milk-submissions'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Milk Submissions
              </button>
              <button
                onClick={() => setSelectedTab('pending-farmers')}
                className={`px-4 py-2 rounded-lg ${
                  selectedTab === 'pending-farmers'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pending Farmers
              </button>
            </div>
            <DateRangeFilter
              dateRange={dateRange}
              selectedPeriod={selectedPeriod}
              onDateRangeChange={setDateRange}
              onPeriodChange={setSelectedPeriod}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            />
          </div>
        </div>

        {/* Content Based on Selected Tab */}
        <div className="p-6">
          {selectedTab === 'milk-submissions' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Farmer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {milkSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {submission.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{submission.farmerName}</div>
                        <div className="text-gray-500">{submission.farmerPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {submission.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {submission.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConfirmMilk(submission.id)}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleRejectMilk(submission.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAssignTransport(submission.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                          >
                            Assign Transport
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingFarmers.map((farmer) => (
                    <tr key={farmer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {farmer.registrationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {farmer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {farmer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {farmer.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleConfirmFarmer(farmer.id)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          Confirm Registration
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default POCDashboard; 