import React, { useState } from 'react';
import BaseLoginForm from '../../components/Authentication/BaseLoginForm';
import OTPVerification from '../../components/Authentication/OTPVerification';

const TransportSignIn = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState('');

  const handleLoginSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setShowOTP(true);
  };

  return showOTP ? (
    <OTPVerification phone={phone} role="transport" />
  ) : (
    <BaseLoginForm role="transport" onSuccess={handleLoginSuccess} />
  );
};

export default TransportSignIn; 