import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import { formatNumber } from '../../utils/formatters';
import { useUser } from '../../context/UserContext';

// Define the type for a submission
interface Submission {
  id: string;
  createdAt: string;
  milkType: string;
  amount: number;
  status: string;
}

const MilkSubmissionPage = () => {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [formData, setFormData] = useState({
    milkType: 'inshushyu',
    amount: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id || !user?.token) return;

    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get(`/milk-submissions/farmer/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setSubmissions(response.data.submissions || []);
      } catch (error) {
        const err = error as any;
        console.error('Fetch submissions error:', err.response ? err.response.data : err.message);
        toast.error('Hari ikibazo. Ongera ugerageze.');
      }
    };

    fetchSubmissions();
  }, [user?.id, user?.token]); // Depend on `user.id` and `user.token` to prevent unnecessary calls

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.token) return;

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/milk-submissions', {
        milkType: formData.milkType,
        amount: parseFloat(formData.amount),
        notes: formData.notes,
        farmerId: user.id
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.status === 201) {
        toast.success('Amata yoherejwe neza!');
        setFormData({
          milkType: 'inshushyu', // Ensure it resets to a valid default value
          amount: '',
          notes: ''
        });

        // Refetch submissions after a successful submission
        const newResponse = await axiosInstance.get(`/milk-submissions/farmer/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setSubmissions(newResponse.data.submissions || []);
      }
    } catch (error) {
      const err = error as any;
      console.error('Submission error:', err.response ? err.response.data : err.message);
      toast.error('Hari ikibazo. Ongera ugerageze.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Gutanga Amata" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gutanga Amata Mashya</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubwoko bw'Amata
              </label>
              <select
                value={formData.milkType}
                onChange={(e) => setFormData({ ...formData, milkType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="inshushyu">Inshushyu</option>
                <option value="umuhondo">Umuhondo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingano (Litiro)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Urugero: 5.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icyitonderwa
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Andika hano icyo ushaka kumenyekanisha..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Biratunganywa...' : 'Ohereza Amata'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Submissions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Amata Watanze Vuba</h3>
          </div>
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
                    Imiterere
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(submission.createdAt).toLocaleDateString('rw-RW')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.milkType === 'inshushyu' ? 'Inshushyu' : 'Umuhondo'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(submission.amount)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
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
