import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiDroplet, FiDollarSign, FiClock, FiCreditCard } from 'react-icons/fi';
import ChartOne from '../../components/Charts/ChartOne';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import { useUser } from '../../context/UserContext';

interface FarmerData {
  id: number;
  firstName: string;
  lastName: string;
  pendingPayment: number;
  paymentDueDays: number;
  nextPaymentDays: number;
  loanAmount: number;
  loanAvailable: boolean;
}

interface MilkSubmission {
  id: number;
  amount: number;
  milkType: string;
  status: string;
  createdAt: string;
}

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showMilkSubmissionModal, setShowMilkSubmissionModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null);
  const [milkSubmissions, setMilkSubmissions] = useState<MilkSubmission[]>([]);
  const [paymentData, setPaymentData] = useState({
    pendingPayment: 0,
    daysUntilNextPayment: 0,
    totalMilk: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      // // Log user id and token
      // console.log('User ID:', user.id);
      // console.log('User Token:', user.token);

      try {
        // Get milk submissions data
        const milkResponse = await axiosInstance.get(`/milk-submissions/farmer/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        console.log('Milk submissions:', milkResponse.data);
        
        if (milkResponse.data) {
          setMilkSubmissions(milkResponse.data.submissions || []);
          setPaymentData(prev => ({
            ...prev,
            totalMilk: milkResponse.data.totalAmount || 0
          }));
        }

        // Get payment data
        const paymentResponse = await axiosInstance.get(`/payment/farmer/${user.id}/summary`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        console.log('Payment data:', paymentResponse.data);
        
        if (paymentResponse.data) {
          setPaymentData(prev => ({
            ...prev,
            pendingPayment: paymentResponse.data.pendingPayment || 0,
            daysUntilNextPayment: paymentResponse.data.daysUntilNextPayment || 0
          }));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Habaye ikibazo. Ongera ugerageze.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Tegereza gato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Ongera Ugerageze
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Farmer Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Amata Yose"
          total={`${paymentData.totalMilk} L`}
          rate="15% Yiyongereye"
          levelUp={true}
        >
          <FiDroplet className="text-primary" />
        </CardDataStats>

        <CardDataStats
          title="Amafaranga Ategerejwe"
          total={`RWF ${paymentData.pendingPayment}`}
          rate={`Mu minsi ${paymentData.daysUntilNextPayment}`}
          levelUp={true}
        >
          <FiDollarSign className="text-primary" />
        </CardDataStats>

        <CardDataStats
          title="Iminsi Isigaye"
          total={`${paymentData.daysUntilNextPayment} Days`}
          rate="Kuri Gahunda"
          levelUp={true}
        >
          <FiClock className="text-primary" />
        </CardDataStats>

        <CardDataStats
          title="Inguzanyo"
          total="RWF 0"
          rate="Ntabwo Ihari"
          levelUp={false}
        >
          <FiCreditCard className="text-primary" />
        </CardDataStats>
      </div>

      {/* Action Buttons */}
      {/* <div className="mt-6 grid gap-4 md:grid-cols-2">
        <button
          onClick={() => setShowMilkSubmissionModal(true)}
          className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit New Milk Collection
        </button>
        <button
          onClick={() => setShowLoanModal(true)}
          className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Request Loan
        </button>
      </div> */}

      {/* Recent Submissions Table */}
      <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-xl font-semibold">Amata Watanze Vuba</h3>
        </div>
        <div className="overflow-x-auto">
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
              {milkSubmissions.length > 0 ? (
                milkSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                        {submission.status === 'accepted' ? 'Yemewe' :
                         submission.status === 'pending' ? 'Itegerejwe' :
                         'Yanzwe'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nta mata watanze ubu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Milk Submission Modal */}
      {showMilkSubmissionModal && (
        <MilkSubmissionModal onClose={() => setShowMilkSubmissionModal(false)} />
      )}

      {/* Loan Request Modal */}
      {showLoanModal && (
        <LoanRequestModal onClose={() => setShowLoanModal(false)} />
      )}
    </div>
  );
};

// Milk Submission Modal Component
const MilkSubmissionModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    milkType: '',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission logic here
    toast.success('Milk submission recorded! Waiting for POC confirmation.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Submit Milk Collection</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Milk Type</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.milkType}
              onChange={(e) => setFormData({ ...formData, milkType: e.target.value })}
              required
            >
              <option value="">Select Type</option>
              <option value="inshushyu">Inshushyu</option>
              <option value="ikivuguto">Ikivuguto</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Amount (Liters)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Loan Request Modal Component
const LoanRequestModal = ({ onClose }: { onClose: () => void }) => {
  const [amount, setAmount] = useState('');
  const maxLoanAmount = 50000; // RF 50,000

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestedAmount = Number(amount);
    
    if (requestedAmount > maxLoanAmount) {
      toast.error(`Maximum loan amount is RF ${maxLoanAmount}`);
      return;
    }

    // Handle loan request logic here
    toast.success('Loan request submitted successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Request Loan</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Loan Amount (RF)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1000"
              max={maxLoanAmount}
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum available: RF {maxLoanAmount}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700"
            >
              Request Loan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 rounded-lg py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerDashboard; 