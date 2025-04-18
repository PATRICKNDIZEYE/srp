import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';
import { FiCheck, FiTruck, FiMapPin, FiDroplet } from 'react-icons/fi';
import RecipientVerificationModal from '../../components/Transport/RecipientVerificationModal';
import RecipientSelectionModal from '../../components/Transport/RecipientSelectionModal';
import axiosInstance from '../../utils/axiosInstance';
import { useUserContext } from '../../context/UserContext';
import AddDailyModal from '../POC/AddDailyModal';
import AddProductionModal from '../Production/AddProductionModal';

interface DeliveryConfirmationModalProps {
  delivery: any;
  onClose: () => void;
  onConfirm: (id: string, quantity: string, notes: string) => void;
}

const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  delivery,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = useState(delivery.quantity.replace('L', ''));
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity) {
      toast.error('Please enter the quantity');
      return;
    }
    onConfirm(delivery.id, `${quantity}L`, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Confirm Delivery</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Details
            </label>
            <div className="text-sm text-gray-600">
              <div>From: {delivery.source}</div>
              <div>To: {delivery.destination}</div>
              <div>Type: {delivery.milkType}</div>
              <div>Expected Quantity: {delivery.quantity}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Quantity Delivered (L)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any issues or comments about the delivery..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssignedTransportations = () => {
  const navigate = useNavigate();
  // Parse userData from localStorage and extract the id
  const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData).id : null;
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [assignedDeliveries, setAssignedDeliveries] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [isAddDailyModalOpen, setIsAddDailyModalOpen] = useState(false);
  const [isAddProductionModalOpen, setIsAddProductionModalOpen] = useState(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!userId) return;
      try {
        const response = await axiosInstance.get(`/transportations/transport/${userId}`);
        setAssignedDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        toast.error('Failed to fetch deliveries');
      }
    };

    const fetchDailyData = async () => {
      try {
        const response = await axiosInstance.get(`/derived/transport/${userId}`);
        setDailyData(response.data);
      } catch (error) {
        toast.error('Failed to fetch daily data');
      }
    };

    const fetchProductionData = async () => {
      try {
        const response = await axiosInstance.get(`/delivery/transport/${userId}`);
        setProductionData(response.data);
      } catch (error) {
        toast.error('Failed to fetch production data');
      }
    };

    if (userId) {
      fetchDeliveries();
      fetchDailyData();
      fetchProductionData();
    }
  }, [userId]);

  // Calculate summary data
  const totalDeliveries = assignedDeliveries.length;
  const totalVolume = assignedDeliveries
    .filter(delivery => delivery.transportStatus === 'Completed') // Only include completed deliveries
    .reduce((sum, delivery) => sum + delivery.amount, 0);

  // Calculate total amount for daily and production data
  const totalAmount = dailyData.reduce((sum: number, data: any) => sum + data.amount, 0) +
                      productionData.reduce((sum: number, data: any) => sum + data.amount, 0);

  // Calculate the difference between total volume and total amount
  const volumeDifference = totalVolume - totalAmount;

  // Ensure volumeDifference is a valid number
  const validVolumeDifference = isNaN(volumeDifference) ? 0 : volumeDifference;

  const completedDeliveries = assignedDeliveries.filter(delivery => delivery.transportStatus === 'Completed').length;

  const handleConfirmDelivery = (deliveryId: string, quantity: string, notes: string) => {
    // Here you would update the delivery status and submit the confirmation
    console.log('Confirming delivery:', { deliveryId, quantity, notes });
    toast.success('Delivery confirmed successfully!');
  };

  const handleCompleteDelivery = (deliveryId: string) => {
    const delivery = assignedDeliveries.find(d => d.id === deliveryId);
    if (delivery) {
      setSelectedDelivery(delivery);
      setShowVerificationModal(true);
    }
  };

  const handleVerifyDelivery = (
    deliveryId: string,
    recipientCode: string,
    quantity: string,
    notes: string
  ) => {
    // Here you would verify the recipient code with the backend
    console.log('Verifying delivery:', { deliveryId, recipientCode, quantity, notes });
    
    // Simulate verification
    if (recipientCode === '1234') { // This would be validated against the backend
      toast.success('Delivery verified and completed successfully!');
      setShowVerificationModal(false);
      setSelectedDelivery(null);
    } else {
      toast.error('Invalid recipient code. Please check and try again.');
    }
  };

  const handleAction = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowConfirmationModal(true);
  };

  const handleDeliveryArrival = (deliveryId: string) => {
    const delivery = assignedDeliveries.find(d => d.id === deliveryId);
    if (delivery) {
      setSelectedDelivery(delivery);
      setShowRecipientModal(true);
    }
  };

  const handleSubmitToRecipient = (
    deliveryId: string,
    recipientId: string,
    quantity: string,
    notes: string
  ) => {
    // Here you would submit the delivery to the selected recipient for confirmation
    console.log('Submitting to recipient:', { deliveryId, recipientId, quantity, notes });
    
    // Update delivery status to "Pending Confirmation"
    toast.success('Delivery submitted for confirmation. Waiting for recipient to verify.');
    setShowRecipientModal(false);
    setSelectedDelivery(null);
  };

  const handleApproveDelivery = async (deliveryId: string) => {
    try {
      const response = await axiosInstance.patch(`/transportations/${deliveryId}/status`, { newStatus: 'Completed' });
      toast.success('Delivery approved successfully!');
      
      // Update the delivery status in the local state
      setAssignedDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === deliveryId ? { ...delivery, transportStatus: 'Completed' } : delivery
        )
      );
    } catch (error) {
      toast.error('Failed to approve delivery');
    }
  };

  const handleViewDaily = (date: string) => {
    navigate(`/transport/daily-management/${encodeURIComponent(date)}`);
  };

  const handleViewProduction = (date: string) => {
    navigate(`/transport/production-management/${encodeURIComponent(date)}`);
  };

  const getActionButton = (delivery: any) => {
    return (
      <div className="flex space-x-2">
        {delivery.transportStatus !== 'Completed' ? (
          <button
            onClick={() => handleApproveDelivery(delivery.id)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            Approve
          </button>
        ) : (
          <span className="text-gray-500">Completed</span>
        )}
        <button
          onClick={() => handleViewDaily(delivery.date)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Daily
        </button>
        <button
          onClick={() => handleViewProduction(delivery.date)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Production
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Transportation Management" />

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Deliveries</p>
              <h3 className="text-2xl font-semibold">{totalDeliveries}</h3>
            </div>
            <FiTruck className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Completed Deliveries</p>
              <h3 className="text-2xl font-semibold">{completedDeliveries}</h3>
            </div>
            <FiCheck className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Volume</p>
              <h3 className="text-2xl font-semibold">{totalVolume}L</h3>
            </div>
            <FiDroplet className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">AMATA MFITE</p>
              <h3 className="text-2xl font-semibold">{validVolumeDifference}L</h3>
            </div>
            <FiDroplet className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>
      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Current Deliveries</h2>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {totalAmount}L
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsAddDailyModalOpen(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setIsAddProductionModalOpen(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Production
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Data Table */}
      <div className="bg-white rounded-lg shadow-lg mt-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Daily Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dailyData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(data.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{data.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{data.amount}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Data Table */}
      <div className="bg-white rounded-lg shadow-lg mt-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Production Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productionData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(data.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{data.transportStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{data.amount}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && selectedDelivery && (
        <DeliveryConfirmationModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowConfirmationModal(false);
            setSelectedDelivery(null);
          }}
          onConfirm={handleConfirmDelivery}
        />
      )}

      {/* Add Verification Modal */}
      {showVerificationModal && selectedDelivery && (
        <RecipientVerificationModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedDelivery(null);
          }}
          onVerify={handleVerifyDelivery}
        />
      )}

      {/* Recipient Selection Modal */}
      {showRecipientModal && selectedDelivery && (
        <RecipientSelectionModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowRecipientModal(false);
            setSelectedDelivery(null);
          }}
          onSubmit={handleSubmitToRecipient}
        />
      )}

      {/* Daily Modal */}
      {isAddDailyModalOpen && (
        <AddDailyModal
          onClose={() => setIsAddDailyModalOpen(false)}
          onAdd={() => {
            setIsAddDailyModalOpen(false);
            // Optionally refresh data
          }}
          initialTransportId={userId || ''}
          deriveryId={userId || ''}
          maxVolumeDifference={validVolumeDifference}
        />
      )}

      {/* Production Modal */}
      {isAddProductionModalOpen && (
        <AddProductionModal
          onClose={() => setIsAddProductionModalOpen(false)}
          onAdd={() => {
            setIsAddProductionModalOpen(false);
            // Optionally refresh data
          }}
          initialTransportId={userId || ''}
          deliveryId={userId || ''}
          maxAmount={validVolumeDifference}
        />
      )}
    </div>
  );
};

export default AssignedTransportations; 