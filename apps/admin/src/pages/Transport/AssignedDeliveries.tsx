import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';
import { FiCheck, FiTruck, FiMapPin, FiDroplet } from 'react-icons/fi';
import RecipientVerificationModal from '../../components/Transport/RecipientVerificationModal';
import RecipientSelectionModal from '../../components/Transport/RecipientSelectionModal';

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

const AssignedDeliveries = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);

  // Dummy data
  const assignedDeliveries = [
    {
      id: '1',
      date: '2024-02-20',
      source: 'Farmer Collection',
      destination: 'Kigali POC Center',
      milkType: 'Inshushyu',
      quantity: '100L',
      status: 'Pending Collection',
    },
    {
      id: '2',
      date: '2024-02-20',
      source: 'Kigali POC Center',
      destination: 'Central Dairy Plant',
      milkType: 'Ikivuguto',
      quantity: '150L',
      status: 'In Transit',
    },
    {
      id: '3',
      date: '2024-02-20',
      source: 'Kigali POC Center',
      destination: 'Eastern Production Unit',
      milkType: 'Inshushyu',
      quantity: '200L',
      status: 'Ready for Delivery',
    },
  ];

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

  const getActionButton = (delivery: any) => {
    let buttonText = '';
    let buttonColor = '';

    switch (delivery.status) {
      case 'Pending Collection':
        buttonText = 'Confirm Collection';
        buttonColor = 'blue';
        break;
      case 'In Transit':
        buttonText = 'Complete Delivery';
        buttonColor = 'green';
        break;
      case 'Ready for Delivery':
        buttonText = 'Start Delivery';
        buttonColor = 'yellow';
        break;
      case 'Pending Confirmation':
        buttonText = 'Arrived at Destination';
        buttonColor = 'blue';
        break;
      default:
        buttonText = 'View Details';
        buttonColor = 'gray';
    }

    if (buttonColor === 'blue') {
      return (
        <button
          onClick={() => handleDeliveryArrival(delivery.id)}
          className={`px-4 py-2 bg-${buttonColor}-100 text-${buttonColor}-700 rounded-lg hover:bg-${buttonColor}-200`}
        >
          {buttonText}
        </button>
      );
    } else {
      return (
        <button
          onClick={() => handleAction(delivery)}
          className={`px-4 py-2 bg-${buttonColor}-100 text-${buttonColor}-700 rounded-lg hover:bg-${buttonColor}-200`}
        >
          {buttonText}
        </button>
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Assigned Deliveries" />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Collection</p>
              <h3 className="text-2xl font-semibold">3</h3>
            </div>
            <FiTruck className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">In Transit</p>
              <h3 className="text-2xl font-semibold">2</h3>
            </div>
            <FiMapPin className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Delivered Today</p>
              <h3 className="text-2xl font-semibold">5</h3>
            </div>
            <FiCheck className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Volume</p>
              <h3 className="text-2xl font-semibold">850L</h3>
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
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type & Quantity
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
                    {delivery.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {delivery.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{delivery.milkType}</div>
                    <div className="text-gray-500">{delivery.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        delivery.status === 'Pending Collection'
                          ? 'bg-yellow-100 text-yellow-800'
                          : delivery.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {delivery.status}
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