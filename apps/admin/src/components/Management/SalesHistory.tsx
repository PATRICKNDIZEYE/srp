import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiDownload, FiTrendingUp, FiPlus } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';
import SaleModal from './Modals/SaleModal';
import { Sale } from '../../types'; // Assuming you have a types file where Sale is defined
import { useParams } from 'react-router-dom'; // Import useParams

interface SalesHistoryProps {
  dateRange: { start: string; end: string };
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ dateRange }) => {
  const { salesHistoryId } = useParams<{ salesHistoryId: string }>();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!salesHistoryId) {
        console.error('No salesHistoryId found in URL');
        return;
      }
      try {
        const response = await axiosInstance.get(`/daily-sales/diary/${salesHistoryId}`);
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [salesHistoryId]);

  const handleAddOrUpdateSale = async (saleData: Sale) => {
    try {
      // Retrieve user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const diaryId = userData.id; // Assuming 'id' is the diaryId

      if (!diaryId) {
        throw new Error('Diary ID is missing');
      }

      // Convert the date to an ISO string
      const formattedDate = new Date(saleData.date).toISOString();

      // Remove id from payload if it's null or undefined
      const { id, ...rest } = saleData;
      const salePayload = {
        ...rest,
        date: formattedDate,
        diaryId,
        quantity: parseFloat(saleData.quantity.toString()),
        pricePerUnit: parseFloat(saleData.pricePerUnit.toString()),
        totalAmount: parseFloat(saleData.totalAmount.toString()),
        depance: parseFloat(saleData.depance.toString()),
        description: saleData.description,
      };

      // Log the payload to inspect the data being sent
      console.log('Sending sale data:', salePayload);

      if (id) {
        await axiosInstance.patch(`/daily-sales/${id}`, salePayload);
      } else {
        await axiosInstance.post('/daily-sales', salePayload);
      }
      fetchSales();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      await axiosInstance.delete(`/daily-sales/${id}`);
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const calculateTotals = () => {
    return {
      totalSales: sales.length,
      totalRevenue: sales.reduce((acc, sale) => acc + sale.totalAmount, 0),
      totalVolume: sales.reduce((acc, sale) => acc + parseInt(sale.quantity.toString()), 0),
      averagePrice: sales.reduce((acc, sale) => acc + (sale.pricePerLiter || 0), 0) / sales.length,
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Sales History</h3>
        <button onClick={() => { setSelectedSale(null); setIsModalOpen(true); }} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
          <FiPlus />
          <span>Add Sale</span>
        </button>
      </div>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Depance (RWF)
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
                    {sale.description || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedSale(sale);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSale(sale.id || '')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <SaleModal
          sale={selectedSale}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddOrUpdateSale}
        />
      )}
    </div>
  );
};

export default SalesHistory; 