import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTruck, FiAlertTriangle } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import DeliveryConfirmationModal from '../../components/Diary/DeliveryConfirmationModal';
import axiosInstance from '../../utils/axiosInstance';
import { useUserContext } from '../../context/UserContext';

interface DeliveryData {
  id: string;
  diaryId: number;
  transportId: number;
  amount: number;
  status: string;
  date: string;
  diary: {
    id: number;
    status: string;
    approveStatus: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
  };
  transport: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: string;
  };
}

const MilkReceiving = () => {
  const { userId } = useUserContext();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);

  useEffect(() => {
    // Fetch deliveries from the API
    const fetchDeliveries = async () => {
      try {
        const response = await axiosInstance.get(`/derived/diary/${userId}`);
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        toast.error('Failed to fetch deliveries');
      }
    };

    fetchDeliveries();
  }, [userId]);

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

  const handleRejectDelivery = (deliveryId: string, reason: string) => {
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
  };

  const handleVerifyClick = (delivery: DeliveryData) => {
    setSelectedDelivery(delivery);
    setShowVerificationModal(true);
  };

  const handleApproveDelivery = async (deliveryId: string) => {
    try {
      await axiosInstance.patch(`/derived/${deliveryId}/status`, { status: 'Completed' });
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(delivery =>
          delivery.id === deliveryId
            ? { ...delivery, status: 'Completed' }
            : delivery
        )
      );
      toast.success('Delivery approved successfully');
    } catch (error) {
      console.error('Error approving delivery:', error);
      toast.error('Failed to approve delivery');
    }
  };

  // Helper function to check if a date is today
  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
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
                {deliveries.filter(d => d.status.trim().toLowerCase() === 'pending').length}
              </h3>
            </div>
            <FiTruck className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Received</p>
              <h3 className="text-2xl font-semibold">
                {deliveries
                  .filter(d => isToday(new Date(d.date)))
                  .reduce((total, d) => total + d.amount, 0)}L
              </h3>
            </div>
            <FiCheck className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Amount Received</p>
              <h3 className="text-2xl font-semibold">
                {deliveries.reduce((total, d) => total + d.amount, 0)}L
              </h3>
            </div>
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Deliveries</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(delivery.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.transport.firstName} {delivery.transport.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.amount}L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        delivery.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.status.trim().toLowerCase() === 'pending' && (
                      <button
                        onClick={() => handleApproveDelivery(delivery.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Approve
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
          delivery={{
            ...selectedDelivery,
            transporterId: selectedDelivery.transport.id.toString(),
            transporterName: `${selectedDelivery.transport.firstName} ${selectedDelivery.transport.lastName}`,
            milkType: 'default', // Replace with actual value if available
            declaredQuantity: selectedDelivery.amount.toString(),
            timestamp: new Date(selectedDelivery.date).toISOString(),
          }}
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