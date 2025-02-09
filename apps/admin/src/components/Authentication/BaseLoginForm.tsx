import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { isValidPhone } from '../../utils/validation';
import axiosInstance from '../../utils/axiosInstance';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(formData.phone)) {
      setErrors({
        ...errors,
        phone: 'Please enter a valid Rwandan phone number',
      });
      return;
    }

    // Define endpoints for each role
    const endpoints: Record<string, string> = {
      farmer: '/auth/farmer/login',
      poc: '/login-poc',
      transport: 'login-transport',
      production: '/api/auth/production/login',
      management: '/api/auth/management/login',
      diary: '/login-diary',
    };

    try {
      // Prepare the data to be sent in the request
      let requestData;
      if (role === 'poc' || role === 'transport') {
        requestData = { phoneNumber: formData.phone, password: formData.password };
      } else if (role === 'diary') {
        requestData = { phoneNumber: formData.phone, password: formData.password };
      } else {
        requestData = { phone: formData.phone, password: formData.password };
      }

      // Make a POST request to the appropriate endpoint using axiosInstance
      const response = await axiosInstance.post(endpoints[role], requestData);

      if (response.status === 200) {
        toast.success('Login successful!');
        onSuccess(formData.phone);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
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