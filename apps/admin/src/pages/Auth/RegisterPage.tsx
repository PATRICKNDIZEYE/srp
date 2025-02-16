import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    role: 'farmer',
    status: 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.post('/auth/register', {
        ...formData,
        role: 'farmer',
        status: 'pending' // Set default status as pending
      });

      if (response.status === 201) {
        toast.success('Kwiyandikisha byagenze neza! Mutegereze kwemezwa na POC uri hafi yanyu.');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Hari ikibazo. Ongera ugerageze.');
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default RegisterPage; 