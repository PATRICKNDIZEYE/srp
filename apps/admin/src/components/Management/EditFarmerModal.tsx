import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

interface EditFarmerModalProps {
  farmer: any; // Define the type for farmer if available
  onClose: () => void;
  onSubmit: (farmerData: any) => void;
}

const EditFarmerModal: React.FC<EditFarmerModalProps> = ({ farmer, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: farmer.firstName || '',
    lastName: farmer.lastName || '',
    nationalId: farmer.nationalId || '',
    phoneNumber: farmer.phoneNumber || '',
    status: farmer.status || 'active',
    // Add other fields as necessary
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const farmerData = {
        ...formData,
        id: farmer.id, // Ensure the farmer ID is included for updates
      };

      console.log('Submitting edited farmer data:', farmerData);

      await axiosInstance.put(`/farmers/${farmer.id}`, farmerData);
      toast.success('Farmer updated successfully!');
      onSubmit(farmerData);
      onClose();
    } catch (error) {
      console.error('Error updating farmer:', error);
      toast.error('Failed to update farmer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Farmer</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.firstName}
                onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.lastName}
                onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                National ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.nationalId}
                onChange={e => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.phoneNumber}
                onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Farmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarmerModal; 