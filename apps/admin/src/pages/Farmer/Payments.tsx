import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { formatNumber, formatDate } from '../../utils/formatters';
import PaymentSummary from '../../components/Farmer/PaymentSummary';
import PaymentHistory from '../../components/Farmer/PaymentHistory';

const Payments = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [paymentData, setPaymentData] = useState({
    currentCycleMilk: 0,
    pendingPayment: 0,
    daysUntilNextPayment: 0,
    nextPaymentDate: new Date().toISOString(),
    paymentHistory: []
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axiosInstance.get(`/payment/farmer/${user.id}/summary`);
        setPaymentData(response.data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };

    fetchPaymentData();
  }, [user.id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Kwishyurwa</h1>

      <PaymentSummary {...paymentData} />

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Uko Wishyurwa</h2>
        <div className="space-y-4 text-gray-600">
          <p>• Wishyurwa buri minsi 15</p>
          <p>• Amata yose watanze muri iyi minsi 15 abarwa</p>
          <p>• Igiciro kiri kuri {formatNumber(500)} Rwf kuri litiro</p>
          <p>• Amafaranga ashyirwa kuri konti yawe ya Mobile Money</p>
          <p>• Ubwishyu bukorwa ku itariki ya 15 na 30 bya buri kwezi</p>
        </div>
      </div>

      <div className="mt-8">
        <PaymentHistory payments={paymentData.paymentHistory} />
      </div>
    </div>
  );
};

export default Payments; 