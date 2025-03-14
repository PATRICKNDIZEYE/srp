import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiDownload, FiTrendingUp, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';
import { Sale } from '../../types'; // Assuming you have a types file where Sale is defined
import * as XLSX from 'xlsx'; // Import the xlsx library

interface SalesHistoryProps {
  dateRange: { start: string; end: string };
}

const groupSalesData = (sales: Sale[]) => {
  return sales.reduce((acc, sale) => {
    const key = `${sale.date}-${sale.productType}-${sale.pricePerUnit}-${sale.dairyId}`;
    if (!acc[key]) {
      acc[key] = {
        ...sale,
        quantity: 0,
        totalAmount: 0,
      };
    }
    acc[key].quantity += sale.quantity;
    acc[key].totalAmount += sale.totalAmount;
    return acc;
  }, {} as Record<string, Sale>);
};

const ManagementSalesHistory: React.FC<SalesHistoryProps> = ({ dateRange }) => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axiosInstance.get('/daily-sales');
      const groupedSales = groupSalesData(response.data);
      setSales(Object.values(groupedSales));
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await axiosInstance.patch(`/daily-sales/${id}/status`, { status });
      const { icon } = response.data;
      console.log(`Status changed to ${status} ${icon}`);
      fetchSales();
    } catch (error) {
      console.error('Error updating sale status:', error);
    }
  };

  const calculateTotals = () => {
    return {
      totalSales: sales.length,
      totalRevenue: sales.reduce((acc, sale) => acc + sale.totalAmount, 0),
      totalVolume: sales.reduce((acc, sale) => acc + parseInt(sale.quantity.toString()), 0),
      averagePrice: sales.reduce((acc, sale) => acc + (sale.pricePerLiter || 0), 0) / sales.length,
      dairiesCount: new Set(sales.map(sale => sale.productType)).size, // Count unique dairies
    };
  };

  const totals = calculateTotals();

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesData');
    XLSX.writeFile(workbook, 'SalesData.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales History</h3>
      </div>
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
              <p className="text-gray-500">Dairies</p>
              <h4 className="text-2xl font-semibold">
                {totals.dairiesCount.toLocaleString()}
              </h4>
              <p className="text-sm text-gray-600">Unique Dairies</p>
            </div>
            <FiDollarSign className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Sales</h3>
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Depance (RWF)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Money Cash (RWF)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.productType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.pricePerUnit ? sale.pricePerUnit.toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.depance.toLocaleString()} RWF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(sale.totalAmount - sale.depance).toLocaleString()} RWF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.description || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => sale.id && handleStatusChange(sale.id, 'approved')}
                      className="text-green-600 hover:text-green-700 mr-2"
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      onClick={() => sale.id && handleStatusChange(sale.id, 'rejected')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiXCircle />
                    </button>
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

export default ManagementSalesHistory; 