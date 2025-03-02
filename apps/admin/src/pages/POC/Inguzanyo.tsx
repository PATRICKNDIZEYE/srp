import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { FiDollarSign, FiClock, FiAlertCircle } from 'react-icons/fi';
import { formatNumber } from '../../utils/formatters';
import axiosInstance from '../../utils/axiosInstance';

const InguzanyoPage = () => {
  const { farmerId } = useParams<{ farmerId: string }>();
  const location = useLocation();
  const [farmer, setFarmer] = useState(location.state?.farmer || null);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    if (farmerId && !farmer) {
      fetchFarmerData(farmerId);
    }
    if (farmerId) {
      fetchLoans(farmerId);
    }
  }, [farmerId, farmer]);

  const fetchFarmerData = async (farmerId: string) => {
    try {
      const response = await axiosInstance.get(`/farmer/${farmerId}`);
      console.log('Fetched farmer data:', response.data);
      setFarmer(response.data);
    } catch (error) {
      console.error('Error fetching farmer data:', error);
    }
  };

  const fetchLoans = async (farmerId: string) => {
    try {
      const response = await axiosInstance.get(`/loans/farmer/${farmerId}`);
      console.log('Fetched loans:', response.data);
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const [showLoanForm, setShowLoanForm] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: '',
    purpose: '',
    farmerName: farmer ? `${farmer.firstName} ${farmer.lastName}` : 'Unknown Farmer'
  });

  useEffect(() => {
    if (farmer) {
      setFormData((prevData) => ({
        ...prevData,
        farmerName: `${farmer.firstName} ${farmer.lastName}`
      }));
    }
  }, [farmer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { loanAmount, purpose } = formData;
    
    if (farmerId && loanAmount && purpose) {
      createLoan(Number(loanAmount), purpose, farmerId);
    }

    setShowLoanForm(false);
    setFormData({ loanAmount: '', purpose: '', farmerName: '' });
  };

  // Example function to create a loan
  async function createLoan(loanAmount: number, purpose: string, farmerId: string) {
    if (typeof purpose !== 'string' || !purpose.trim()) {
      console.error("Purpose is required and must be a non-empty string.");
      return;
    }

    try {
      const response = await axiosInstance.post('/loans', {
        loanAmount,
        purpose: purpose.trim(),
        farmerId,
      });

      console.log('Loan created successfully:', response.data);
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  }

  const handleApprove = async (loanId: number) => {
    try {
      const response = await axiosInstance.patch(`/loans/${loanId}/status`, { status: 'APPROVED' });
      console.log('Loan approved:', response.data);
      fetchLoans(farmerId); // Refresh the loan list
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const handleReject = async (loanId: number) => {
    try {
      const response = await axiosInstance.patch(`/loans/${loanId}/status`, { status: 'REJECTED' });
      console.log('Loan rejected:', response.data);
      fetchLoans(farmerId); // Refresh the loan list
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Inguzanyo" />

      {/* Display Farmer Information */}
      {farmer && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Farmer Information</h2>
          <p>Name: {farmer.firstName} {farmer.lastName}</p>
          <p>Phone: {farmer.phoneNumber}</p>
          <p>Location: {farmer.latitude}, {farmer.longitude}</p>
        </div>
      )}

      {/* Loan Status Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Amafaranga Ashoboka</h3>
            <FiDollarSign className="text-blue-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(0)} Rwf
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
              {formatNumber(0)} Rwf
            </div>
            <div className="text-sm text-gray-500">Asigaye kwishyurwa</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Amafaranga y'Ukwezi</h3>
            <FiAlertCircle className="text-green-600" size={24} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(0)} Rwf
            </div>
            <div className="text-sm text-gray-500">Kuva ku mata watanze</div>
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
                    Umuhinzi
                  </label>
                  <input
                    type="text"
                    name="farmerName"
                    value={formData.farmerName}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
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
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Ntarengwa: {formatNumber(0)} Rwf
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(loan.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{formatNumber(loan.loanAmount)} Rwf</td>
                  <td className="px-6 py-4">{loan.purpose}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {loan.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(loan.id)}
                          className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(loan.id)}
                          className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
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

export default InguzanyoPage; 