import React, { useState } from 'react';
import BaseLoginForm from '../../components/Authentication/BaseLoginForm';
import OTPVerification from '../../components/Authentication/OTPVerification';

const DiarySignIn = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [phone, setPhone] = useState('');

  const handleLoginSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setShowOTP(true);
  };

  return showOTP ? (
    <OTPVerification phone={phone} role="diary" />
  ) : (
    <BaseLoginForm role="diary" onSuccess={handleLoginSuccess} />
  );
};

export default DiarySignIn; 