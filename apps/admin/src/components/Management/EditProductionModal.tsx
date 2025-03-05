import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

interface EditProductionModalProps {
  production: {
    id: number;
    phoneNumber: string;
    username: string;
    status: string;
    approveStatus: string;
    longitude: string;
    latitude: string;
  };
  onClose: () => void;
  onEdit: () => void;
}

const EditProductionModal: React.FC<EditProductionModalProps> = ({ production, onClose, onEdit }) => {
  const [formData, setFormData] = useState(production);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/productions/${production.id}`, formData);
      toast.success('Production updated successfully!');
      onEdit();
      onClose();
    } catch (error) {
      toast.error('Failed to update production');
    }
  };

  const generateLocation = () => {
    const randomLongitude = (Math.random() * 360 - 180).toFixed(6);
    const randomLatitude = (Math.random() * 180 - 90).toFixed(6);
    setFormData({ ...formData, longitude: randomLongitude, latitude: randomLatitude });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
        <h2 className="text-xl font-semibold mb-4">Edit Production</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input type="text" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Approve Status</label>
            <input type="text" name="approveStatus" value={formData.approveStatus} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={generateLocation} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Generate Location</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductionModal; 