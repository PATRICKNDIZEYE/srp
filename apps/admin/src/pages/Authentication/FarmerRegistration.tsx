import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { isValidPhone } from '../../utils/validation';
import axiosInstance from '../../utils/axiosInstance';
import axios, { AxiosError } from 'axios';

const FarmerRegistration = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    confirmPassword: ''
  });

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
    farmSize: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!isValidPhone(formData.phone)) {
      setErrors({
        ...errors,
        phone: 'Please enter a valid Rwandan phone number'
      });
      return;
    }

    if (isLogin) {
      // Login logic
      try {
        const response = await axiosInstance.post('/login-farmer', {
          phoneNumber: formData.phone,
          password: formData.password
        });
        console.log('Login successful:', response.data);
        toast.success('Login successful!');
        navigate('/farmer/dashboard');
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error during login:', axiosError.response ? axiosError.response.data : axiosError.message);
        toast.error('Invalid credentials');
      }
    } else {
      // Registration logic
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      try {
        const formattedBirthday = formData.birthday
          ? new Date(formData.birthday).toISOString()
          : '1990-01-01T00:00:00.000Z';

        const registrationData = {
          firstName: formData.fullName.split(' ')[0] || '',
          lastName: formData.fullName.split(' ')[1] || '',
          birthday: formattedBirthday,
          nationalId: formData.nationalId || '123456789',
          phoneNumber: formData.phone,
          longitude: parseFloat(formData.longitude) || 40.7128,
          latitude: parseFloat(formData.latitude) || 74.006,
          username: formData.fullName.split(' ')[0].toLowerCase() || 'lionson',
          password: formData.password,
          farmDetails: {
            type: formData.farmType || 'organic',
            size: formData.farmSize || '5 acres'
          },
          status: 'active'
        };

        console.log('Registration Data:', registrationData);

        // Make a POST request to register-farmer endpoint
        const response = await axiosInstance.post('/register-farmer', registrationData);
        if (response.status === 201) {
          toast.success('Registration successful! Please login.');
          setIsLogin(true);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
          toast.error(`Registration failed: ${axiosError.response.data.message}`);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Farmer Login' : 'Farmer Registration'}
          </h2>
          <p className="text-gray-600">
            {isLogin
              ? 'Welcome back! Please login to your account'
              : 'Create your farmer account to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Birthday</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.birthday}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">National ID</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Longitude</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Latitude</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Farm Type</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.farmType}
                  onChange={(e) =>
                    setFormData({ ...formData, farmType: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Farm Size</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.farmSize}
                  onChange={(e) =>
                    setFormData({ ...formData, farmSize: e.target.value })
                  }
                  required
                />
              </div>
            </>
          )}

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

          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegistration; 