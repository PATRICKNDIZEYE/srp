import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../components/Breadcrumb';
import { BsPersonPlus, BsPencil, BsTrash } from 'react-icons/bs';
import AddUserModal from './AddUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  department: string;
  phoneNumber?: string;
}

const UserManagement = () => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Dummy data
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "John Admin",
      email: "john@minubumwe.gov.rw",
      role: "admin",
      department: "IT Support",
      phoneNumber: "+250 780123456"
    },
    {
      id: 2,
      name: "Sarah Agent",
      email: "sarah@minubumwe.gov.rw",
      role: "agent",
      department: "Communication",
      phoneNumber: "+250 780123457"
    }
  ]);

  const handleAddUser = async (userData: any) => {
    try {
      console.log('User data to be submitted:', userData);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const result = await response.json();
      console.log('User added successfully:', result);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb pageName="User Management" />
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2.5 rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
        >
          <BsPersonPlus className="h-5 w-5" />
          Add New User
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Role</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Department</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {user.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <span className="inline-flex rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {user.department}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowAddModal(true);
                        }}
                        className="hover:text-primary"
                      >
                        <BsPencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          // Delete user logic here
                        }}
                        className="hover:text-danger"
                      >
                        <BsTrash className="h-5 w-5" />
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
          user={selectedUser}
          onClose={() => {
            setShowAddModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleAddUser}
        />
      )}
    </div>
  );
};

export default UserManagement; 