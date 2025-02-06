import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import AddUserModal from '../../components/Management/AddUserModal';
import { toast } from 'react-toastify';
import DeleteUserModal from '../../components/Management/DeleteUserModal';
import EditUserModal from '../../components/Management/EditUserModal';
import axiosInstance from '../../utils/axiosInstance';
import AddPocForm from '../../components/Management/AddPocForm';

interface User {
  id: number;
  name: string;
  role: string;
  site: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'Active' | 'Inactive';
  lastActive: string;
  email: string;
  phone: string;
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

  useEffect(() => {
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

    fetchData();
  }, [activeTab]);

  const handleAddUser = async (userData: Omit<User, 'id' | 'lastActive'>) => {
    try {
      if (activeTab === 'pocs') {
        await axiosInstance.post('/pocs', userData);
        toast.success('POC added successfully');
      } else {
        // Handle other tabs if needed
        toast.success('User added successfully');
      }
      setShowAddModal(false);
    } catch (error) {
      toast.error('Failed to add user');
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
    longitude: number;
    latitude: number;
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
      // Log the data being sent
      console.log('Data being sent:', pocData);

      // Correct the endpoint URL
      const response = await axiosInstance.post('/pocs', pocData);

      // Handle success
      console.log('POC added successfully:', response.data);
      toast.success('POC added successfully!');
    } catch (error) {
      console.error('Error adding POC:', error);
      toast.error('Error adding POC');
    }
  };

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

      {showAddModal && activeTab === 'pocs' && (
        <AddPocForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddPoc}
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