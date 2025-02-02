import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface OTPVerificationProps {
  phone: string;
  role: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ phone, role }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value && index < 5) {
      const nextInput = element.parentElement?.nextElementSibling?.querySelector('input');
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOTP = otp.join('');
    
    // Dummy OTP verification - assume 123456 is valid
    if (enteredOTP === '123456') {
      toast.success('OTP verified successfully!');
      navigate(`/${role}/dashboard`);
    } else {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verify OTP
          </h2>
          <p className="text-gray-600">
            Enter the 6-digit code sent to {phone}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between max-w-xs mx-auto">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                className="w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          {timeLeft > 0 ? (
            <p className="text-gray-600">Resend code in {timeLeft}s</p>
          ) : (
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                setTimeLeft(30);
                toast.info('New OTP sent!');
              }}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 