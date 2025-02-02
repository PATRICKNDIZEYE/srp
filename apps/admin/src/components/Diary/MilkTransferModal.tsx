import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiTruck, FiArrowRight } from 'react-icons/fi';

interface MilkTransferModalProps {
  onClose: () => void;
  onSubmit: (data: {
    type: 'request' | 'send';
    diaryId: string;
    milkType: string;
    quantity: string;
    urgency: string;
    notes: string;
  }) => void;
}

const MilkTransferModal: React.FC<MilkTransferModalProps> = ({ onClose, onSubmit }) => {
  const [transferType, setTransferType] = useState<'request' | 'send'>('request');
  const [selectedDiary, setSelectedDiary] = useState('');
  const [milkType, setMilkType] = useState('fresh');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [notes, setNotes] = useState('');

  // Dummy data - would come from backend
  const nearbyDiaries = [
    { id: '1', name: 'Kigali Central Diary', distance: '2.5km' },
    { id: '2', name: 'Nyamirambo Diary', distance: '5km' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: transferType,
      diaryId: selectedDiary,
      milkType,
      quantity: `${quantity}L`,
      urgency,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Milk Transfer</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg ${
                transferType === 'request'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setTransferType('request')}
            >
              Request Milk
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg ${
                transferType === 'send'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setTransferType('send')}
            >
              Send Milk
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Diary
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedDiary}
              onChange={(e) => setSelectedDiary(e.target.value)}
              required
            >
              <option value="">Choose a diary</option>
              {nearbyDiaries.map((diary) => (
                <option key={diary.id} value={diary.id}>
                  {diary.name} ({diary.distance})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Milk Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={milkType}
              onChange={(e) => setMilkType(e.target.value)}
              required
            >
              <option value="fresh">Fresh Milk (Inshyushyu)</option>
              <option value="fermented">Fermented Milk (Ikivuguto)</option>
              <option value="cream">Cream (Amavuta)</option>
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
              <span>{transferType === 'request' ? 'Send Request' : 'Initiate Transfer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilkTransferModal; 