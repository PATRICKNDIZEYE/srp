import React from 'react';
import { FiDollarSign, FiDownload, FiTrendingUp } from 'react-icons/fi';

interface SalesHistoryProps {
  dateRange: { start: string; end: string };
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ dateRange }) => {
  // Dummy data - would come from backend
  const sales = [
    {
      id: '1',
      date: '2024-02-20',
      productType: 'Fresh Milk',
      quantity: '50L',
      pricePerLiter: 800,
      totalAmount: 40000,
      customer: 'Local Store',
      paymentMethod: 'Mobile Money',
      status: 'completed',
    },
    {
      id: '2',
      date: '2024-02-20',
      productType: 'Ikivuguto',
      quantity: '30L',
      pricePerLiter: 1000,
      totalAmount: 30000,
      customer: 'Restaurant A',
      paymentMethod: 'Cash',
      status: 'completed',
    },
    {
      id: '3',
      date: '2024-02-20',
      productType: 'Amavuta',
      quantity: '10L',
      pricePerLiter: 2500,
      totalAmount: 25000,
      customer: 'Supermarket B',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
    },
  ];

  const calculateTotals = () => {
    return {
      totalSales: sales.length,
      totalRevenue: sales.reduce((acc, sale) => acc + sale.totalAmount, 0),
      totalVolume: sales.reduce((acc, sale) => acc + parseInt(sale.quantity), 0),
      averagePrice: sales.reduce((acc, sale) => acc + sale.pricePerLiter, 0) / sales.length,
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Sales summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sales</p>
              <h4 className="text-2xl font-semibold">{totals.totalSales}</h4>
              <p className="text-sm text-green-600">Transactions</p>
            </div>
            <FiDollarSign className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h4 className="text-2xl font-semibold">
                {totals.totalRevenue.toLocaleString()} RWF
              </h4>
              <p className="text-sm text-green-600">+15% from last week</p>
            </div>
            <FiTrendingUp className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Volume</p>
              <h4 className="text-2xl font-semibold">{totals.totalVolume}L</h4>
              <p className="text-sm text-blue-600">All Products</p>
            </div>
            <FiDollarSign className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Average Price</p>
              <h4 className="text-2xl font-semibold">
                {Math.round(totals.averagePrice).toLocaleString()} RWF
              </h4>
              <p className="text-sm text-gray-600">Per Liter</p>
            </div>
            <FiDollarSign className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Sales table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Sales</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/L (RWF)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total (RWF)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.productType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.pricePerLiter.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        sale.paymentMethod === 'Mobile Money'
                          ? 'bg-green-100 text-green-800'
                          : sale.paymentMethod === 'Cash'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {sale.paymentMethod}
                    </span>
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

export default SalesHistory; 