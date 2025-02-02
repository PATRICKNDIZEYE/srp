import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiSend } from 'react-icons/fi';

interface RecipientSelectionModalProps {
  delivery: {
    id: string;
    destination: string;
    milkType: string;
    quantity: string;
  };
  onClose: () => void;
  onSubmit: (deliveryId: string, recipientId: string, quantity: string, notes: string) => void;
}

const RecipientSelectionModal: React.FC<RecipientSelectionModalProps> = ({
  delivery,
  onClose,
  onSubmit,
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [quantity, setQuantity] = useState(delivery.quantity.replace('L', ''));
  const [notes, setNotes] = useState('');

  // Dummy data - this would come from your backend based on the destination
  const availableRecipients = [
    { id: '1', name: 'John POC Manager', role: 'POC Manager' },
    { id: '2', name: 'Alice Dairy Supervisor', role: 'Dairy Supervisor' },
    { id: '3', name: 'Bob Production Manager', role: 'Production Manager' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient) {
      toast.error('Please select a recipient');
      return;
    }

    if (!quantity) {
      toast.error('Please enter the delivered quantity');
      return;
    }

    onSubmit(delivery.id, selectedRecipient, `${quantity}L`, notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Select Recipient</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800">
              <div>Destination: {delivery.destination}</div>
              <div>Type: {delivery.milkType}</div>
              <div>Expected Quantity: {delivery.quantity}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Recipient
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              required
            >
              <option value="">Choose a recipient</option>
              {availableRecipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name} - {recipient.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivered Quantity (L)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
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
              placeholder="Any additional information about the delivery..."
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FiSend />
              <span>Send for Confirmation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipientSelectionModal; 