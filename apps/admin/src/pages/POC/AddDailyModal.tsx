import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { useUser } from '../../context/UserContext';

interface AddDailyModalProps {
  onClose: () => void;
  onAdd: () => void;
  initialTransportId?: string | null;
  deriveryId: string;
  maxVolumeDifference: number;
}

const AddDailyModal: React.FC<AddDailyModalProps> = ({ onClose, onAdd, initialTransportId, deriveryId, maxVolumeDifference }) => {
  const { user } = useUser();
  const [diaryId, setDiaryId] = useState('');
  const [transportId, setTransportId] = useState(initialTransportId || '');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Pending');
  const [diaries, setDiaries] = useState([]);
  const [transports, setTransports] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<{ id: number; firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transportResponse = await axiosInstance.get(`/transportations/${deriveryId}`);
        const transportData = transportResponse.data;
        setTransports([transportData.transport]);
        setSelectedTransport(transportData.transport);
        setTransportId(transportData.transport.id.toString());

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

    if (amountNum > maxVolumeDifference) {
      toast.error(`Amount cannot exceed the maximum allowed: ${maxVolumeDifference}L`);
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
                {transports.map((transport) => (
                  <option key={transport.id} value={transport.id}>
                    {transport.firstName} {transport.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Maximum: {maxVolumeDifference}L)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={maxVolumeDifference}
              required
            />
            <p className="text-sm text-gray-500">
              Remaining amount available: {maxVolumeDifference}L
            </p>
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