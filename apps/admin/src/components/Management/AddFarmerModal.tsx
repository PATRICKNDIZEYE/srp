import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiMapPin, FiLoader } from 'react-icons/fi';
import { isValidPhone } from '../../utils/validation';
import axiosInstance from '../../utils/axios';
import { AxiosError } from 'axios';

// Define a type for POC
type POC = {
  id: string;
  firstName: string;
  lastName: string;
};

interface AddFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFarmerModal: React.FC<AddFarmerModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [pocs, setPocs] = useState<POC[]>([]);

  const [formData, setFormData] = useState({
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
    cell: '',
    copyField: '',
    pocId: ''
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    location: ''
  });

  useEffect(() => {
    const fetchPocs = async () => {
      try {
        const response = await axiosInstance.get('/pocs');
        setPocs(response.data);
      } catch (error) {
        console.error('Error fetching POCs:', error);
      }
    };

    fetchPocs();
  }, []);

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
            toast.warning('Amwe mu makuru y\'aho uherereye ntabwo yuzuye. Nyamuneka uzuza ubwawe.');
          }
        } catch (error) {
          setLocationError('Ntibishoboye kubona aho uherereye. Nyamuneka uzuza ubwawe.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        let errorMessage = 'Ntibishoboye kubona aho uherereye.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Nyamuneka emerera urubuga kubona aho uherereye.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Aho uherereye ntabwo habashije kuboneka.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Igihe cyo kubona aho uherereye cyararenze.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(formData.phone)) {
      setErrors({
        ...errors,
        phone: 'Please enter a valid Rwandan phone number'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate nationalId
    if (!formData.nationalId || formData.nationalId.length !== 16) {
      toast.error('Please enter a valid national ID');
      return;
    }

    try {
      const formattedBirthday = formData.birthday
        ? new Date(formData.birthday).toISOString()
        : '1990-01-01T00:00:00.000Z';

      const registrationData = {
        firstName: formData.fullName.split(' ')[0] || '',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        birthday: formattedBirthday,
        nationalId: formData.nationalId,
        phoneNumber: formData.phone,
        longitude: parseFloat(formData.longitude) || 30.123456,
        latitude: parseFloat(formData.latitude) || -1.987654,
        username: formData.fullName.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000),
        password: formData.password,
        farmDetails: formData.location || 'Farm in Kigali',
        status: 'Active',
        pocId: formData.pocId
      };

      console.log('Registration Data:', registrationData);

      const response = await axiosInstance.post('/register-farmer', registrationData);
      if (response.status === 201) {
        toast.success('Registration successful!');
        onClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response && axiosError.response.data) {
        toast.error(`Registration failed: ${axiosError.response.data.message}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleCopy = () => {
    setFormData(prev => ({
      ...prev,
      fullName: prev.copyField
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 my-8">
        <h2 className="text-2xl font-bold mb-4">Add New Farmer</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
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
            <label className="block text-gray-700 mb-2">Copy Field</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.copyField}
              onChange={(e) => setFormData({ ...formData, copyField: e.target.value })}
              placeholder="Enter text to copy"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy to Full Name
            </button>
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
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Point of Contact (POC)</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.pocId}
              onChange={(e) => setFormData({ ...formData, pocId: e.target.value })}
              required
            >
              <option value="">Select POC</option>
              {pocs.map((poc) => (
                <option key={poc.id} value={poc.id}>
                  {poc.firstName} {poc.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
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

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Farmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFarmerModal;
