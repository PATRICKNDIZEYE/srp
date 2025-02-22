import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTruck, FiAlertTriangle } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import DeliveryConfirmationModal from '../../components/Diary/DeliveryConfirmationModal';
import axiosInstance from '../../utils/axiosInstance';

interface TransportationData {
  id: string;
  diaryId: number;
  transportId: number;
  amount: number;
  status: string;
  date: string;
  diary: {
    id: number;
    status: string;
    approveStatus: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
  };
  transport: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: string;
  };
}

const MilkReceiving = () => {
  // Parse userData from localStorage and extract the id from the first object
  const userData = localStorage.getItem('userData');
  const userId = userData ? JSON.parse(userData)[0]?.id : null;
  const [selectedTransportation, setSelectedTransportation] = useState<TransportationData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [transportations, setTransportations] = useState<TransportationData[]>([]);

  useEffect(() => {
    // Fetch transportations from the API
    const fetchTransportations = async () => {
      if (!userId) {
        console.error('No userId found');
        return;
      }
      try {
        const response = await axiosInstance.get(`transp-derived/production/${userId}`);
        console.log('Fetched transportations:', response.data);
        setTransportations(response.data);
      } catch (error) {
        console.error('Error fetching transportations:', error);
        toast.error('Failed to fetch transportations');
      }
    };

    fetchTransportations();
  }, [userId]);

  const handleVerifyTransportation = (
    transportationId: string,
    actualQuantity: string,
    quality: string,
    notes: string
  ) => {
    setTransportations(prevTransportations =>
      prevTransportations.map(transportation =>
        transportation.id === transportationId
          ? { ...transportation, status: 'verified' as const }
          : transportation
      )
    );

    toast.success('Transportation verified successfully');
    setShowVerificationModal(false);
    setSelectedTransportation(null);
  };

  const handleRejectTransportation = (transportationId: string, reason: string) => {
    setTransportations(prevTransportations =>
      prevTransportations.map(transportation =>
        transportation.id === transportationId
          ? { ...transportation, status: 'rejected' as const }
          : transportation
      )
    );

    toast.error('Transportation rejected');
    setShowVerificationModal(false);
    setSelectedTransportation(null);
  };

  const handleVerifyClick = (transportation: TransportationData) => {
    setSelectedTransportation(transportation);
    setShowVerificationModal(true);
  };

  const handleApproveTransportation = async (transportationId: string) => {
    try {
      // Assuming the backend expects a payload with a 'status' field
      const payload = { status: 'Completed' };
      console.log('Sending payload:', payload);
      console.log('Approving transportation ID:', transportationId);

      // Send a PATCH request to update the status
      await axiosInstance.patch(`transp-derived/${transportationId}/status`, payload);
      setTransportations(prevTransportations =>
        prevTransportations.map(transportation =>
          transportation.id === transportationId
            ? { ...transportation, status: 'Completed' }
            : transportation
        )
      );
      console.log('Approved transportation ID:', transportationId);
      toast.success('Transportation approved successfully');
    } catch (error) {
      console.error('Error approving transportation:', error);
      toast.error('Failed to approve transportation');
    }
  };

  // Helper function to check if a date is today
  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Incoming Transportations" />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Transportations</p>
              <h3 className="text-2xl font-semibold">
                {transportations.filter(t => t.status === 'pending').length}
              </h3>
            </div>
            <FiTruck className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Received</p>
              <h3 className="text-2xl font-semibold">
                {transportations
                  .filter(t => isToday(new Date(t.date)))
                  .reduce((total, t) => total + t.amount, 0)}L
              </h3>
            </div>
            <FiCheck className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Amount Received</p>
              <h3 className="text-2xl font-semibold">
                {transportations.reduce((total, t) => total + t.amount, 0)}L
              </h3>
            </div>
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Transportations Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Transportations</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transportations.map((transportation) => (
                <tr key={transportation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(transportation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {transportation.transport.firstName} {transportation.transport.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {transportation.amount}L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transportation.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                        : transportation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transportation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {transportation.status.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => handleApproveTransportation(transportation.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedTransportation && (
        <DeliveryConfirmationModal
          delivery={{
            ...selectedTransportation,
            transporterId: selectedTransportation.transport.id.toString(),
            transporterName: `${selectedTransportation.transport.firstName} ${selectedTransportation.transport.lastName}`,
            milkType: 'default', // Replace with actual value if available
            declaredQuantity: selectedTransportation.amount.toString(),
            timestamp: new Date(selectedTransportation.date).toISOString(),
          }}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedTransportation(null);
          }}
          onConfirm={handleVerifyTransportation}
          onReject={handleRejectTransportation}
        />
      )}
    </div>
  );
};

export default MilkReceiving; 