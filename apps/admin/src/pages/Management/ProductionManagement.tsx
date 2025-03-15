import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumb from '../../components/Breadcrumb';
import { useLocation } from 'react-router-dom';
import AddProductionModal from '../Production/AddProductionModal';
import CardDataStats from '../../components/CardDataStats';
import { FiCheckCircle, FiAlertCircle, FiDroplet, FiTruck } from 'react-icons/fi';

// Define the type for the daily data
interface DailyData {
  id: number;
  date: string;
  status: string;
  amount: number;
  transportName: string;
  diaryPhoneNumber: string;
  transportId: string;
}

const ProductionManagement: React.FC = () => {
  const location = useLocation();
  const deliveryId = location.pathname.split('/').pop(); // Extract the last segment of the URL as the deliveryId
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null);

  // New state variables for counts and amounts
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

  // Move fetchDailyData outside of useEffect
  const fetchDailyData = async () => {
    if (!deliveryId) return; // Ensure deliveryId is defined before making the request

    try {
      const response = await axiosInstance.get(`/delivery/transport/${deliveryId}`);

      // Ensure response.data is an array before using map
      const data = Array.isArray(response.data)
        ? response.data.map((item: any) => ({
            id: item.id,
            date: item.date,
            status: item.transportStatus?.toLowerCase() || 'unknown', // Use transportStatus instead of status
            amount: item.amount || 0, // Ensure amount is valid
            transportName: `${item.transport?.firstName || ''} ${item.transport?.lastName || ''}`.trim(),
            diaryPhoneNumber: item.transport?.phoneNumber || 'N/A',
            transportId: item.transport?.id || null,
            transportationId: item.transportations?.id || null, // Correctly extract transportationId
          }))
        : [];

      setDailyData(data);

      // Set the transport ID from the first item (assuming all items have the same transport ID)
      if (data.length > 0 && data[0].transportId) {
        setSelectedTransportId(data[0].transportId);
      }

      // Calculate counts and amounts
      const completedData = data.filter((item: DailyData) => item.status === 'completed');
      const pendingData = data.filter((item: DailyData) => item.status === 'pending');

      setCompletedCount(completedData.length);
      setPendingCount(pendingData.length);
      setCompletedAmount(completedData.reduce((sum: number, item: DailyData) => sum + item.amount, 0));
      setPendingAmount(pendingData.reduce((sum: number, item: DailyData) => sum + item.amount, 0));
    } catch (error) {
      console.error('Error fetching daily data:', error);
      toast.error('Failed to load daily data');
    }
  };

  useEffect(() => {
    fetchDailyData();
  }, [deliveryId]);

  const handleApprove = async (id: number) => {
    try {
      // Update the status using the new endpoint
      await axiosInstance.patch(`/transp-derived/${id}/status`, { status: 'Completed' });
      setDailyData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: 'Completed' } : item
        )
      );
      toast.success('Status updated to Completed');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName={`Production Management for Delivery ${deliveryId}`} />

      {/* New Cards for Completed and Pending Data */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <CardDataStats
          title="Completed Count"
          total={completedCount.toString()}
          rate="Total completed"
          levelUp={true} 
        >
          <FiCheckCircle className="text-green-500" />
        </CardDataStats>

        <CardDataStats
          title="Pending Count"
          total={pendingCount.toString()}
          rate="Total pending"
          levelUp={false}
        >
          <FiAlertCircle className="text-yellow-500" />
        </CardDataStats>

        <CardDataStats
          title="Completed Amount"
          total={completedAmount.toString()}
          rate="Amount completed"
          levelUp={true}
        >
          <FiDroplet className="text-blue-500" />
        </CardDataStats>

        <CardDataStats
          title="Pending Amount"
          total={pendingAmount.toString()}
          rate="Amount pending"
          levelUp={false}
        >
          <FiTruck className="text-red-500" />
        </CardDataStats>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Production Management for Delivery {deliveryId}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Transportation
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transport Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Diary Phone Number
                </th>
              
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dailyData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(data.date).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusClass(data.status)}`}>
                    {data.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.amount}L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.transportName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.diaryPhoneNumber}
                  </td>
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Close
        </button>
      </div>
      {isModalOpen && (
        <AddProductionModal
          onClose={() => setIsModalOpen(false)}
          onAdd={() => {
            setIsModalOpen(false);
            fetchDailyData();
          }}
          initialTransportId={selectedTransportId}
          deliveryId={deliveryId || ''}
        />
      )}
    </div>
  );
};

export default ProductionManagement;