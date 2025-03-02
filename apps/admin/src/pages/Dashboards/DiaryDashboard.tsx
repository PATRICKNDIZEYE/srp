import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiShoppingCart, FiUsers, FiDollarSign, FiPackage } from 'react-icons/fi';
import ChartOne from '../../components/Charts/ChartOne';
import axiosInstance from '../../utils/axiosInstance';
import { Sale } from '../../types'; // Ensure this import matches your project structure
import SaleModal from '../../components/Diary/SaleModal'; // Import the SaleModal component

const DiaryDashboard = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totals, setTotals] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalVolume: 0,
    averagePrice: 0,
  });
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false); // Add state for modal

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const diaryId = userData.id;

        if (!diaryId) {
          throw new Error('Diary ID is missing');
        }

        const response = await axiosInstance.get(`/daily-sales/diary/${diaryId}`);
        setSales(response.data);
        calculateTotals(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    const calculateTotals = (salesData: Sale[]) => {
      const totalSales = salesData.length;
      const totalRevenue = salesData.reduce((acc, sale) => acc + sale.totalAmount, 0);
      const totalVolume = salesData.reduce((acc, sale) => acc + parseInt(sale.quantity.toString()), 0);
      const averagePrice = salesData.reduce((acc, sale) => acc + (sale.pricePerUnit || 0), 0) / totalSales;

      setTotals({ totalSales, totalRevenue, totalVolume, averagePrice });
    };

    fetchSales();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Diary Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Sales"
          total={`${totals.totalSales} Transactions`}
          rate=""
          levelUp={true}
        >
          <FiDollarSign />
        </CardDataStats>

        <CardDataStats
          title="Total Revenue"
          total={`${totals.totalRevenue.toLocaleString()} RWF`}
          rate="+15% from last week"
          levelUp={true}
        >
          <FiDollarSign />
        </CardDataStats>

        <CardDataStats
          title="Total Volume"
          total={`${totals.totalVolume}L`}
          rate="All Products"
          levelUp={true}
        >
          <FiDollarSign />
        </CardDataStats>

        <CardDataStats
          title="Average Price"
          total={`${Math.round(totals.averagePrice).toLocaleString()} RWF`}
          rate="Per Liter"
          levelUp={true}
        >
          <FiDollarSign />
        </CardDataStats>

        {/* New Sales Card */}
        <div className="bg-white rounded-lg p-6 shadow cursor-pointer" onClick={() => setIsSaleModalOpen(true)}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Sales</p>
              <h4 className="text-2xl font-semibold">Manage Sales</h4>
              <p className="text-sm text-blue-600">Click to add or edit sales</p>
            </div>
            <FiDollarSign className="text-blue-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Sales & Inventory */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
          <ChartOne />
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Top Products</h3>
          <div className="space-y-4">
            {['Fresh Milk', 'Yogurt', 'Cheese'].map((product) => (
              <div key={product} className="flex justify-between items-center p-3 border rounded">
                <span>{product}</span>
                <span className="font-semibold">RF 45K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sale Modal */}
      {isSaleModalOpen && (
        <SaleModal
          sale={null} // Pass null or a default sale object if needed
          onClose={() => setIsSaleModalOpen(false)}
          onSave={(saleData) => {
            // Handle save logic here
            console.log('Sale saved:', saleData);
            setIsSaleModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DiaryDashboard; 