import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { isValidPhone } from '../../utils/validation';
import axiosInstance from '../../utils/axiosInstance';
import { useUserContext } from '../../context/UserContext';
import { jwtDecode } from 'jwt-decode';

interface BaseLoginFormProps {
  role: 'farmer' | 'poc' | 'transport' | 'production' | 'management' | 'diary';
  onSuccess: (phone: string) => void;
}

const BaseLoginForm: React.FC<BaseLoginFormProps> = ({ role, onSuccess }) => {
  const { setUser } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
  });

  // Define user data endpoints for each role
  const userEndpoints: Record<string, string> = {
    farmer: '/farmer/phone/',
    poc: '/pocs/phone/',
    transport: '/transports/phone/',
    production: '/production/phone/',
    management: '/users/phone/',
    diary: '/diary/phone/',
  };

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
      production: '/login-production',
      management: '/login-admin',
      diary: '/login-diary',
    };

    try {
      // Prepare the data to be sent in the request
      let requestData;
      if (role === 'poc' || role === 'transport' || role === 'diary' || role === 'production') {
        requestData = { phoneNumber: formData.phone, password: formData.password };
      } else {
        requestData = { phone: formData.phone, password: formData.password };
      }

      // Make a POST request to the appropriate endpoint using axiosInstance
      const response = await axiosInstance.post(endpoints[role], requestData);

      if (response.status === 200) {
        const { token } = response.data;
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        localStorage.setItem('token', token);
        localStorage.setItem('role', decodedToken.role);

        toast.success('Login successful!');
        onSuccess(formData.phone);

        // Store token and role in local storage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', role);
        console.log('Stored role:', response.data.role);
        console.log('Stored userRole:', localStorage.getItem('userRole'));

        // Fetch user data after successful login
        try {
          const userResponse = await axiosInstance.get(`${userEndpoints[role]}${formData.phone}`);
          console.log('User data response:', userResponse);

          if (userResponse.status === 200) {
            // Store user data in local storage
            localStorage.setItem('userData', JSON.stringify(userResponse.data));
            console.log('User data stored in local storage:', userResponse.data);

            // Update the UserContext with the fetched user data
            setUser(userResponse.data);
          } else {
            toast.error('Failed to fetch user data');
          }
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
          toast.error('An error occurred while fetching user data');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
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