import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

interface DeliveryConfirmationModalProps {
  delivery: {
    id: string;
    transporterId: string;
    transporterName: string;
    milkType: string;
    declaredQuantity: string;
    timestamp: string;
  };
  onClose: () => void;
  onConfirm: (id: string, actualQuantity: string, quality: string, notes: string) => void;
  onReject: (id: string, reason: string) => void;
}

const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  delivery,
  onClose,
  onConfirm,
  onReject,
}) => {
  const [actualQuantity, setActualQuantity] = useState(delivery.declaredQuantity.replace('L', ''));
  const [qualityStatus, setQualityStatus] = useState('good');
  const [notes, setNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const declared = Number(delivery.declaredQuantity.replace('L', ''));
    const actual = Number(actualQuantity);

    if (Math.abs(declared - actual) > declared * 0.1) { // 10% threshold
      toast.warning('Significant quantity difference detected. Please verify.');
    }

    onConfirm(delivery.id, `${actualQuantity}L`, qualityStatus, notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {showRejectForm ? 'Reject Delivery' : 'Verify Milk Delivery'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {!showRejectForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-800">
                <div>Transporter: {delivery.transporterName}</div>
                <div>Type: {delivery.milkType}</div>
                <div>Declared Quantity: {delivery.declaredQuantity}</div>
                <div>Time: {delivery.timestamp}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Quantity Received (L)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={actualQuantity}
                onChange={(e) => setActualQuantity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality Assessment
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={qualityStatus}
                onChange={(e) => setQualityStatus(e.target.value)}
              >
                <option value="good">Good Quality</option>
                <option value="risky">Risky - Needs Processing</option>
                <option value="poor">Poor Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any quality issues or discrepancies..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Reject Delivery
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <FiCheck />
                <span>Confirm Receipt</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            onReject(delivery.id, rejectReason);
          }} className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center text-red-800 mb-2">
                <FiAlertTriangle className="mr-2" />
                <span className="font-medium">Rejecting Delivery</span>
              </div>
              <div className="text-sm text-red-700">
                Please provide a detailed reason for rejecting this delivery.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this delivery is being rejected..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <FiX />
                <span>Reject Delivery</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeliveryConfirmationModal; 