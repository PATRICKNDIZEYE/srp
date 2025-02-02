import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { isValidPhone } from '../../utils/validation';

interface BaseLoginFormProps {
  role: 'farmer' | 'poc' | 'transport' | 'production' | 'management' | 'diary';
  onSuccess: (phone: string) => void;
}

const BaseLoginForm: React.FC<BaseLoginFormProps> = ({ role, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(formData.phone)) {
      setErrors({
        ...errors,
        phone: 'Please enter a valid Rwandan phone number',
      });
      return;
    }

    // Dummy credentials for each role
    const dummyCredentials: Record<string, { phone: string; password: string }[]> = {
      farmer: [
        { phone: '0780000000', password: 'farmer123' },
        { phone: '0780000001', password: 'farmer123' }, // Additional farmer accounts
        { phone: '0780000002', password: 'farmer123' },
      ],
      poc: [{ phone: '0780000010', password: 'poc123' }],
      transport: [{ phone: '0780000020', password: 'transport123' }],
      production: [{ phone: '0780000030', password: 'production123' }],
      management: [{ phone: '0780000040', password: 'admin123' }],
      diary: [{ phone: '0780000050', password: 'diary123' }],
    };

    // Check credentials
    const validCredentials = dummyCredentials[role].find(
      cred => cred.phone === formData.phone && cred.password === formData.password
    );

    if (validCredentials) {
      toast.success('Login successful!');
      onSuccess(formData.phone);
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {role.charAt(0).toUpperCase() + role.slice(1)} Login
          </h2>
          <p className="text-gray-600">
            Enter your credentials to access the dashboard
          </p>
          {role === 'farmer' && (
            <p className="mt-2 text-sm text-gray-500">
              Test credentials: 0780000000 / farmer123
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${
                errors.phone ? 'border-red-500' : ''
              }`}
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              placeholder="078XXXXXXX"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-blue-600 hover:underline text-sm"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Please contact system administrator');
            }}
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default BaseLoginForm; 