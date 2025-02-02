import React, { useState } from 'react';
import { FiBox, FiTruck, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import ProductionStats from '../../components/Production/ProductionStats';
import MilkRequestModal from '../../components/Production/MilkRequestModal';
import ProductDistributionModal from '../../components/Production/ProductDistributionModal';

const ProductionDashboard = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDistributionModal, setShowDistributionModal] = useState(false);

  // Dummy data - would come from API
  const [inventory, setInventory] = useState({
    rawMilk: 2500,
    fermentedMilk: 1200,
    cream: 300,
    cheese: 150,
    yogurt: 800,
    butter: 200
  });

  const [productionStats, setProductionStats] = useState({
    dailyProduction: {
      fermentedMilk: 500,
      cream: 100,
      cheese: 50,
      yogurt: 300,
      butter: 75
    },
    efficiency: 92,
    qualityIssues: 3,
    pendingDeliveries: 8
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Production Dashboard" />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setShowRequestModal(true)}
          className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
        >
          <FiTruck className="text-blue-600" />
          <span className="text-blue-600 font-medium">Request Milk Supply</span>
        </button>

        <button
          onClick={() => setShowDistributionModal(true)}
          className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
        >
          <FiBox className="text-green-600" />
          <span className="text-green-600 font-medium">Distribute Products</span>
        </button>
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Raw Milk</p>
              <h3 className="text-xl font-semibold">{inventory.rawMilk}L</h3>
            </div>
            <FiBox className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Ikivuguto</p>
              <h3 className="text-xl font-semibold">{inventory.fermentedMilk}L</h3>
            </div>
            <FiBox className="text-purple-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Amavuta</p>
              <h3 className="text-xl font-semibold">{inventory.cream}L</h3>
            </div>
            <FiBox className="text-yellow-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Cheese</p>
              <h3 className="text-xl font-semibold">{inventory.cheese}kg</h3>
            </div>
            <FiBox className="text-green-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Yogurt</p>
              <h3 className="text-xl font-semibold">{inventory.yogurt}L</h3>
            </div>
            <FiBox className="text-red-500 text-xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Butter</p>
              <h3 className="text-xl font-semibold">{inventory.butter}kg</h3>
            </div>
            <FiBox className="text-orange-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Production Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Production</h3>
          <div className="space-y-4">
            {Object.entries(productionStats.dailyProduction).map(([product, amount]) => (
              <div key={product} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">
                  {product.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-semibold">
                  {amount}{product === 'cheese' || product === 'butter' ? 'kg' : 'L'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Production Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Efficiency Rate</span>
              <span className="font-semibold text-green-600">
                {productionStats.efficiency}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quality Issues</span>
              <span className="font-semibold text-red-600">
                {productionStats.qualityIssues} reported
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Deliveries</span>
              <span className="font-semibold text-blue-600">
                {productionStats.pendingDeliveries}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <MilkRequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={(data) => {
            console.log('Requesting milk:', data);
            setShowRequestModal(false);
          }}
        />
      )}

      {showDistributionModal && (
        <ProductDistributionModal
          onClose={() => setShowDistributionModal(false)}
          onSubmit={(data) => {
            console.log('Distributing products:', data);
            setShowDistributionModal(false);
          }}
          inventory={inventory}
        />
      )}
    </div>
  );
};

export default ProductionDashboard; 