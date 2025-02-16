import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { FiDownload, FiCalendar } from 'react-icons/fi';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { useUser } from '../../context/UserContext';
import axiosInstance from '../../utils/axios';
import { formatNumber } from '../../utils/formatters';
import PaymentConfirmation from '../../components/PaymentConfirmation';

interface Payment {
  id: number;
  date: string;
  amount: number;
  status: string;
  milkSubmissions: {
    id: number;
    milkType: string;
    amount: number;
    rate: number;
  }[];
}

const PaymentsPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState({
    nextPayment: 0,
    daysUntilPayment: 0,
    monthlyTotal: 0,
    yearToDate: 0
  });

  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!user) return;
    fetchPaymentData();
  }, [user]);

  const fetchPaymentData = async () => {
    try {
      const [paymentsRes, summaryRes] = await Promise.all([
        axiosInstance.get(`/payments/farmer/${user?.id}`),
        axiosInstance.get(`/payments/farmer/${user?.id}/summary`)
      ]);

      setPayments(paymentsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected filters
  const filterData = (data: Payment[]) => {
    let filtered = [...data];

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        return itemDate >= start && itemDate <= end;
      });
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    return filtered;
  };

  if (loading) {
    return <div className="p-4">Biratunganywa...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Amafaranga n'Amata" />

      {/* Payment Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Ubwishyu Bukurikira</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(summary.nextPayment)} Rwf
            </div>
            <div className="text-sm text-gray-500">
              Mu minsi {summary.daysUntilPayment}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Uku Kwezi</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(summary.monthlyTotal)} Rwf
            </div>
            <div className="text-sm text-gray-500">
              Amata yose: {formatNumber(summary.monthlyTotal / 300)}L
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700">Yose Hamwe</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-800">
              {formatNumber(summary.yearToDate)} Rwf
            </div>
            <div className="text-sm text-gray-500">Uyu mwaka</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Amata n'Ubwishyu
            </h2>
            <div className="flex gap-4">
              <DateRangeFilter
                dateRange={dateRange}
                selectedPeriod={selectedPeriod}
                onDateRangeChange={setDateRange}
                onPeriodChange={setSelectedPeriod}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
              />
              <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                <FiDownload />
                <span>Kuramo Raporo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="px-6 border-t">
          <div className="flex space-x-4 -mb-px">
            {[
              { key: 'all', label: 'Yose' },
              { key: 'accepted', label: 'Yemewe' },
              { key: 'pending', label: 'Itegerejwe' },
              { key: 'rejected', label: 'Yanzwe' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`py-4 px-4 border-b-2 ${
                  key === selectedStatus
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Itariki
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ubwoko
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ingano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Igiciro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amafaranga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Imiterere
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filterData(payments).map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.milkSubmissions.map(sub => 
                      sub.milkType === 'inshushyu' ? 'Inshushyu' : 'Umuhondo'
                    ).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(payment.milkSubmissions.reduce((acc, sub) => acc + sub.amount, 0))}L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(payment.milkSubmissions[0]?.rate || 300)} Rwf/L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatNumber(payment.amount)} Rwf
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === 'pending' ? (
                      <PaymentConfirmation
                        paymentId={payment.id}
                        amount={payment.amount}
                        farmerPhone={user?.phoneNumber || ''}
                        onConfirm={fetchPaymentData}
                      />
                    ) : (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'paid' ? 'Yishyuwe' : 'Yanzwe'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage; 