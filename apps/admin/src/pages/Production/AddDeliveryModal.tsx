import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { useUserContext } from '../../context/UserContext';

interface AddDeliveryModalProps {
  onClose: () => void;
  onAdd: () => void;
}

const AddDeliveryModal: React.FC<AddDeliveryModalProps> = ({ onClose, onAdd }) => {
  const { userId } = useUserContext();

  const [formData, setFormData] = useState({
    transportId: '',
    productionId: userId,
    amount: '',
    transportStatus: 'Pending',
    date: new Date().toISOString(),
  });

  const [transportOptions, setTransportOptions] = useState([]);

  useEffect(() => {
    const fetchTransportOptions = async () => {
      try {
        const response = await axiosInstance.get('/transports');
        setTransportOptions(response.data);
      } catch (error) {
        toast.error('Failed to load transport options');
      }
    };

    fetchTransportOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      transportId: Number(formData.transportId),
      amount: Number(formData.amount),
    };

    console.log('Data being sent:', dataToSend);

    try {
      const response = await axiosInstance.post('/delivery', dataToSend);
      toast.success('Delivery added successfully');
      onAdd();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to add delivery: ${error.response?.data?.message || error.message}`);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Transport ID</label>
            <select
              name="transportId"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.transportId}
              onChange={handleChange}
              required
            >
              <option value="">Select a transport</option>
              {transportOptions.map((transport: any) => (
                <option key={transport.id} value={transport.id}>
                  {transport.firstName} {transport.lastName}
                </option>
              ))}
            </select>
          </div>
          <input type="hidden" name="productionId" value={formData.productionId} />
          <input type="hidden" name="date" value={formData.date} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.amount}
              onChange={handleChange}
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