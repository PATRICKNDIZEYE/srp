import React, { useState } from 'react';
import { FiTruck, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface MilkRequestModalProps {
  onClose: () => void;
  onSubmit: (data: {
    source: string;
    quantity: string;
    urgency: string;
    notes: string;
  }) => void;
}

const MilkRequestModal: React.FC<MilkRequestModalProps> = ({ onClose, onSubmit }) => {
  const [source, setSource] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || !source) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      source,
      quantity: `${quantity}L`,
      urgency,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Request Milk Supply</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            >
              <option value="">Select source</option>
              <option value="diary">Diary</option>
              <option value="poc">Point of Collection</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (L)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency Level
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
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
              <FiTruck />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilkRequestModal; 