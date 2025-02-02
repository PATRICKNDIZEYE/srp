import React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

interface DeleteUserModalProps {
  user: {
    id: number;
    name: string;
    role: string;
  };
  onClose: () => void;
  onConfirm: (userId: number) => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ user, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <FiAlertTriangle />
            Delete User
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the following user?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.role}</p>
          </div>
          <p className="text-red-600 text-sm mt-4">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal; 