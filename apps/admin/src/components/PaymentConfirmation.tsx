import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';

interface PaymentConfirmationProps {
  paymentId: number;
  amount: number;
  farmerPhone: string;
  onConfirm: () => void;
}

const PaymentConfirmation = ({ paymentId, amount, farmerPhone, onConfirm }: PaymentConfirmationProps) => {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await axiosInstance.post(`/payments/${paymentId}/confirm`, {
        amount,
        phoneNumber: farmerPhone
      });
      
      toast.success('Iyishyurwa ryemejwe kandi ubutumwa bwoherejwe');
      onConfirm();
    } catch (error) {
      toast.error('Hari ikibazo. Ongera ugerageze.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleConfirm}
        disabled={confirming}
        className={`px-3 py-1 text-sm rounded-full ${
          confirming 
            ? 'bg-gray-100 text-gray-400' 
            : 'bg-green-100 text-green-800 hover:bg-green-200'
        }`}
      >
        {confirming ? 'Biratunganywa...' : 'Emeza Iyishyurwa'}
      </button>
    </div>
  );
};

export default PaymentConfirmation; 