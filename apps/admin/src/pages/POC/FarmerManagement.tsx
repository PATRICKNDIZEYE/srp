import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance'; // Ensure this path is correct
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';

const FarmerManagement = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [pendingFarmers, setPendingFarmers] = useState([]); // Updated to use state

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axiosInstance.get('/farmer'); // Use the correct endpoint
        setPendingFarmers(response.data);
      } catch (error) {
        console.error('Error fetching farmers:', error);
        toast.error('Failed to fetch farmers');
      }
    };

    fetchFarmers();
  }, []); // Fetch data on component mount

  const handleConfirmRegistration = (farmerId: string) => {
    toast.success('Farmer registration confirmed');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Farmer Management" />

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pending Registrations</h2>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingFarmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {farmer.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleConfirmRegistration(farmer.id)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      Confirm Registration
                    </button>
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

export default FarmerManagement; 