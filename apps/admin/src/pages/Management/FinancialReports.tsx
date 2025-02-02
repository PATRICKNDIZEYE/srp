import React from 'react';
import { FiDownload, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';

const FinancialReports = () => {
  const financials = {
    revenue: 15000000,
    expenses: 8000000,
    profit: 7000000,
    growth: 12
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Financial Reports" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold">{financials.revenue.toLocaleString()} RWF</p>
          <div className="flex items-center text-green-600 text-sm">
            <FiTrendingUp />
            <span>+{financials.growth}% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Expenses</h3>
          <p className="text-2xl font-bold">{financials.expenses.toLocaleString()} RWF</p>
          <div className="flex items-center text-red-600 text-sm">
            <FiTrendingDown />
            <span>Major: Operations & Transport</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Net Profit</h3>
          <p className="text-2xl font-bold">{financials.profit.toLocaleString()} RWF</p>
          <div className="flex items-center text-blue-600 text-sm">
            <FiTrendingUp />
            <span>Healthy margin</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Monthly Overview</h3>
          <button className="flex items-center gap-2 text-blue-600">
            <FiDownload /> Export Report
          </button>
        </div>
        {/* Add chart or detailed breakdown here */}
      </div>
    </div>
  );
};

export default FinancialReports; 