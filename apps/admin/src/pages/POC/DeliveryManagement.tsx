import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';

interface TransportAssignmentModalProps {
  milk: {
    id: string;
    type: string;
    totalQuantity: string;
    availableQuantity: string;
  } | null;
  onClose: () => void;
  onAssign: (milkId: string, quantity: number, transporterId: string) => void;
}

const TransportAssignmentModal: React.FC<TransportAssignmentModalProps> = ({ milk, onClose, onAssign }) => {
  const [selectedTransporter, setSelectedTransporter] = useState('');
  const [assignQuantity, setAssignQuantity] = useState('');
  const [notes, setNotes] = useState('');

  // Dummy transporters data
  const availableTransporters = [
    { id: '1', name: 'John Driver', vehicle: 'Truck A - RAA 123A', capacity: '200L' },
    { id: '2', name: 'Alice Trucker', vehicle: 'Truck B - RAB 456B', capacity: '300L' },
    // Add more transporters...
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransporter) {
      toast.error('Please select a transporter');
      return;
    }

    const quantity = Number(assignQuantity);
    const availableQty = Number(milk?.availableQuantity.replace('L', ''));

    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (quantity > availableQty) {
      toast.error(`Cannot assign more than available quantity (${milk?.availableQuantity})`);
      return;
    }

    onAssign(milk?.id || '', quantity, selectedTransporter);
    toast.success(`${quantity}L assigned for transport`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Assign Transport</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {milk && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Milk Details
              </label>
              <div className="text-sm text-gray-600">
                <div>Type: {milk.type}</div>
                <div>Available Quantity: {milk.availableQuantity}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to Assign (L)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={assignQuantity}
                onChange={(e) => setAssignQuantity(e.target.value)}
                max={Number(milk.availableQuantity.replace('L', ''))}
                min="1"
                required
                placeholder={`Max ${milk.availableQuantity}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Transporter
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selectedTransporter}
                onChange={(e) => setSelectedTransporter(e.target.value)}
                required
              >
                <option value="">Choose a transporter</option>
                {availableTransporters.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} - {t.vehicle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Transport
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const DeliveryManagement = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMilk, setSelectedMilk] = useState<any>(null);

  // Dummy data
  const confirmedMilk = [
    {
      id: '1',
      date: '2024-02-20',
      totalQuantity: '250L',
      type: 'Inshushyu',
      status: 'Ready for Transport',
    },
    // Add more entries...
  ];

  const handleAssignTransport = (milkId: string) => {
    setSelectedMilk(confirmedMilk.find(m => m.id === milkId));
    setShowAssignModal(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Delivery Management" />

      {/* Filters & Table */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ready for Transport</h2>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Quantity
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
              {confirmedMilk.map((milk) => (
                <tr key={milk.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {milk.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {milk.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {milk.totalQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {milk.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleAssignTransport(milk.id)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      Assign Transport
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transport Assignment Modal */}
      {showAssignModal && (
        <TransportAssignmentModal
          milk={selectedMilk}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedMilk(null);
          }}
          onAssign={(milkId, quantity, transporterId) => {
            // Implementation of onAssign function
          }}
        />
      )}
    </div>
  );
};

export default DeliveryManagement; 