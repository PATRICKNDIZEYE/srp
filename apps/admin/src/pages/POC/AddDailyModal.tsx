import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { useUser } from '../../context/UserContext';

interface AddDailyModalProps {
  onClose: () => void;
  onAdd: () => void;
  initialTransportId?: string | null;
  deriveryId: string;
}

const AddDailyModal: React.FC<AddDailyModalProps> = ({ onClose, onAdd, initialTransportId, deriveryId }) => {
  const { user } = useUser();
  const [diaryId, setDiaryId] = useState('');
  const [transportId, setTransportId] = useState(initialTransportId || '');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Completed');
  const [diaries, setDiaries] = useState([]);
  const [transports, setTransports] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get transportation details with remaining amount
        const transportResponse = await axiosInstance.get(`/transportations/${deriveryId}`);
        const transportData = transportResponse.data;
        setTransports([transportData.transport]);
        setSelectedTransport(transportData.transport);
        setTransportId(transportData.transport.id.toString());
        
        // Set the maximum amount from the remaining amount
        setMaxAmount(transportData.remainingAmount);

        // Fetch diaries
        const diariesResponse = await axiosInstance.get('/production');
        setDiaries(diariesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch required data');
      }
    };

    fetchData();
  }, [deriveryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);

    // Validate the amount
    if (maxAmount !== null && amountNum > maxAmount) {
      toast.error(`Amount cannot exceed the maximum allowed: ${maxAmount}L`);
      return;
    }

    const dataToSend = {
      diaryId: Number(diaryId),
      transportId: Number(transportId),
      deriveryId: Number(deriveryId),
      amount: amountNum,
      status,
    };

    try {
      await axiosInstance.post('/derived', dataToSend);
      toast.success('Daily entry added successfully');
      onAdd();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to add daily entry: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Daily Entry</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diary
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={diaryId}
              onChange={(e) => setDiaryId(e.target.value)}
              required
            >
              <option value="" disabled>Select a Diary</option>
              {diaries.map((diary: any) => (
                <option key={diary.id} value={diary.id}>
                  {diary.phoneNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transport
            </label>
            {selectedTransport ? (
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                value={`${selectedTransport.firstName} ${selectedTransport.lastName}`}
                readOnly
              />
            ) : (
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={transportId}
                onChange={(e) => setTransportId(e.target.value)}
                required
              >
                <option value="" disabled>Select a Transport</option>
                {transports.map((transport: any) => (
                  <option key={transport.id} value={transport.id}>
                    {transport.firstName} {transport.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Maximum: {maxAmount}L)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={maxAmount || undefined}
              required
            />
            {maxAmount !== null && (
              <p className="text-sm text-gray-500">
                Remaining amount available: {maxAmount}L
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
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
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDailyModal; 