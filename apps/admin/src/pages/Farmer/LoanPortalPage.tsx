import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { FiDollarSign, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

// Define a type for the loan objects
type Loan = {
  id: number;
  loanAmount: number;
  purpose: string;
  status: string;
  requestDate: string;
  farmerId: number;
  farmer: {
    id: number;
    firstName: string;
    lastName: string;
    birthday: string;
    nationalId: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
    username: string;
    password: string;
    farmDetails: {
      size: string;
      type: string;
    };
    status: string;
    pocId: number | null;
  };
};

const LoanPortalPage = () => {
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loans, setLoans] = useState<Loan[]>([]);

  const maxLoanAmount = 50000; // RF 50,000
  const currentDebt = 0; // This would come from the backend
  const monthlyIncome = 245000; // This would be calculated from milk submissions

  const userId = 1; // Replace with actual logged-in user ID

  const fetchLoans = async () => {
    try {
      const response = await axiosInstance.get(`/loans/farmer/${userId}`);
      setLoans(response.data);
    } catch (error) {
      toast.error('Failed to fetch loans');
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(loanAmount);
    
    if (amount > maxLoanAmount) {
      toast.error(`Maximum loan amount is RF ${maxLoanAmount}`);
      return;
    }

    if (amount > monthlyIncome * 0.5) {
      toast.error('Loan amount cannot exceed 50% of your monthly income');
      return;
    }

    try {
      const loanData = {
        loanAmount: amount,
        purpose,
        status: 'Pending',
        farmerId: userId,
      };

      // Log the data being sent
      console.log('Sending loan request:', loanData);

      // Send loan request to the backend
      const response = await axiosInstance.post('/loans', loanData);

      // Log the response for debugging
      console.log('Response:', response);

      // Check if the response status indicates success
      if (response.status >= 200 && response.status < 300) {
        toast.success('Loan request submitted successfully!');
        setShowLoanForm(false);
        setLoanAmount('');
        setPurpose('');
        fetchLoans(); // Refresh loan list
      } else {
        toast.error('Failed to submit loan request');
      }
    } catch (error) {
      console.error('Error submitting loan request:', error);
      toast.error('An error occurred while submitting the loan request');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Loan Portal" />

      {/* Loan Status Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Available Credit</h3>
            <FiDollarSign className="text-blue-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-blue-600">RF {maxLoanAmount}</div>
            <div className="text-sm text-gray-500">Maximum amount</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Current Debt</h3>
            <FiClock className="text-gray-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-gray-800">RF {currentDebt}</div>
            <div className="text-sm text-gray-500">Outstanding balance</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Monthly Income</h3>
            <FiAlertCircle className="text-green-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">RF {monthlyIncome}</div>
            <div className="text-sm text-gray-500">Based on milk submissions</div>
          </div>
        </div>
      </div>

      {/* Loan Request Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Loan Request</h2>
          <button
            onClick={() => setShowLoanForm(!showLoanForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showLoanForm ? 'Cancel Request' : 'Request Loan'}
          </button>
        </div>

        {showLoanForm && (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Loan Amount (RF)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
                min="1000"
                max={maxLoanAmount}
                placeholder="Enter amount in RF"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum available: RF {maxLoanAmount}
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Purpose of Loan
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                required
                placeholder="Briefly describe why you need this loan"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Loan History */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Loan History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(loan.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    RF {loan.loanAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loan.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {loan.status}
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