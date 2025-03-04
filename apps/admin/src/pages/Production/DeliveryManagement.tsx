import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import AddDeliveryModal from './AddDeliveryModal';
import AddDailyModal from './AddDailyModal';
import DailyManagement from './DailyManagement';

interface Transporter {
  id: string;
  name: string;
  vehicle: string;
}

interface Milk {
  id: string;
  date: string;
  amount: string;
  transportStatus: string;
  transport?: {
    firstName: string;
    lastName: string;
  };
}

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
  const [availableTransporters, setAvailableTransporters] = useState<Transporter[]>([]);

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const response = await axiosInstance.get<Transporter[]>('/transports');
        setAvailableTransporters(response.data);
      } catch (error) {
        toast.error('Failed to load transporters');
      }
    };
 
    fetchTransporters();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransporter) {
      toast.error('Please select a transporter');
      return;
    }

    const quantity = Number(assignQuantity);
    const availableQty = milk?.availableQuantity ? Number(milk.availableQuantity.replace('L', '')) : 0;

    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (quantity > availableQty) {
      toast.error(`Cannot assign more than available quantity (${milk?.availableQuantity || '0L'})`);
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
                max={milk?.availableQuantity ? Number(milk.availableQuantity.replace('L', '')) : 0}
                min="1"
                required
                placeholder={`Max ${milk?.availableQuantity || '0L'}`}
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
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMilk, setSelectedMilk] = useState<any>(null);
  const [confirmedMilk, setConfirmedMilk] = useState<Milk[]>([]);
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  const [showAddDailyModal, setShowAddDailyModal] = useState(false);
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null);
  const [showDailyManagement, setShowDailyManagement] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [availableTransporters, setAvailableTransporters] = useState<Transporter[]>([]);

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const response = await axiosInstance.get<Transporter[]>('/transports');
        setAvailableTransporters(response.data);
      } catch (error) {
        toast.error('Failed to load transporters');
      }
    };

    fetchTransporters();
  }, []);

  useEffect(() => {
    const fetchConfirmedMilk = async () => {
      try {
        const response = await axiosInstance.get<Milk[]>('/delivery');
        setConfirmedMilk(response.data);
      } catch (error) {
        toast.error('Failed to load confirmed milk data');
      }
    };

    fetchConfirmedMilk();
  }, []);

  const handleAssignTransport = (milkId: string) => {
    setSelectedMilk(confirmedMilk.find(m => m.id === milkId));
    setShowAssignModal(true);
  };

  const handleApprove = async (milkId: string) => {
    try {
      const response = await axiosInstance.patch(`/delivery/${milkId}/status`, { newStatus: 'Completed' });
      toast.success('Transport approved successfully');
      setConfirmedMilk((prev) =>
        prev.map((milk) =>
          milk.id === milkId ? { ...milk, transportStatus: 'Completed' } : milk
        )
      );
    } catch (error) {
      toast.error('Failed to approve transport');
    }
  };

  const handleReject = async (milkId: string) => {
    try {
      const response = await axiosInstance.patch(`/${milkId}/status`, { status: 'Rejected' });
      toast.success('Transport rejected successfully');
      setConfirmedMilk((prev) =>
        prev.map((milk) =>
          milk.id === milkId ? { ...milk, transportStatus: 'Rejected' } : milk
        )
      );
    } catch (error) {
      toast.error('Failed to reject transport');
    }
  };

  const handleAddDelivery = () => {
    setShowAddDeliveryModal(true);
  };

  const handleAddDaily = (deliveryId: string) => {
    navigate(`/production/daily-management/${deliveryId}`);
  };

  const refreshDeliveries = async () => {
    try {
      const response = await axiosInstance.get('/delivery');
      setConfirmedMilk(response.data);
    } catch (error) {
      toast.error('Failed to load confirmed milk data');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Incoming Deliveries Management" />

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
                  Total Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transporter
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
                    {milk.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {milk.transportStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {milk.transport ? `${milk.transport.firstName} ${milk.transport.lastName}` : 'N/A'}
                  </td>
                
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {milk.transportStatus === 'Pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(milk.id)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(milk.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Reject
                        </button>
                        {/* <button
                          onClick={() => handleAddDaily(milk.id)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          Add Daily
                        </button> */}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Delivery Modal */}
      {showAddDeliveryModal && (
        <AddDeliveryModal
          onClose={() => setShowAddDeliveryModal(false)}
          onAdd={refreshDeliveries}
        />
      )}

      {/* Transport Assignment Modal */}
      {showAssignModal && (
        <TransportAssignmentModal
          milk={selectedMilk}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedMilk(null);
          }}
          onAssign={async (milkId, quantity, transporterId) => {
            try {
              const response = await axiosInstance.post('/assign-transport', {
                milkId,
                quantity,
                transporterId,
              });
              toast.success(`Transport assigned successfully: ${response.data.message}`);
            } catch (error: any) {
              toast.error(`Failed to assign transport: ${error.response?.data?.message || error.message}`);
            }
          }}
        />
      )}

      {/* Add Daily Modal */}
      {showAddDailyModal && (
        <AddDailyModal
          onClose={() => setShowAddDailyModal(false)}
          onAdd={refreshDeliveries}
          initialTransportId={selectedTransportId}
        />
      )}

      {/* Daily Management Modal */}
      {showDailyManagement && selectedDeliveryId && (
        <DailyManagement
          deliveryId={selectedDeliveryId}
          onClose={() => setShowDailyManagement(false)}
        />
      )}
    </div>
  );
};

export default DeliveryManagement; 