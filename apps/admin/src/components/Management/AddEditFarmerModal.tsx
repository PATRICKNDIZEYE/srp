import React, { useState } from 'react';
import { FiX, FiMapPin, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

interface AddEditFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const AddEditFarmerModal: React.FC<AddEditFarmerModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    phone: '',
    location: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    nationalId: '',
    longitude: '',
    latitude: '',
    farmType: '',
    farmSize: '',
    district: '',
    sector: '',
    cell: ''
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1&zoom=18`
          );
          const data = await response.json();
          const address = data.address;
          
          const district = address.county || address.city || address.town || address.district || '';
          const sector = address.suburb || address.village || address.subdivision || '';
          const cell = address.neighbourhood || address.hamlet || address.locality || '';

          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            district,
            sector,
            cell
          }));

          if (!district || !sector || !cell) {
            toast.warning('Some location details are missing. Please fill them manually.');
          }
        } catch (error) {
          setLocationError('Unable to fetch location. Please fill manually.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to fetch location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{initialData ? 'Edit Farmer' : 'Add Farmer'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder="Full Name"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">National ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                required
                placeholder="National ID"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Birthday</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="Phone Number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Location</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiMapPin />
                  )}
                  Use GPS
                </button>
              </div>
              {locationError && (
                <p className="text-red-500 text-sm mb-4">{locationError}</p>
              )}
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="District"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Sector"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Cell"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cell}
                  onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition-colors font-medium"
          >
            {initialData ? 'Save Changes' : 'Add Farmer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditFarmerModal; 