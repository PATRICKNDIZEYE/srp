import axios from 'axios';

// Function to get token, initially a placeholder
let getToken = () => localStorage.getItem('adminToken');

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: 'https://api.gasabomilk.rw/api',
    headers: {
        // Add any default headers here if needed
    },
    timeout: 10000, // Add timeout for requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to set the token retrieval function
export const setTokenGetter = (getter: () => string | null) => {
    getToken = getter;
};

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('ngoData');
            window.location.href = '/signin';
        }
        let errorMessage = 'An error occurred';

        if (error.response) {
            // Extract error message from HTML response if present
            if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                const match = error.response.data.match(/<pre>Error: (.*?)<br>/);
                if (match && match[1]) {
                    errorMessage = match[1];
                    // Update the error response to include the extracted message
                    error.response.data = { 
                        status: 'error',
                        message: errorMessage 
                    };
                }
            } else if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
        } else if (error.request) {
            errorMessage = 'No response from server';
        } else {
            errorMessage = error.message;
        }

        // Add the parsed error message to the error object
        error.parsedMessage = errorMessage;

        return Promise.reject(error);
    }
);

export default axiosInstance;
