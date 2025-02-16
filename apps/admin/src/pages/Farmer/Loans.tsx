import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import { formatNumber } from '../../utils/formatters';

interface Loan {
  id: number;
  loanAmount: number;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  requestDate: string;
}

const Loans = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: '',
    purpose: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axiosInstance.get(`/loans/farmer/${user.id}`);
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/loans', {
        farmerId: user.id,
        loanAmount: parseFloat(formData.loanAmount),
        purpose: formData.purpose,
        status: 'Pending'
      });

      if (response.status === 201) {
        toast.success('Ubusabe bw\'inguzanyo bwoherejwe!');
        setIsModalOpen(false);
        setFormData({ loanAmount: '', purpose: '' });
        fetchLoans();
      }
    } catch (error) {
      toast.error('Habaye ikibazo. Ongera ugerageze.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Itegerejwe';
      case 'Approved':
        return 'Yemejwe';
      case 'Completed':
        return 'Yarangiye';
      case 'Rejected':
        return 'Yanzwe';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Inguzanyo</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Saba Inguzanyo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Itariki</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amafaranga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impamvu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imiterere</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(loan.requestDate).toLocaleDateString('rw-RW')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  RWF {formatNumber(loan.loanAmount)}
                </td>
                <td className="px-6 py-4">{loan.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    loan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {translateStatus(loan.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Saba Inguzanyo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amafaranga Usaba
                </label>
                <input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  placeholder="Urugero: 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impamvu
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  required
                  placeholder="Andika impamvu y'inguzanyo..."
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Reka
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Biratunganywa...' : 'Ohereza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans; 