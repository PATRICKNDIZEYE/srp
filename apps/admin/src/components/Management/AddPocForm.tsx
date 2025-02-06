import React, { useState } from 'react';

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

interface AddPocFormProps {
  onSubmit: (data: PocData) => void;
  onClose: () => void;
}

const AddPocForm: React.FC<AddPocFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<PocData>({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add POC</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="input" />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="input" />
          </div>
          <input type="date" name="birthday" placeholder="Birthday" onChange={handleChange} className="input" />
          <input type="text" name="nationalId" placeholder="National ID" onChange={handleChange} className="input" />
          <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="input" />
          <div className="flex gap-4">
            <input type="number" name="longitude" placeholder="Longitude" onChange={handleChange} className="input" />
            <input type="number" name="latitude" placeholder="Latitude" onChange={handleChange} className="input" />
          </div>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} className="input" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" />
          <div className="flex gap-4">
            <input type="text" name="street" placeholder="Street" onChange={handleAddressChange} className="input" />
            <input type="text" name="city" placeholder="City" onChange={handleAddressChange} className="input" />
            <input type="text" name="postalCode" placeholder="Postal Code" onChange={handleAddressChange} className="input" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Add POC</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPocForm; 