import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { useUser } from '../../context/UserContext';

interface AddDeliveryModalProps {
  onClose: () => void;
  onAdd: () => void;
  totalQuantitySum: number;
}

const AddDeliveryModal: React.FC<AddDeliveryModalProps> = ({ onClose, onAdd, totalQuantitySum }) => {
  const { user } = useUser();
  const [transportId, setTransportId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [transports, setTransports] = useState([]);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        const response = await axiosInstance.get('/transports');
        setTransports(response.data);
      } catch (error) {
        toast.error('Failed to load transports');
      }
    };

    const fetchMaxAmount = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '[]');
        const userId = userData[0]?.id;
        console.log('Fetched userId from localStorage:', userId);
        const response = await axiosInstance.get(`/milk-transportation/calculate-by-poc/${userId}`);
        setMaxAmount(response.data.totalAmount - totalQuantitySum);
      } catch (error) {
        toast.error('Failed to load maximum amount');
      }
    };

    fetchTransports();
    fetchMaxAmount();
  }, [totalQuantitySum]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the amount before submission
    if (maxAmount !== null && parseFloat(amount) > maxAmount) {
      toast.error(`Amount cannot exceed the maximum limit of ${maxAmount}`);
      return;
    }

    try {
      const deliveryData = {
        transportId: Number(transportId),
        pocId: 1,
        amount: parseFloat(amount),
        transportStatus: status.trim(),
      };

      await axiosInstance.post('/transportations', deliveryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Delivery added successfully');
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding delivery:', error instanceof Error ? error.message : 'Unknown error');
      toast.error('Failed to add delivery');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Delivery</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transport
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={transportId}
              onChange={(e) => setTransportId(e.target.value)}
              required
            >
              <option value="">Select Transport</option>
              {transports.map((transport: any) => (
                <option key={transport.id} value={transport.id}>
                  {transport.firstName} {transport.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              max={maxAmount || undefined}
            />
            {maxAmount !== null && (
              <p className="text-sm text-gray-500">Maximum amount: {maxAmount}</p>
            )}
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
              Add Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeliveryModal; 