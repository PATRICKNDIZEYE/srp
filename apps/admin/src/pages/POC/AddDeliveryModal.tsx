import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

interface AddDeliveryModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddDeliveryModal: React.FC<AddDeliveryModalProps> = ({ onClose, onAdd }) => {
  const [transportId, setTransportId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [transports, setTransports] = useState([]);

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        const response = await axiosInstance.get('/transports');
        setTransports(response.data);
      } catch (error) {
        toast.error('Failed to load transports');
      }
    };

    fetchTransports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              Add Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeliveryModal; 