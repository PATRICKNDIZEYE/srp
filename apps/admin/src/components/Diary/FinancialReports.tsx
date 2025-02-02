import React, { useState } from 'react';
import { FiDollarSign, FiDownload, FiPieChart, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface FinancialReportsProps {
  period: string;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ period }) => {
  const [reportType, setReportType] = useState('daily');

  const financialData = {
    revenue: {
      fresh: 450000,
      fermented: 280000,
      cream: 180000,
      total: 910000,
      previousPeriod: 850000
    },
    expenses: {
      operations: 120000,
      transport: 80000,
      maintenance: 50000,
      other: 30000,
      total: 280000,
      previousPeriod: 260000
    },
    profit: {
      current: 630000,
      previousPeriod: 590000
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Reports</h2>
        <button
          onClick={() => console.log('Downloading report...')}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center space-x-2"
        >
          <FiDownload />
          <span>Download Full Report</span>
        </button>
      </div>

      {/* Report type selector */}
      <div className="flex space-x-4 mb-6">
        {['daily', 'weekly', 'monthly'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg ${
              reportType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Financial summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <FiTrendingUp className={`text-2xl ${
              calculateGrowth(financialData.revenue.total, financialData.revenue.previousPeriod) >= 0
                ? 'text-green-500'
                : 'text-red-500'
            }`} />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {financialData.revenue.total.toLocaleString()} RWF
            </div>
            <div className={`text-sm ${
              calculateGrowth(financialData.revenue.total, financialData.revenue.previousPeriod) >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {calculateGrowth(financialData.revenue.total, financialData.revenue.previousPeriod).toFixed(1)}% from last period
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Fresh Milk</span>
              <span className="font-medium">{financialData.revenue.fresh.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Ikivuguto</span>
              <span className="font-medium">{financialData.revenue.fermented.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amavuta</span>
              <span className="font-medium">{financialData.revenue.cream.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Expenses</h3>
            <FiTrendingDown className={`text-2xl ${
              calculateGrowth(financialData.expenses.total, financialData.expenses.previousPeriod) >= 0
                ? 'text-red-500'
                : 'text-green-500'
            }`} />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {financialData.expenses.total.toLocaleString()} RWF
            </div>
            <div className={`text-sm ${
              calculateGrowth(financialData.expenses.total, financialData.expenses.previousPeriod) >= 0
                ? 'text-red-600'
                : 'text-green-600'
            }`}>
              {calculateGrowth(financialData.expenses.total, financialData.expenses.previousPeriod).toFixed(1)}% from last period
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Operations</span>
              <span className="font-medium">{financialData.expenses.operations.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transport</span>
              <span className="font-medium">{financialData.expenses.transport.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Maintenance</span>
              <span className="font-medium">{financialData.expenses.maintenance.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Other</span>
              <span className="font-medium">{financialData.expenses.other.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Net Profit</h3>
            <FiPieChart className="text-2xl text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {financialData.profit.current.toLocaleString()} RWF
            </div>
            <div className={`text-sm ${
              calculateGrowth(financialData.profit.current, financialData.profit.previousPeriod) >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {calculateGrowth(financialData.profit.current, financialData.profit.previousPeriod).toFixed(1)}% from last period
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full"
                style={{ width: `${(financialData.profit.current / financialData.revenue.total) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Profit Margin: {((financialData.profit.current / financialData.revenue.total) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports; 