import React from 'react';
import { formatNumber } from '../../utils/formatters';

interface Payment {
  id: number;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  paidAt: string | null;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Yishyuwe';
      case 'pending':
        return 'Itegerejwe';
      case 'cancelled':
        return 'Yahagaritswe';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Amafaranga Yishyuwe</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Itariki</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amafaranga</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Igihe</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Imiterere</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 text-sm">
                  {new Date(payment.paidAt || payment.endDate).toLocaleDateString('rw-RW')}
                </td>
                <td className="px-4 py-3 text-sm">
                  RWF {formatNumber(payment.amount)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(payment.startDate).toLocaleDateString('rw-RW')} - 
                  {new Date(payment.endDate).toLocaleDateString('rw-RW')}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                    {translateStatus(payment.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory; 