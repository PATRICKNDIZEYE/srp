import React, { useState } from 'react';
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

interface DeliveryVerificationModalProps {
  delivery: {
    id: string;
    transporterId: string;
    transporterName: string;
    source: string;
    milkType: string;
    declaredQuantity: string;
    timestamp: string;
  };
  onClose: () => void;
  onConfirm: (deliveryId: string, actualQuantity: string, quality: string, notes: string) => void;
  onReject: (deliveryId: string, reason: string) => void;
}

const DeliveryVerificationModal: React.FC<DeliveryVerificationModalProps> = ({
  delivery,
  onClose,
  onConfirm,
  onReject,
}) => {
  const [actualQuantity, setActualQuantity] = useState('');
  const [quality, setQuality] = useState('good');
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRejecting) {
      if (!rejectReason.trim()) {
        return;
      }
      onReject(delivery.id, rejectReason);
    } else {
      if (!actualQuantity) {
        return;
      }
      onConfirm(delivery.id, actualQuantity, quality, notes);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {isRejecting ? 'Reject Delivery' : 'Verify Delivery'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Transporter</p>
              <p className="font-medium">{delivery.transporterName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Declared Quantity</p>
              <p className="font-medium">{delivery.declaredQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Source</p>
              <p className="font-medium">{delivery.source}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{delivery.timestamp}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isRejecting ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Quantity (L)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={actualQuantity}
                  onChange={(e) => setActualQuantity(e.target.value)}
                  required
                  min="0"
                  step="0.1"
                />
                {actualQuantity && Number(actualQuantity) !== Number(delivery.declaredQuantity.replace('L', '')) && (
                  <p className="text-orange-600 text-sm mt-1 flex items-center gap-1">
                    <FiAlertTriangle />
                    Quantity differs from declared amount
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Assessment
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  required
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
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
                  placeholder="Any additional information..."
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
                placeholder="Explain why this delivery is being rejected..."
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {!isRejecting && (
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <FiX />
                <span>Reject</span>
              </button>
            )}
            {isRejecting && (
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isRejecting
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRejecting ? <FiX /> : <FiCheck />}
              <span>{isRejecting ? 'Confirm Rejection' : 'Verify Delivery'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryVerificationModal; 