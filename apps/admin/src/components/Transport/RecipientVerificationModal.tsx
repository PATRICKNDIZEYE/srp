import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiCheck } from 'react-icons/fi';

interface RecipientVerificationModalProps {
  delivery: {
    id: string;
    destination: string;
    milkType: string;
    quantity: string;
  };
  onClose: () => void;
  onVerify: (deliveryId: string, recipientCode: string, quantity: string, notes: string) => void;
}

const RecipientVerificationModal: React.FC<RecipientVerificationModalProps> = ({
  delivery,
  onClose,
  onVerify,
}) => {
  const [recipientCode, setRecipientCode] = useState('');
  const [quantity, setQuantity] = useState(delivery.quantity.replace('L', ''));
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientCode) {
      toast.error('Please enter recipient verification code');
      return;
    }

    if (!quantity) {
      toast.error('Please enter the delivered quantity');
      return;
    }

    onVerify(delivery.id, recipientCode, `${quantity}L`, notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Verify Recipient</h3>
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
              Recipient Verification Code
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={recipientCode}
              onChange={(e) => setRecipientCode(e.target.value)}
              placeholder="Enter code provided by recipient"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Ask the recipient for their verification code
            </p>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <FiCheck />
              <span>Complete Delivery</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipientVerificationModal; 