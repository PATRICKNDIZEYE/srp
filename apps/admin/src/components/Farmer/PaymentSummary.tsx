import React from 'react';
import { FiDollarSign, FiCalendar, FiClock } from 'react-icons/fi';
import { formatNumber } from '../../utils/formatters';

interface PaymentSummaryProps {
  currentCycleMilk: number;
  pendingPayment: number;
  daysUntilNextPayment: number;
  nextPaymentDate: string;
}

const PaymentSummary = ({ 
  currentCycleMilk, 
  pendingPayment, 
  daysUntilNextPayment, 
  nextPaymentDate 
}: PaymentSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Amata y'iki cyumweru</p>
            <p className="text-xl font-semibold">{currentCycleMilk} L</p>
          </div>
          <FiDollarSign className="text-blue-500 w-8 h-8" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Amafaranga Ategerejwe</p>
            <p className="text-xl font-semibold">RWF {formatNumber(pendingPayment)}</p>
          </div>
          <FiCalendar className="text-green-500 w-8 h-8" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Iminsi Isigaye</p>
            <p className="text-xl font-semibold">{daysUntilNextPayment} Days</p>
            <p className="text-sm text-gray-500">
              {new Date(nextPaymentDate).toLocaleDateString('rw-RW')}
            </p>
          </div>
          <FiClock className="text-orange-500 w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary; 