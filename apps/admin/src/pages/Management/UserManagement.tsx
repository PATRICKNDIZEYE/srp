import React, { useState } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import AddUserModal from '../../components/Management/AddUserModal';
import { toast } from 'react-toastify';
import DeleteUserModal from '../../components/Management/DeleteUserModal';
import EditUserModal from '../../components/Management/EditUserModal';

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
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      role: 'Production Manager',
      site: 'Kigali Dairy',
      coordinates: { lat: -1.9441, lng: 30.0619 },
      status: 'Active',
      lastActive: '2 hours ago',
      email: 'john.doe@example.com',
      phone: '+250 781234567'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Transport Coordinator',
      site: 'Gasabo POC',
      coordinates: { lat: -1.9441, lng: 30.0619 },
      status: 'Active',
      lastActive: '1 day ago',
      email: 'jane.smith@example.com',
      phone: '+250 787654321'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      role: 'Diary Manager',
      site: 'Nyarugenge Diary',
      coordinates: { lat: -1.9508, lng: 30.0575 },
      status: 'Inactive',
      lastActive: '5 days ago',
      email: 'mike.wilson@example.com',
      phone: '+250 789012345'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      role: 'POC Manager',
      site: 'Kicukiro POC',
      coordinates: { lat: -1.9706, lng: 30.0903 },
      status: 'Active',
      lastActive: '3 hours ago',
      email: 'sarah.j@example.com',
      phone: '+250 783456789'
    }
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddUser = (userData: Omit<User, 'id' | 'lastActive'>) => {
    // Add user logic here
    toast.success('User added successfully');
    setShowAddModal(false);
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="User Management" />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Users</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiUserPlus />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <FiMapPin className="mr-1 text-gray-500" />
                      {user.site}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
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

      {showAddModal && (
        <AddUserModal
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