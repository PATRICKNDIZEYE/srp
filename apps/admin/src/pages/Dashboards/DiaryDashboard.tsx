import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiShoppingCart, FiUsers, FiDollarSign, FiPackage } from 'react-icons/fi';
import ChartOne from '../../components/Charts/ChartOne';

const DiaryDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Diary Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Today's Sales"
          total="RF 245K"
          rate="15% up"
          levelUp={true}
        >
          <FiDollarSign />
        </CardDataStats>

        <CardDataStats
          title="Active Customers"
          total="48"
          rate="4 new"
          levelUp={true}
        >
          <FiUsers />
        </CardDataStats>

        <CardDataStats
          title="Orders Today"
          total="32"
          rate="8 pending"
          levelUp={true}
        >
          <FiShoppingCart />
        </CardDataStats>

        <CardDataStats
          title="Stock Level"
          total="850 L"
          rate="Optimal"
          levelUp={true}
        >
          <FiPackage />
        </CardDataStats>
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
    </div>
  );
};

export default DiaryDashboard; 