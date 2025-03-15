import React, { useEffect, useState, useMemo } from 'react';
import { FiDollarSign, FiDownload, FiTrendingUp, FiPlus, FiCheckCircle } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';
import SaleModal from './SaleModal';
import { Sale } from '../../types'; // Assuming you have a types file where Sale is defined

interface SalesHistoryProps {
  dateRange: { start: string; end: string };
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ dateRange }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [approvedProducts, setApprovedProducts] = useState<{ product: string; amount: number }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [receivedQuantities, setReceivedQuantities] = useState<number>(0);

  useEffect(() => {
    fetchSales();
    fetchReceivedQuantities();
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      fetchApprovedProducts();
    }
  }, [sales]);

  const fetchSales = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const diaryId = userData.id;

      if (!diaryId) {
        throw new Error('Diary ID is missing');
      }

      const response = await axiosInstance.get(`/daily-sales/diary/${diaryId}`);
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchReceivedQuantities = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const diaryId = userData.id;

      if (!diaryId) {
        throw new Error('Diary ID is missing');
      }

      const response = await axiosInstance.get(`/derived/diary/${diaryId}`);
      const nonPendingSales = response.data.filter((sale: Sale) => sale.status !== 'pending');
      const totalReceived = nonPendingSales.reduce((acc: number, sale: Sale) => acc + (sale.quantity || 0), 0);
      setReceivedQuantities(totalReceived);
    } catch (error) {
      console.error('Error fetching received quantities:', error);
    }
  };

  const fetchApprovedProducts = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const dailyId = userData.id;

      const response = await axiosInstance.get(`/stocks/stockout/daily/${dailyId}`);
      const approved = response.data.filter((product: any) => product.status === 'Approved');

      // Adjust the approved products' amounts based on sales
      const adjustedApprovedProducts = approved.map((product: any) => {
        const totalSold = sales
          .filter((sale) => sale.productType === product.product)
          .reduce((acc, sale) => acc + (sale.quantity || 0), 0);
        return {
          ...product,
          amount: product.amount - totalSold,
        };
      });

      setApprovedProducts(adjustedApprovedProducts);
    } catch (error) {
      console.error('Error fetching approved products:', error);
    }
  };

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
      totalRevenue: sales.reduce((acc, sale) => acc + (sale.totalAmount || 0), 0),
      totalVolume: sales.reduce((acc, sale) => acc + (parseInt(sale.quantity.toString()) || 0), 0),
      averagePrice: sales.length > 0 ? sales.reduce((acc, sale) => acc + (sale.pricePerLiter || 0), 0) / sales.length : 0,
    };
  };

  const totals = calculateTotals();

  const calculateStockAfterSales = () => {
    const inshyushyuSales = sales
      .filter((sale) => sale.productType === 'inshyushyu')
      .reduce((acc, sale) => acc + (sale.quantity || 0), 0);
    return receivedQuantities - inshyushyuSales;
  };

  const stockAfterSales = useMemo(calculateStockAfterSales, [receivedQuantities, sales]);

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Stock After Sales</p>
              <h4 className="text-2xl font-semibold">{stockAfterSales}L</h4>
              <p className="text-sm text-blue-600">Remaining Stock</p>
            </div>
            <FiDollarSign className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Approved Products</p>
              <ul>
                {approvedProducts.map((product) => (
                  <li key={product.product} className="text-sm">
                    {product.product}: {product.amount}L
                  </li>
                ))}
              </ul>
            </div>
            <FiCheckCircle className="text-green-500 text-2xl" />
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
          approvedProducts={approvedProducts}
          stockAfterSales={stockAfterSales}
        />
      )}
    </div>
  );
};

export default SalesHistory; 