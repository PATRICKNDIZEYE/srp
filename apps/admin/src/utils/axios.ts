import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:2025/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          // Token is expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/signin';
          return Promise.reject('Token expired');
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/signin';
          break;
        case 403:
          toast.error('You do not have permission to access this resource');
          break;
        case 404:
          console.error('Resource not found:', error.config.url);
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 