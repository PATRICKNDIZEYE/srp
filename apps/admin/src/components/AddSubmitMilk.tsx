import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Update the path to your axiosInstance

// Define the Farmer type if not already defined
interface Farmer {
  id: number;
  firstName: string;
  lastName: string;
  // Add other farmer properties if needed
}

interface AddSubmitMilkProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    milkType: string;
    amount: string;
    notes: string;
    farmerId: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    milkType: string;
    amount: string;
    notes: string;
    farmerId: string;
  }>>;
  isSubmitting: boolean;
  farmers: Farmer[]; // Add farmers to the props
  updatedAt?: string; // Add updatedAt to the props if needed
}

const AddSubmitMilk: React.FC<AddSubmitMilkProps> = ({
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  farmers,
  updatedAt
}) => {
  const [farmerData, setFarmerData] = useState<Farmer[]>([]);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '[]');
        const pocId = userData[0]?.id; // Assuming the first item has the ID you need
        const response = await axiosInstance.get(`/farmer/poc/${pocId}`);
        setFarmerData(response.data);
      } catch (error) {
        console.error('Error fetching farmer data:', error);
      }
    };

    fetchFarmerData();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    const submissionData = {
      ...formData,
      // Only include updatedAt if it's explicitly set
      ...(updatedAt ? { updatedAt } : {}),
    };

    onSubmit(submissionData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Milk Submission</h2>

      {/* Display updatedAt if needed */}
      {updatedAt && (
        <div className="text-sm text-gray-500 mb-4">
          Last updated at: {new Date(updatedAt).toLocaleString()}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Farmer
          </label>
          <select
            value={formData.farmerId}
            onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a farmer</option>
            {farmerData.map((farmer) => (
              <option key={farmer.id} value={farmer.id}>
                {farmer.firstName} {farmer.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Milk Type
          </label>
          <select
            value={formData.milkType}
            onChange={(e) => setFormData({ ...formData, milkType: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="inshushyu">Inshushyu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity (Liters)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="e.g., 5.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter any notes here..."
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
            {isSubmitting ? 'Submitting...' : 'Submit Milk'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubmitMilk; 