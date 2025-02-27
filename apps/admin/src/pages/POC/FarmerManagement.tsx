import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import AddFarmerModal from '../../components/Management/AddFarmerModal';

// Define a type for the farmer objects
interface Farmer {
  id: string;
  birthday: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive'; // Ensure status is consistent
}

const FarmerManagement = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [pendingFarmers, setPendingFarmers] = useState<Farmer[]>([]);
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);

  const fetchFarmers = async () => {
    try {
      const response = await axiosInstance.get('/farmer');
      setPendingFarmers(response.data);
    } catch (error) {
      console.error('Error fetching farmers:', error);
      toast.error('Failed to fetch farmers');
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleConfirmRegistration = (farmerId: string) => {
    toast.success('Farmer registration confirmed');
  };

  const handleChangeStatus = async (farmerId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axiosInstance.patch(`/farmer/${farmerId}/status`, { status: newStatus });
      toast.success(`Status changed to ${newStatus}`);
      // Refresh data after status change
      fetchFarmers();
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Farmer Management" />

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Farmers</h2>
          <button 
            onClick={() => setShowAddFarmerModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            Add Farmer
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              {/* <h2 className="text-xl font-semibold">Pending Registrations</h2> */}
              <DateRangeFilter
                dateRange={dateRange}
                selectedPeriod={selectedPeriod}
                onDateRangeChange={setDateRange}
                onPeriodChange={setSelectedPeriod}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
              />
            </div>
          </div>
        </div>

        {/* Farmers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingFarmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.birthday}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.firstName} {farmer.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.latitude}, {farmer.longitude}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      farmer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {farmer.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleConfirmRegistration(farmer.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleChangeStatus(farmer.id, farmer.status)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <FiRefreshCw />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddFarmerModal && (
        <AddFarmerModal
          isOpen={showAddFarmerModal}
          onClose={() => setShowAddFarmerModal(false)}
          onSubmit={(newFarmer) => {
            // Logic to add the new farmer
            setPendingFarmers([...pendingFarmers, newFarmer]);
            setShowAddFarmerModal(false);
            fetchFarmers(); // Fetch the updated list of farmers
          }}
        />
      )}
    </div>
  );
};

export default FarmerManagement; 