import React, { useState } from 'react';
import { FiDollarSign, FiTruck, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import SaleRecordingModal from '../../components/Diary/SaleRecordingModal';
import MilkTransferModal from '../../components/Diary/MilkTransferModal';
import { toast } from 'react-toastify';

const DiaryOperations = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Dummy data for inventory
  const [inventory, setInventory] = useState({
    fresh: 500,
    fermented: 200,
    cream: 50,
    riskyMilk: 25
  });

  const handleRecordSale = (data: {
    productType: string;
    quantity: string;
    pricePerLiter: number;
    totalAmount: number;
    customerInfo: string;
    paymentMethod: string;
  }) => {
    // Update inventory
    const quantity = Number(data.quantity.replace('L', ''));
    setInventory(prev => ({
      ...prev,
      [data.productType]: prev[data.productType as keyof typeof prev] - quantity
    }));

    toast.success('Sale recorded successfully');
    setShowSaleModal(false);
  };

  const handleTransfer = (data: {
    type: 'request' | 'send';
    diaryId: string;
    milkType: string;
    quantity: string;
    urgency: string;
    notes: string;
  }) => {
    if (data.type === 'send') {
      const quantity = Number(data.quantity.replace('L', ''));
      setInventory(prev => ({
        ...prev,
        [data.milkType]: prev[data.milkType as keyof typeof prev] - quantity
      }));
    }

    toast.success(data.type === 'request' 
      ? 'Milk request sent successfully' 
      : 'Milk transfer initiated successfully'
    );
    setShowTransferModal(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Diary Operations" />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Fresh Milk Stock</p>
              <h3 className="text-2xl font-semibold">{inventory.fresh}L</h3>
            </div>
            <FiPackage className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Ikivuguto Stock</p>
              <h3 className="text-2xl font-semibold">{inventory.fermented}L</h3>
            </div>
            <FiPackage className="text-purple-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Amavuta Stock</p>
              <h3 className="text-2xl font-semibold">{inventory.cream}L</h3>
            </div>
            <FiPackage className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Risky Milk</p>
              <h3 className="text-2xl font-semibold">{inventory.riskyMilk}L</h3>
              <p className="text-sm text-red-600">Needs Processing</p>
            </div>
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setShowSaleModal(true)}
          className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
        >
          <FiDollarSign className="text-blue-600" />
          <span className="text-blue-600 font-medium">Record New Sale</span>
        </button>

        <button
          onClick={() => setShowTransferModal(true)}
          className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
        >
          <FiTruck className="text-green-600" />
          <span className="text-green-600 font-medium">Request/Send Milk Transfer</span>
        </button>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Sales
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Transfers
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Quality Issues
              </button>
            </div>
            <DateRangeFilter
              dateRange={dateRange}
              selectedPeriod={selectedPeriod}
              onDateRangeChange={setDateRange}
              onPeriodChange={setSelectedPeriod}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            />
          </div>
        </div>

        {/* Content will be added here based on selected tab */}
      </div>

      {/* Modals */}
      {showSaleModal && (
        <SaleRecordingModal
          onClose={() => setShowSaleModal(false)}
          onSubmit={handleRecordSale}
          inventory={inventory}
        />
      )}

      {showTransferModal && (
        <MilkTransferModal
          onClose={() => setShowTransferModal(false)}
          onSubmit={handleTransfer}
        />
      )}
    </div>
  );
};

export default DiaryOperations; 