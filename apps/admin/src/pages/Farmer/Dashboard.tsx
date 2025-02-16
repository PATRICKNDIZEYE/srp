import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import { formatNumber } from '../../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [dashboardData, setDashboardData] = useState({
    totalMilk: 0,
    pendingPayment: 0,
    nextPaymentDays: 0,
    loanStatus: 'Not Available',
    recentSubmissions: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get milk submissions data
        const milkResponse = await axiosInstance.get(`/milk-submissions/farmer/${user.id}`);
        
        // Get payment data
        const paymentResponse = await axiosInstance.get(`/payment/farmer/${user.id}/summary`);

        setDashboardData({
          totalMilk: milkResponse.data.totalAmount || 0,
          pendingPayment: paymentResponse.data.pendingPayment || 0,
          nextPaymentDays: paymentResponse.data.daysUntilNextPayment || 0,
          loanStatus: 'Not Available', // You can update this based on loan status
          recentSubmissions: milkResponse.data.recentSubmissions || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Itegerejwe';
      case 'accepted':
        return 'Yemewe';
      case 'rejected':
        return 'Yanzwe';
      default:
        return status;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Ikaze {user.firstName}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Amata Yose</h3>
          <p className="text-2xl font-semibold">{dashboardData.totalMilk} L</p>
          <p className="text-sm text-green-500">15% Yiyongereye</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Amafaranga Ategerejwe</h3>
          <p className="text-2xl font-semibold">RWF {formatNumber(dashboardData.pendingPayment)}</p>
          <p className="text-sm text-blue-500">Mu minsi {dashboardData.nextPaymentDays}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Iminsi Isigaye</h3>
          <p className="text-2xl font-semibold">{dashboardData.nextPaymentDays} Days</p>
          <p className="text-sm text-green-500">Kuri Gahunda</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Inguzanyo</h3>
          <p className="text-2xl font-semibold">RWF 0</p>
          <p className="text-sm text-gray-500">Ntabwo Ihari</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Action Buttons */}
        <button
          onClick={() => navigate('/farmer/submit-milk')}
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700"
        >
          <h3 className="text-xl font-semibold mb-2">Gutanga Amata</h3>
          <p className="text-blue-100">Kanda hano utange amata</p>
        </button>

        <button
          onClick={() => navigate('/farmer/loan')}
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700"
        >
          <h3 className="text-xl font-semibold mb-2">Saba Inguzanyo</h3>
          <p className="text-green-100">Kanda hano usabe inguzanyo</p>
        </button>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Amata Watanze Vuba</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Itariki</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ubwoko</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ingano</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Imiterere</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dashboardData.recentSubmissions.map((submission: any) => (
              <tr key={submission.id}>
                <td className="px-6 py-4">
                  {new Date(submission.createdAt).toLocaleDateString('rw-RW')}
                </td>
                <td className="px-6 py-4">{submission.milkType}</td>
                <td className="px-6 py-4">{submission.amount} L</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    submission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {translateStatus(submission.status)}
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

export default Dashboard; 