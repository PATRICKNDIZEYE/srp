import React from 'react';

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
}

const AddSubmitMilk: React.FC<AddSubmitMilkProps> = ({
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  farmers
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    onSubmit(e);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Milk Submission</h2>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Farmer
          </label>
          <select
            value={formData.farmerId}
            onChange={(e) => setFormData({ ...formData, farmerId: parseInt(e.target.value, 10) })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a farmer</option>
            {farmers.map((farmer) => (
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
            <option value="umuhondo">Umuhondo</option>
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
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
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