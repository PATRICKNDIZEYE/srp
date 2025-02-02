import React, { useState } from 'react';
import BaseLoginForm from '../../components/Authentication/BaseLoginForm';
import OTPVerification from '../../components/Authentication/OTPVerification';

const ProductionSignIn = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState('');

  const handleLoginSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setShowOTP(true);
  };

  return showOTP ? (
    <OTPVerification phone={phone} role="production" />
  ) : (
    <BaseLoginForm role="production" onSuccess={handleLoginSuccess} />
  );
};

export default ProductionSignIn; 