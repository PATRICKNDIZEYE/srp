import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import DeleteUserModal from '../../components/Management/DeleteUserModal';
import EditUserModal from '../../components/Management/EditUserModal';
import axiosInstance from '../../utils/axiosInstance';
import AddPocForm from '../../components/Management/AddPocForm';
import AddFarmerModal from '../../components/Management/AddFarmerModal';
import AddTransportModal from '../../components/Management/AddTransportModal';
import AddUserModal from '../../components/Management/AddUserModal';
import AddEditFarmerModal from '../../components/Management/AddEditFarmerModal';

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
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
  username: string;
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
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  const [location, setLocation] = useState<{ longitude: number; latitude: number } | null>(null);

  const fetchData = async () => {
    try {
      if (activeTab === 'users') {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } else if (activeTab === 'farmers') {
        const response = await axiosInstance.get('/farmer');
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

  const handleAddUser = async (userData: any) => {
    try {
      let endpoint = '';
      if (activeTab === 'users') {
        endpoint = '/users';
      } else if (activeTab === 'farmer') {
        endpoint = '/farmer';
      } else if (activeTab === 'transports') {
        endpoint = '/transports';
      }

      if (endpoint) {
        const formattedUserData = {
          ...userData,
          birthday: new Date(userData.birthday).toISOString().split('T')[0] + 'T00:00:00Z',
        };

        await axiosInstance.post(endpoint, formattedUserData);
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

  const handleAddFarmer = (farmerData: any) => {
    // Logic to handle adding a farmer
    console.log('Farmer Data:', farmerData);
    setShowAddFarmerModal(false);
    fetchData(); // Refresh data after adding
  };

  const handleEditFarmer = (farmerData: any) => {
    // Logic to handle editing a farmer
    console.log('Edited Farmer Data:', farmerData);
    setSelectedFarmer(null);
    fetchData(); // Refresh data after editing
  };

  const handleChangeStatus = async (userId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      let endpoint = '';

      if (activeTab === 'users') {
        endpoint = `/users/${userId}/status`;
      } else if (activeTab === 'farmers') {
        endpoint = `/farmer/${userId}/status`;
      } else if (activeTab === 'pocs') {
        endpoint = `/pocs/${userId}/status`;
      } else if (activeTab === 'transports') {
        endpoint = `/transports/${userId}/status`;
      }

      if (endpoint) {
        await axiosInstance.patch(endpoint, { status: newStatus });
        toast.success(`Status changed to ${newStatus}`);
        fetchData(); // Refresh data after status change
      }
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  const handleGenerateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (error) => {
          toast.error('Failed to get location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
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

  const AddTransportForm = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) => {
    const [location, setLocation] = useState<{ longitude: number; latitude: number } | null>(null);

    const handleGenerateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            });
          },
          (error) => {
            toast.error('Failed to get location');
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser');
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto max-h-full">
          <h2 className="text-xl font-semibold mb-4">Add Transport</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              firstName: (e.target as any).firstName.value,
              lastName: (e.target as any).lastName.value,
              birthday: new Date((e.target as any).birthday.value).toISOString(),
              nationalId: (e.target as any).nationalId.value,
              phoneNumber: (e.target as any).phoneNumber.value,
              longitude: location ? location.longitude : parseFloat((e.target as any).longitude.value),
              latitude: location ? location.latitude : parseFloat((e.target as any).latitude.value),
              username: (e.target as any).username.value,
              password: (e.target as any).password.value,
              status: 'pending', // Set default status to 'pending'
            };
            onSubmit(formData);
          }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Birthday</label>
              <input type="date" name="birthday" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">National ID</label>
              <input type="text" name="nationalId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phoneNumber" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input type="number" step="any" name="longitude" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={location ? location.longitude : ''} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input type="number" step="any" name="latitude" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" value={location ? location.latitude : ''} required />
            </div>
            <div className="mb-4">
              <button type="button" onClick={handleGenerateLocation} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Generate Location</button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Close</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="User Management" />
      
      <div className="tabs flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'farmers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Farmers
        </button>
        <button
          onClick={() => setActiveTab('pocs')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'pocs' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          POCs
        </button>
        <button
          onClick={() => setActiveTab('transports')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
            activeTab === 'transports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Transports
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          {activeTab !== 'farmers' && (
            <button 
              onClick={() => {
                if (activeTab === 'farmers') {
                  setShowAddFarmerModal(true);
                } else {
                  setShowAddModal(true);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FiUserPlus />
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            <table className="min-w-full divide-y divide-gray-200 table-users">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
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
          ) : (
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
                {(activeTab === 'farmers' ? farmers : activeTab === 'pocs' ? pocs : transports).map((user) => (
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
                      {user.coordinates ? `${user.coordinates.lat}, ${user.coordinates.lng}` : 'No coordinates'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            if (activeTab === 'farmers') {
                              setSelectedFarmer(user);
                            } else {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }
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
                        <button 
                          onClick={() => handleChangeStatus(user.id, user.status)}
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
          )}
        </div>
      </div>

      {showAddModal && activeTab === 'users' && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}

      {showAddFarmerModal && (
        <AddEditFarmerModal
          isOpen={showAddFarmerModal}
          onClose={() => setShowAddFarmerModal(false)}
          onSubmit={handleAddFarmer}
        />
      )}

      {selectedFarmer && (
        <AddEditFarmerModal
          isOpen={!!selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
          onSubmit={handleEditFarmer}
          initialData={selectedFarmer}
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