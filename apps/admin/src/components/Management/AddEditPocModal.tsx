import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface Poc {
  firstName: string;
  lastName: string;
  birthday: string;
  nationalId: string;
  phoneNumber: string;
  longitude: number | string;
  latitude: number | string;
  username: string;
  password: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  status: string;
}

interface AddEditPocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Poc) => void;
  initialData?: Poc;
}

const AddEditPocModal: React.FC<AddEditPocModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Poc>(initialData || {
    firstName: '',
    lastName: '',
    birthday: '',
    nationalId: '',
    phoneNumber: '',
    longitude: '',
    latitude: '',
    username: '',
    password: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
    },
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
          <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit POC' : 'Add POC'}</h2>
          <form onSubmit={handleSubmit}>
            {/* Form fields similar to AddTransportForm */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            {/* Add other fields similarly */}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
            </div>
          </form>
        </div>
      </div>
    ) : null
  );
};

export default AddEditPocModal; 