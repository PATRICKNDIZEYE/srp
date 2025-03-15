import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

interface AddProductionModalProps {
  onClose: () => void;
  onAdd: () => void;
  initialTransportId: string | null;
  deliveryId: string;
  maxAmount: number;
}

const AddProductionModal: React.FC<AddProductionModalProps> = ({ onClose, onAdd, initialTransportId, deliveryId, maxAmount }) => {
  const [formData, setFormData] = useState({
    transportId: initialTransportId || '',
    productionId: deliveryId,
    amount: '',
    transportStatus: 'Pending',
  });

  const [transportOptions, setTransportOptions] = useState([]);
  const [productionOptions, setProductionOptions] = useState([]);

  useEffect(() => {
    // Retrieve userData from local storage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData.id) {
        setFormData((prev) => ({ ...prev, transportId: parsedUserData.id.toString() }));
      }
    }

    const fetchTransportOptions = async () => {
      try {
        const response = await axiosInstance.get('/transports');
        setTransportOptions(response.data);
      } catch (error) {
        toast.error('Failed to load transport options');
      }
    };

    const fetchProductionOptions = async () => {
      try {
        const response = await axiosInstance.get('/production');
        setProductionOptions(response.data);
      } catch (error) {
        toast.error('Failed to load production options');
      }
    };

    fetchTransportOptions();
    fetchProductionOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(formData.amount);

    if (amountNum > maxAmount) {
      toast.error(`Amount cannot exceed the maximum allowed: ${maxAmount}L`);
      return;
    }

    const dataToSend = {
      ...formData,
      transportId: Number(formData.transportId),
      productionId: Number(formData.productionId),
      amount: amountNum,
    };

    try {
      await axiosInstance.post('/delivery', dataToSend);
      toast.success('Production added successfully');
      onAdd();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to add production: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Production</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transport ID</label>
            <input
              type="text"
              name="transportId"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.transportId}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Production ID</label>
            <select
              name="productionId"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.productionId}
              onChange={handleChange}
              required
            >
              <option value="">Select a production</option>
              {productionOptions.map((production: any) => (
                <option key={production.id} value={production.id}>
                  {production.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Maximum: {maxAmount}L)</label>
            <input
              type="number"
              name="amount"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.amount}
              onChange={handleChange}
              max={maxAmount}
              required
            />
            <p className="text-sm text-gray-500">
              Remaining amount available: {maxAmount}L
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
              Add Production
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductionModal; 