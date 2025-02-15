import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { useUserContext } from '../../context/UserContext';

// Define the type for a submission
interface Submission {
  id: string;
  createdAt: string;
  milkType: string;
  amount: number;
  status: string;
}

const MilkSubmissionPage = () => {
  const { userId } = useUserContext(); // Use userId from UserContext

  const [formData, setFormData] = useState({
    milkType: '',
    amount: '',
    notes: '',
  });

  const [submissions, setSubmissions] = useState<Submission[]>([]); // Define the type for submissions

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get('/milk-submissions');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to load recent submissions.');
      }
    };

    fetchSubmissions();
  }, []); // Fetch submissions on component mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submissionData = {
        milkType: formData.milkType,
        amount: Number(formData.amount),
        notes: formData.notes,
        status: 'Pending',
        farmerId: Number(userId), // Ensure farmerId is a number
      };

      console.log('Submitting data:', submissionData); // Log the data being sent

      await axiosInstance.post('/milk-submissions', submissionData);
      toast.success('Milk submission recorded! Waiting for POC confirmation.');
      setFormData({ milkType: '', amount: '', notes: '' });
    } catch (error) {
      console.error('Error submitting milk data:', error);
      toast.error('Failed to submit milk data. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Submit Milk" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submit New Milk Collection</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Milk Type
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-gray-700 font-medium mb-2">
                Amount (Liters)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="1"
                placeholder="Enter amount in liters"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Any additional information..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setFormData({ milkType: '', amount: '', notes: '' })}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Recent Submissions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Submissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.milkType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.amount}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          submission.status === 'Accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkSubmissionPage; 