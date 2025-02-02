import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import CardDataStats from '../../components/CardDataStats';
import { FiDroplet, FiDollarSign, FiClock, FiCreditCard } from 'react-icons/fi';
import ChartOne from '../../components/Charts/ChartOne';
import { toast } from 'react-toastify';

const FarmerDashboard = () => {
  const [showMilkSubmissionModal, setShowMilkSubmissionModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Farmer Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Milk Submitted"
          total="2,345 L"
          rate="15% increase"
          levelUp={true}
        >
          <FiDroplet />
        </CardDataStats>

        <CardDataStats
          title="Pending Payment"
          total="RF 245,000"
          rate="Due in 8 days"
          levelUp={true}
        >
          <FiDollarSign />
        </CardDataStats>

        <CardDataStats
          title="Next Payment"
          total="15 Days"
          rate="On Schedule"
          levelUp={true}
        >
          <FiClock />
        </CardDataStats>

        <CardDataStats
          title="Loan Status"
          total="RF 50,000"
          rate="Available"
          levelUp={true}
        >
          <FiCreditCard />
        </CardDataStats>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
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
      </div>

      {/* Recent Submissions & Payments */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Recent Milk Submissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">2024-02-20</td>
                  <td>Inshushyu</td>
                  <td>85 L</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Pending POC
                    </span>
                  </td>
                </tr>
                {/* Add more rows */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Payment Schedule</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Next Payment</span>
                <span className="text-green-600">RF 245,000</span>
              </div>
              <div className="text-sm text-gray-600">Due in 8 days</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Loan Status</span>
                <span className="text-blue-600">RF 50,000 Available</span>
              </div>
              <div className="text-sm text-gray-600">Eligible for loan</div>
            </div>
          </div>
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