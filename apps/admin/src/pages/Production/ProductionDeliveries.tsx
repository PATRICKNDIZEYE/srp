import React, { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import DeliveryVerificationModal from '../../components/Production/DeliveryVerificationModal';

interface Delivery {
  id: string;
  transporterId: string;
  transporterName: string;
  source: string;
  milkType: string;
  declaredQuantity: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
}

const ProductionDeliveries = () => {
  const [deliveries] = useState<Delivery[]>([
    {
      id: '1',
      transporterId: 'T123',
      transporterName: 'John Driver',
      source: 'Kigali Diary',
      milkType: 'Fresh Milk',
      declaredQuantity: '500L',
      timestamp: '2024-02-20 10:30',
      status: 'pending',
    }
  ]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const handleVerifyDelivery = (
    deliveryId: string,
    actualQuantity: string,
    quality: string,
    notes: string
  ) => {
    setDeliveries(prevDeliveries =>
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Incoming Deliveries" />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Pending Deliveries</h3>
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
                  Quantity
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
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
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
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      delivery.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : delivery.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setShowVerificationModal(true);
                        }}
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

      {showVerificationModal && selectedDelivery && (
        <DeliveryVerificationModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedDelivery(null);
          }}
          onConfirm={handleVerifyDelivery}
          onReject={(deliveryId, reason) => {
            setDeliveries(prevDeliveries =>
              prevDeliveries.map(delivery =>
                delivery.id === deliveryId
                  ? { ...delivery, status: 'rejected' as const }
                  : delivery
              )
            );
            toast.error('Delivery rejected');
            setShowVerificationModal(false);
            setSelectedDelivery(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductionDeliveries; 