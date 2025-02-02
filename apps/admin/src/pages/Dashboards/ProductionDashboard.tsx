import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiPackage, FiAlertCircle, FiBox, FiCheckCircle } from 'react-icons/fi';
import ChartThree from '../../components/Charts/ChartThree';

const ProductionDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Production Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Today's Production"
          total="5,450 L"
          rate="On Target"
          levelUp={true}
        >
          <FiPackage />
        </CardDataStats>

        <CardDataStats
          title="Quality Issues"
          total="2"
          rate="Minor"
          levelUp={false}
        >
          <FiAlertCircle />
        </CardDataStats>

        <CardDataStats
          title="Raw Milk Stock"
          total="12,500 L"
          rate="Sufficient"
          levelUp={true}
        >
          <FiBox />
        </CardDataStats>

        <CardDataStats
          title="Quality Pass Rate"
          total="98.5%"
          rate="Above Target"
          levelUp={true}
        >
          <FiCheckCircle />
        </CardDataStats>
      </div>

      {/* Production Charts & Reports */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Production Timeline</h3>
            <ChartThree />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Quality Control</h3>
            {/* Quality Metrics */}
            <div className="space-y-3">
              {['Temperature', 'pH Level', 'Bacterial Count'].map((metric) => (
                <div key={metric} className="flex justify-between items-center">
                  <span>{metric}</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Optimal
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDashboard; 