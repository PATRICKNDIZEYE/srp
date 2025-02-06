import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import DeleteUserModal from '../../components/Management/DeleteUserModal';
import EditUserModal from '../../components/Management/EditUserModal';
import axiosInstance from '../../utils/axiosInstance';
import AddPocForm from '../../components/Management/AddPocForm';
import AddFarmerModal from '../../components/Management/AddFarmerModal';
import AddTransportModal from '../../components/Management/AddTransportModal';

interface User {
  id: number;
  name: string;
  role: string;
  site: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive';
  lastActive: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
}

const UserManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [pocs, setPocs] = useState<User[]>([]);
  const [transports, setTransports] = useState<User[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      if (activeTab === 'users') {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } else if (activeTab === 'farmers') {
        const response = await axiosInstance.get('/farmers');
        setFarmers(response.data);
      } else if (activeTab === 'pocs') {
        const response = await axiosInstance.get('/pocs');
        setPocs(response.data);
      } else if (activeTab === 'transports') {
        const response = await axiosInstance.get('/transports');
        setTransports(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAddUser = async (userData: Omit<User, 'id' | 'lastActive'>) => {
    try {
      let endpoint = '';
      if (activeTab === 'users') {
        endpoint = '/users';
      } else if (activeTab === 'farmers') {
        endpoint = '/farmers';
      } else if (activeTab === 'transports') {
        endpoint = '/transports';
      }

      if (endpoint) {
        await axiosInstance.post(endpoint, userData);
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} added successfully`);
      }
      setShowAddModal(false);
      fetchData(); // Refresh data after adding
    } catch (error) {
      toast.error(`Failed to add ${activeTab}`);
    }
  };

  const handleEditUser = (userId: number, userData: Omit<User, 'id' | 'lastActive'>) => {
    // Edit user logic here
    toast.success('User updated successfully');
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    // Delete user logic here
    toast.success('User deleted successfully');
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleAddPoc = async (pocData: {
    firstName: string;
    lastName: string;
    birthday: string;
    nationalId: string;
    phoneNumber: string;
    longitude: number | string;
    latitude: number | string;
    username: string;
    password: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
    };
    status: string;
  }) => {
    try {
      const formattedBirthday = new Date(pocData.birthday).toISOString().split('T')[0] + 'T00:00:00Z';
      const formattedPocData = {
        ...pocData,
        birthday: formattedBirthday,
        longitude: Number(pocData.longitude),
        latitude: Number(pocData.latitude),
        status: pocData.status.toLowerCase(),
      };

      await axiosInstance.post('/pocs', formattedPocData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('POC added successfully!');
      fetchData();
    } catch (error) {
      toast.error('Error adding POC');
    }
  };

  const AddUserForm = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) => (
    <div>
      {/* Form fields for adding a user */}
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSubmit({ /* user data */ })}>Submit</button>
    </div>
  );

  const AddFarmerForm = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) => (
    <div>
      {/* Form fields for adding a farmer */}
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSubmit({ /* farmer data */ })}>Submit</button>
    </div>
  );

  const AddTransportForm = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) => (
    <div>
      {/* Form fields for adding a transport */}
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSubmit({ /* transport data */ })}>Submit</button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="User Management" />
      
      <div className="tabs">
        <button onClick={() => setActiveTab('users')}>Users</button>
        <button onClick={() => setActiveTab('farmers')}>Farmers</button>
        <button onClick={() => setActiveTab('pocs')}>POCs</button>
        <button onClick={() => setActiveTab('transports')}>Transports</button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiUserPlus />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">National ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === 'users' ? users : activeTab === 'farmers' ? farmers : activeTab === 'pocs' ? pocs : transports).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.firstName ? user.firstName.charAt(0) : '?'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.firstName || 'Unknown'} {user.lastName || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.nationalId || 'No ID'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phoneNumber || 'No phone'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.address ? `${user.address.street}, ${user.address.city}, ${user.address.postalCode}` : 'No address'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && activeTab === 'users' && (
        <AddUserForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      {showAddModal && activeTab === 'farmers' && (
        <AddFarmerForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      {showAddModal && activeTab === 'pocs' && (
        <AddPocForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPoc}
        />
      )}

      {showAddModal && activeTab === 'transports' && (
        <AddTransportForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleEditUser}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement; 