import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { FiDollarSign, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import { useUser } from '../../context/UserContext';
import { formatNumber } from '../../utils/formatters';
import { differenceInDays } from 'date-fns';

interface Loan {
  id: number;
  loanAmount: number;
  purpose: string;
  status: string;
  createdAt: string;
}

interface LoanSummary {
  maxLoanAmount: number;
  currentDebt: number;
  monthlyIncome: number;
  eligibleAmount: number;
}

const LoanPortalPage = () => {
  const { user } = useUser();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [summary, setSummary] = useState<LoanSummary>({
    maxLoanAmount: 0,
    currentDebt: 0,
    monthlyIncome: 0,
    eligibleAmount: 0
  });
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(true);
  const [milkSubmissionAmount, setMilkSubmissionAmount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchMilkSubmissions(user.id);
      fetchLoanData();
    }
  }, [user?.id]);

  const fetchMilkSubmissions = async (farmerId: string) => {
    try {
      const response = await axiosInstance.get(`/milk-submissions/farmer/${farmerId}`);
      console.log('Milk submissions response:', response.data);

      const submissions = Array.isArray(response.data) ? response.data : response.data.submissions || [];
      const recentSubmissions = submissions.filter((submission: any) => 
        differenceInDays(new Date(), new Date(submission.createdAt)) <= 15
      );
      const totalAmount = recentSubmissions.reduce((sum: number, submission: any) => sum + submission.amount, 0);
      setMilkSubmissionAmount(totalAmount);
    } catch (error) {
      console.error('Error fetching milk submissions:', error);
    }
  };

  const fetchLoanData = async () => {
    try {
      const [loansRes, summaryRes] = await Promise.all([
        axiosInstance.get(`/loans/farmer/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }),
        axiosInstance.get(`/loans/farmer/${user.id}/summary`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
      ]);

      console.log('Fetched loans:', loansRes.data);

      const loans = Array.isArray(loansRes.data) ? loansRes.data : loansRes.data.loans || [];
      setLoans(loans);
      setSummary(summaryRes.data);
    } catch (error) {
      toast.error('Hari ikibazo. Ongera ugerageze.');
    } finally {
      setLoading(false);
    }
  };

  const calculateLoanEligibility = () => {
    const money = milkSubmissionAmount * 400;
    if (milkSubmissionAmount > 60) {
      return money * 0.7;
    } else if (milkSubmissionAmount > 45) {
      return money * 0.5;
    }
    return 0;
  };

  const eligibleLoanAmount = calculateLoanEligibility();

  // Calculate the total amount of rejected loans
  const totalRejectedLoans = loans
    .filter((loan: any) => loan.status.toLowerCase() === 'rejected')
    .reduce((sum: number, loan: any) => sum + loan.loanAmount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.token) return;

    const amount = Number(formData.loanAmount);
    if (amount > summary.maxLoanAmount) {
      toast.error(`Ntarengwa ni ${formatNumber(summary.maxLoanAmount)} Rwf`);
      return;
    }

    try {
      await axiosInstance.post('/loans', {
        farmerId: user.id,
        loanAmount: amount,
        purpose: formData.purpose,
        status: 'pending'
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      toast.success('Inguzanyo yawe yoherejwe neza!');
      setShowLoanForm(false);
      setFormData({ loanAmount: '', purpose: '' });
      fetchLoanData(); // Refresh data
    } catch (error) {
      toast.error('Hari ikibazo. Ongera ugerageze.');
    }
  };

  const mapStatusToDisplayText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Yemejwe';
      case 'pending':
        return 'Itegerejwe';
      case 'rejected':
        return 'Yanzwe';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return <div className="p-4">Biratunganywa...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Inguzanyo" />

      {/* Loan Status Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Amafaranga Ashoboka</h3>
            <FiDollarSign className="text-blue-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(eligibleLoanAmount)} Rwf
            </div>
            <div className="text-sm text-gray-500">Ntarengwa</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Umwenda Uriho</h3>
            <FiClock className="text-gray-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-800">
              {formatNumber(summary.currentDebt)} Rwf
            </div>
            <div className="text-sm text-gray-500">Asigaye kwishyurwa</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Inguzanyo yanzwe</h3>
            <FiAlertCircle className="text-green-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalRejectedLoans)} Rwf
            </div>
            <div className="text-sm text-gray-500">Amafaranga yanzwe</div>
          </div>
        </div>
      </div>

      {/* Loan Request Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Gusaba Inguzanyo</h2>
          <button
            onClick={() => setShowLoanForm(!showLoanForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showLoanForm ? 'Reka' : 'Saba Inguzanyo'}
          </button>
        </div>

        {showLoanForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Saba Inguzanyo</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amafaranga
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Urugero: 50000"
                    required
                    min="1000"
                    max={eligibleLoanAmount}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Ntarengwa: {formatNumber(eligibleLoanAmount)} Rwf
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Impamvu
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Andika impamvu y'inguzanyo..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowLoanForm(false)}
                    className="px-4 py-2 text-gray-600"
                  >
                    Reka
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Ohereza
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Loan History */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Amateka y'Inguzanyo</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Itariki
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amafaranga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Impamvu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Imiterere
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {formatNumber(loan.loanAmount)} Rwf
                  </td>
                  <td className="px-6 py-4">
                    {loan.purpose}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      loan.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                      loan.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mapStatusToDisplayText(loan.status)}
                    </span>
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

export default LoanPortalPage; 