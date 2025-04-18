import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios'; // Corrected import path
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';
import AddSubmitMilk from '../../components/AddSubmitMilk';
import { useParams } from 'react-router-dom';
import { FaEdit, FaCalendarAlt } from 'react-icons/fa'; // Import edit and calendar icons

// Define the type for a submission
interface Farmer {
  id: number;
  firstName: string;
  lastName: string;
  // Add other farmer properties if needed
}

interface Submission {
  id: number;
  milkType: string;
  amount: number;
  createdAt: string;
  farmer: Farmer;
  status: string;
  quality?: string;
  // Add other submission properties if needed
}

// Define the type for form data
interface FormData {
  milkType: string;
  amount: string;
  notes: string;
  status: string;
  farmerId: string;
}

// Simple Modal Component
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          {children}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const MilkSubmissions = () => {
  const { farmerId } = useParams<{ farmerId: string }>(); // Get farmerId from URL
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [farmers, setFarmers] = useState<Farmer[]>([]); // State to store farmers
  const [formData, setFormData] = useState<FormData>({
    milkType: '',
    amount: '0',
    notes: 'Fresh milk from morning milking',
    status: 'Pending',
    farmerId: farmerId ? farmerId : '0'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQualityModalOpen, setIsQualityModalOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [quality, setQuality] = useState<string>('');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateFormData, setDateFormData] = useState({ createdAt: '', updatedAt: '' });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get(`/milk-sub/farmer/${farmerId}`);
        console.log('API Response:', response.data);
        setSubmissions(Array.isArray(response.data.submissions) ? response.data.submissions : []);
      } catch (error) {
        // toast.error('Failed to fetch milk submissions');
      }
    };

    const fetchFarmers = async () => {
      try {
        const response = await axiosInstance.get('/farmer');
        console.log('Fetched farmers:', response.data);
        setFarmers(response.data);
      } catch (error) {
        toast.error('Failed to fetch farmers');
      }
    };

    fetchSubmissions();
    fetchFarmers(); // Fetch farmers when component mounts
  }, [farmerId]);

  const handleConfirmSubmission = async (submissionId: string) => {
    try {
      const response = await axiosInstance.put(`/milk-submissions/${submissionId}/status`, {
        status: 'accepted'
      });
      if (response.status === 200) {
        toast.success('Milk submission confirmed');
        // Optionally, refresh the submissions list
        const newResponse = await axiosInstance.get('/milk-submissions');
        setSubmissions(newResponse.data);
      }
    } catch (error) {
      toast.error('Failed to confirm milk submission');
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    try {
      const response = await axiosInstance.put(`/milk-submissions/${submissionId}/status`, {
        status: 'rejected',
        reason: 'Quality standards not met' // Example reason
      });
      if (response.status === 200) {
        toast.success('Milk submission rejected');
        // Optionally, refresh the submissions list
        const newResponse = await axiosInstance.get('/milk-submissions');
        setSubmissions(newResponse.data);
      }
    } catch (error) {
      toast.error('Failed to reject milk submission');
    }
  };

  const handleQualityChange = async () => {
    if (selectedSubmissionId !== null) {
      try {
        const response = await axiosInstance.put(`/milk-submissions/${selectedSubmissionId}/quality`, {
          quality,
        });
        if (response.status === 200) {
          toast.success('Quality updated successfully');
          setIsQualityModalOpen(false);
          // Refresh the submissions list to reflect the updated quality
          const newResponse = await axiosInstance.get('/milk-submissions');
          setSubmissions(newResponse.data);
        }
      } catch (error) {
        toast.error('Failed to update quality');
      }
    }
  };

  const handleDateUpdate = async () => {
    if (selectedSubmissionId !== null) {
      try {
        const response = await axiosInstance.put(`/milk-submissions/${selectedSubmissionId}/dates`, {
          createdAt: dateFormData.createdAt,
          updatedAt: dateFormData.updatedAt,
        });
        if (response.status === 200) {
          toast.success('Dates updated successfully');
          setIsDateModalOpen(false);
          // Refresh the submissions list to reflect the updated dates
          const newResponse = await axiosInstance.get('/milk-submissions');
          setSubmissions(newResponse.data);
        }
      } catch (error) {
        toast.error('Failed to update dates');
      }
    }
  };

  const handleSubmit = async (submissionData: { milkType: string; amount: string; notes: string; status: string; farmerId: string }) => {
    // Ensure milkType is always "inshyushyu"
    submissionData.milkType = 'inshyushyu';

    // Convert amount and farmerId to numbers
    const amount = parseFloat(submissionData.amount);
    const farmerId = parseInt(submissionData.farmerId);

    // Log the converted data
    console.log('Submitting form with data:', {
      milkType: submissionData.milkType,
      amount,
      notes: submissionData.notes,
      status: submissionData.status,
      farmerId
    });

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/milk-sub/poc', {
        milkType: submissionData.milkType,
        amount, // Use the converted number
        notes: submissionData.notes,
        status: submissionData.status,
        farmerId // Use the converted number
      });

      console.log('Response from server:', response);

      if (response.status === 201) {
        toast.success('Milk submitted successfully!');
        setFormData({
          milkType: '',
          amount: '0',
          notes: 'Fresh milk from morning milking',
          status: 'Pending',
          farmerId: farmerId ? farmerId.toString() : '0'
        });
        setIsModalOpen(false);
        const newResponse = await axiosInstance.get('/milk-submissions');
        setSubmissions(newResponse.data);
      }
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('There was an issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the sums
  const totalPending = submissions
    .filter(submission => submission.status.toLowerCase() === 'pending')
    .reduce((sum, submission) => sum + Number(submission.amount), 0);

  const totalAccepted = submissions
    .filter(submission => submission.status.toLowerCase() === 'accepted')
    .reduce((sum, submission) => sum + Number(submission.amount), 0);

  useEffect(() => {
    console.log('Fetched Submissions:', submissions);
    const pendingSubmissions = submissions.filter(submission => submission.status.toLowerCase() === 'pending');
    console.log('Pending Submissions:', pendingSubmissions);
  }, [submissions]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Milk Submissions" />

      {/* Status Summary */}
      <div className="flex justify-between mb-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Collection</h3>
          <p className="text-2xl">{totalAccepted}</p>
          <p className="text-green-500">Today's total ↑</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Pending Quantity Check</h3>
          <p className="text-2xl">{totalPending}</p>
          <p className="text-red-500">Needs verification</p>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Submissions</h2>
            <DateRangeFilter
              dateRange={dateRange}
              selectedPeriod={selectedPeriod}
              onDateRangeChange={setDateRange}
              onPeriodChange={setSelectedPeriod}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Milk Submission
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {`${submission.farmer.firstName} ${submission.farmer.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.milkType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.quality || 'Not set'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <FaEdit
                      className="cursor-pointer text-blue-500"
                      onClick={() => {
                        setSelectedSubmissionId(submission.id);
                        setIsQualityModalOpen(true);
                      }}
                    />
                    <FaCalendarAlt
                      className="cursor-pointer text-green-500 ml-2"
                      onClick={() => {
                        setSelectedSubmissionId(submission.id);
                        setIsDateModalOpen(true);
                        setDateFormData({
                          createdAt: submission.createdAt,
                          updatedAt: submission.updatedAt || new Date().toISOString(),
                        });
                      }}
                    />
                    {submission.status !== 'accepted' && submission.status !== 'rejected' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConfirmSubmission(submission.id.toString())}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleRejectSubmission(submission.id.toString())}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for changing quality */}
      {isQualityModalOpen && (
        <Modal onClose={() => setIsQualityModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-lg font-semibold">Change Quality</h2>
            <input
              type="text"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter new quality"
            />
            <button
              onClick={handleQualityChange}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Quality
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for adding milk submission */}
      {isModalOpen && (
        <AddSubmitMilk
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => handleSubmit(formData)}
          formData={formData}
          setFormData={(newData: Partial<FormData>) => setFormData({
            ...formData,
            ...newData,
            milkType: newData.milkType || formData.milkType,
            amount: newData.amount || formData.amount,
            farmerId: newData.farmerId || formData.farmerId
          })}
          isSubmitting={isSubmitting}
          farmers={farmers}
        />
      )}

      {/* Modal for updating dates */}
      {isDateModalOpen && (
        <Modal onClose={() => setIsDateModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-lg font-semibold">Update Dates</h2>
            <input
              type="datetime-local"
              value={dateFormData.createdAt}
              onChange={(e) => setDateFormData({ ...dateFormData, createdAt: e.target.value })}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter new createdAt"
            />
            <input
              type="datetime-local"
              value={dateFormData.updatedAt}
              onChange={(e) => setDateFormData({ ...dateFormData, updatedAt: e.target.value })}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter new updatedAt"
            />
            <button
              onClick={handleDateUpdate}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Dates
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MilkSubmissions; 