import React, { useState } from 'react';
import { FiCheck, FiX, FiTruck, FiAlertTriangle } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import DeliveryConfirmationModal from '../../components/Diary/DeliveryConfirmationModal';

interface PendingDelivery {
  id: string;
  transporterId: string;
  transporterName: string;
  source: string;
  milkType: string;
  declaredQuantity: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
}

const MilkReceiving = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<PendingDelivery | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Dummy data - would come from API
  const [pendingDeliveries, setPendingDeliveries] = useState<PendingDelivery[]>([
    {
      id: '1',
      transporterId: 'T123',
      transporterName: 'John Driver',
      source: 'Kigali POC Center',
      milkType: 'Fresh Milk',
      declaredQuantity: '200L',
      timestamp: '2024-02-20 10:30',
      status: 'pending',
    },
    {
      id: '2',
      transporterId: 'T124',
      transporterName: 'Alice Trucker',
      source: 'Nyamirambo POC',
      milkType: 'Fresh Milk',
      declaredQuantity: '150L',
      timestamp: '2024-02-20 11:15',
      status: 'pending',
    },
  ]);

  const handleVerifyDelivery = (
    deliveryId: string,
    actualQuantity: string,
    quality: string,
    notes: string
  ) => {
    // Update the delivery status in the list
    setPendingDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === deliveryId
          ? { ...delivery, status: 'verified' as const }
          : delivery
      )
    );

    toast.success('Delivery verified successfully');
    setShowVerificationModal(false);
    setSelectedDelivery(null);
  };

  const handleRejectDelivery = (deliveryId: string, reason: string) => {
    // Update the delivery status in the list
    setPendingDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === deliveryId
          ? { ...delivery, status: 'rejected' as const }
          : delivery
      )
    );

    toast.error('Delivery rejected');
    setShowVerificationModal(false);
    setSelectedDelivery(null);
  };

  const handleVerifyClick = (delivery: PendingDelivery) => {
    setSelectedDelivery(delivery);
    setShowVerificationModal(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Receive Milk" />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Deliveries</p>
              <h3 className="text-2xl font-semibold">
                {pendingDeliveries.filter(d => d.status === 'pending').length}
              </h3>
            </div>
            <FiTruck className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Received</p>
              <h3 className="text-2xl font-semibold">850L</h3>
            </div>
            <FiCheck className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Quality Issues</p>
              <h3 className="text-2xl font-semibold">2</h3>
            </div>
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Pending Deliveries Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Pending Deliveries</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Declared Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.transporterName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.milkType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.declaredQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        delivery.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : delivery.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.status === 'pending' && (
                      <button
                        onClick={() => handleVerifyClick(delivery)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        Verify Delivery
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedDelivery && (
        <DeliveryConfirmationModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedDelivery(null);
          }}
          onConfirm={handleVerifyDelivery}
          onReject={handleRejectDelivery}
        />
      )}
    </div>
  );
};

export default MilkReceiving; 