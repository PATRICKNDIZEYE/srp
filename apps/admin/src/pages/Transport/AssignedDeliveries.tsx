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
  const [availableAmount, setAvailableAmount] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchVolumes = async () => {
      if (!user) {
        console.error('User is not available');
        return;
      }
      try {
        const response = await axiosInstance.get(`/transportations/available-amount/${user.id}`);
        setAvailableAmount(response.data.availableAmount);
        setTotalVolume(response.data.totalVolume);
      } catch (error) {
        console.error('Error fetching volumes:', error);
        toast.error('Failed to fetch milk volumes');
      }
    };

    fetchVolumes();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantityNum = parseFloat(quantity);
    
    if (!user) {
      toast.error('User information is missing');
      return;
    }

    if (!quantity) {
      toast.error('Please enter the quantity');
      return;
    }

    if (quantityNum > availableAmount) {
      toast.error(`You only have ${availableAmount}L available milk`);
      return;
    }

    try {
      // Complete the delivery
      const response = await axiosInstance.post('/transportations/complete-delivery', {
        transportId: user.id,
        deliveryId: delivery.id,
        amount: quantityNum
      });

      // Update local state with new volumes
      setAvailableAmount(response.data.updatedVolumes.availableVolume);
      setTotalVolume(response.data.updatedVolumes.totalVolume);

      onConfirm(delivery.id, `${quantity}L`, notes);
      onClose();
      toast.success('Delivery completed successfully');
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast.error('Failed to complete delivery');
    }
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Volume
              </label>
              <div className="text-lg font-semibold text-gray-600">
                {totalVolume}L
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Amount
              </label>
              <div className="text-lg font-semibold text-blue-600">
                {availableAmount}L
              </div>
            </div>
          </div>

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
              max={availableAmount}
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

const AssignedDeliveries = () => {
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

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!userId) {
        console.log('No userId found');
        return;
      }
      try {
        console.log('Fetching deliveries for userId:', userId);
        const response = await axiosInstance.get(`/transportations/transport/${userId}`);
        console.log('API response:', response);
        setAssignedDeliveries(response.data);
        console.log('Fetched Deliveries:', response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        toast.error('Failed to fetch deliveries');
      }
    };

    fetchDeliveries();
  }, [userId]);

  // Calculate summary data
  const totalDeliveries = assignedDeliveries.length;
  const totalVolume = assignedDeliveries
    .filter(delivery => delivery.transportStatus === 'Completed')
    .reduce((sum, delivery) => sum + delivery.amount, 0);
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
      // Update to use the same endpoint and request format
      const response = await axiosInstance.patch(`/transportations/${deliveryId}/status`, {
        newStatus: 'Completed'  // Changed from status to newStatus
      });

      if (response.status === 200) {
        toast.success('Delivery approved successfully!');
        // Refresh the deliveries list
        const updatedDeliveries = await axiosInstance.get(`/transportations/transport/${userId}`);
        setAssignedDeliveries(updatedDeliveries.data);
      }
    } catch (error) {
      console.error('Error approving delivery:', error);
      toast.error('Failed to approve delivery');
    }
  };

  const handleRejectDelivery = async (deliveryId: string) => {
    try {
      // Assuming there's an endpoint to update the delivery status to "Rejected"
      const response = await axiosInstance.patch(`/transportations/${deliveryId}/status`, {
        newStatus: 'Rejected'
      });

      if (response.status === 200) {
        toast.success('Delivery rejected successfully!');
        // Refresh the deliveries list
        const updatedDeliveries = await axiosInstance.get(`/transportations/transport/${userId}`);
        setAssignedDeliveries(updatedDeliveries.data);
      }
    } catch (error) {
      console.error('Error rejecting delivery:', error);
      toast.error('Failed to reject delivery');
    }
  };

  const handleViewDaily = (deliveryId: string) => {
    navigate(`/transport/daily-management/${deliveryId}`);
  };

  const getActionButton = (delivery: any) => {
    if (delivery.transportStatus === 'Completed' || delivery.transportStatus === 'Rejected') {
      return null; // Hide actions for completed or rejected deliveries
    }

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleApproveDelivery(delivery.id)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        > 
          Approve
        </button>
        <button
          onClick={() => handleRejectDelivery(delivery.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Reject
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Assigned Deliveries" />

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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  POC Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignedDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(delivery.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.poc?.firstName} {delivery.poc?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.amount}L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        delivery.transportStatus === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {delivery.transportStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getActionButton(delivery)}
                  </td>
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
    </div>
  );
};

export default AssignedDeliveries; 