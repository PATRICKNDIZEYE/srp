import React, { useState, useEffect } from 'react';
import './EditPocForm.css'; // Import the CSS file for styling

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

interface PocData {
  firstName: string;
  lastName: string;
  birthday: string;
  nationalId: string;
  phoneNumber: string;
  longitude: number;
  latitude: number;
  username: string;
  password: string;
  address: Address;
  status: string;
}

interface EditPocFormProps {
  onSubmit: (data: PocData) => void;
  onClose: () => void;
  initialData: PocData | null; // Allow initialData to be null
}

const EditPocForm: React.FC<EditPocFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<PocData>(initialData || {
    firstName: '',
    lastName: '',
    birthday: '',
    nationalId: '',
    phoneNumber: '',
    longitude: 0,
    latitude: 0,
    username: '',
    password: '',
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    status: 'active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value
      }
    }));
  };

  const handleGenerateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          }));
        },
        (error) => {
          console.error("Error fetching location: ", error);
          alert("Failed to fetch location. Please ensure location services are enabled.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!initialData) {
    return null; // Render nothing if initialData is not available
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg overflow-y-auto max-h-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit POC</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <label className="w-full">
              First Name
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First Name"
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </label>
            <label className="w-full">
              Last Name
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last Name"
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </label>
          </div>
          <label className="w-full">
            Birthday
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              placeholder="Birthday"
              onChange={handleChange}
              className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <label className="w-full">
            National ID
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              placeholder="National ID"
              onChange={handleChange}
              className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <label className="w-full">
            Phone Number
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder="Phone Number"
              onChange={handleChange}
              className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <div className="flex gap-4">
            <label className="w-full">
              Longitude
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                placeholder="Longitude"
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </label>
            <label className="w-full">
              Latitude
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                placeholder="Latitude"
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </label>
          </div>
          <div className="mb-4 text-center">
            <button
              type="button"
              onClick={handleGenerateLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Generate Location
            </button>
          </div>
          <label className="w-full">
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleChange}
              className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <label className="w-full">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <div className="flex gap-4">
            <label className="w-full">
              Street
              <input
                type="text"
                name="street"
                value={formData.address.street}
                placeholder="Street"
                onChange={handleAddressChange}
                className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </label>
            <label className="w-full">
              City
              <input
                type="text"
                name="city"
                value={formData.address.city}
                placeholder="City"
                onChange={handleAddressChange}
                className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </label>
          </div>
          <label className="w-full">
            Postal Code
            <input
              type="text"
              name="postalCode"
              value={formData.address.postalCode}
              placeholder="Postal Code"
              onChange={handleAddressChange}
              className="input border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Update POC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPocForm; 