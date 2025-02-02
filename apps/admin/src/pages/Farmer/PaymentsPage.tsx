import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { FiDownload, FiCalendar, FiFilter } from 'react-icons/fi';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';

const PaymentsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Dummy data for milk submissions
  const milkSubmissions = [
    {
      date: '2024-02-20',
      type: 'Inshushyu',
      quantity: '85L',
      status: 'Accepted',
      rate: 'RF 300/L',
      amount: 'RF 25,500',
    },
    {
      date: '2024-02-19',
      type: 'Ikivuguto',
      quantity: '75L',
      status: 'Rejected',
      rate: 'RF 300/L',
      amount: 'RF 0',
      reason: 'Failed quality test',
    },
    {
      date: '2024-02-18',
      type: 'Inshushyu',
      quantity: '90L',
      status: 'Pending',
      rate: 'RF 300/L',
      amount: 'Pending',
    },
  ];

  // Filter data based on selected filters
  const filterData = (data: any[]) => {
    let filtered = [...data];

    // Filter by date
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        return itemDate >= start && itemDate <= end;
      });
    } else if (selectedPeriod !== 'all') {
      const today = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= today;
      });
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    return filtered;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Payments & Submissions" />

      {/* Payment Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Next Payment</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-blue-600">RF 245,000</div>
            <div className="text-sm text-gray-500">Due in 8 days</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">RF 480,000</div>
            <div className="text-sm text-gray-500">From 1,600L of milk</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Total Earnings</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-800">RF 2,845,000</div>
            <div className="text-sm text-gray-500">Year to date</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Milk Submissions & Payments
            </h2>
            <div className="flex gap-4">
              <DateRangeFilter
                dateRange={dateRange}
                selectedPeriod={selectedPeriod}
                onDateRangeChange={setDateRange}
                onPeriodChange={setSelectedPeriod}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
              />
              <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                <FiDownload />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="px-6 border-t">
          <div className="flex space-x-4 -mb-px">
            {['All', 'Accepted', 'Pending', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status.toLowerCase())}
                className={`py-4 px-4 border-b-2 ${
                  status.toLowerCase() === selectedStatus
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterData(milkSubmissions).map((submission, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {submission.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        submission.status === 'Accepted'
                          ? 'bg-green-100 text-green-800'
                          : submission.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {submission.status}
                    </span>
                    {submission.reason && (
                      <div className="text-xs text-red-600 mt-1">{submission.reason}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage; 