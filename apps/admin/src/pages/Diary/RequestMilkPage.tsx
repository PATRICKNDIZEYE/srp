import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { FiEdit, FiTrash, FiRefreshCw } from 'react-icons/fi';

const RequestMilkPage: React.FC = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [requests, setRequests] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [formData, setFormData] = useState({
    diaryIdFrom: userData.id || '',
    diaryIdAccept: '',
    amount: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
    fetchDiaries();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/request-milk');
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  const fetchDiaries = async () => {
    try {
      const response = await axiosInstance.get('/diaries');
      setDiaries(response.data);
    } catch (error) {
      toast.error('Failed to fetch diaries');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      diaryIdFrom: parseInt(formData.diaryIdFrom),
      diaryIdAccept: parseInt(formData.diaryIdAccept),
      amount: parseFloat(formData.amount),
      description: formData.description,
      status: 'pending',
    };

    try {
      if (isEditing && editId !== null) {
        await axiosInstance.put(`/request-milk/${editId}`, formattedData);
        toast.success('Request updated successfully');
      } else {
        await axiosInstance.post('/request-milk', formattedData);
        toast.success('Request created successfully');
      }
      setFormData({ diaryIdFrom: userData.id || '', diaryIdAccept: '', amount: '', description: '' });
      setIsEditing(false);
      setEditId(null);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const handleEdit = (request: any) => {
    setFormData({
      diaryIdFrom: request.diaryIdFrom.toString(),
      diaryIdAccept: request.diaryIdAccept.toString(),
      amount: request.amount.toString(),
      description: request.description || '',
    });
    setIsEditing(true);
    setEditId(request.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/request-milk/${id}`);
      toast.success('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const handleChangeStatus = async (id: number, newStatus: string) => {
    try {
      await axiosInstance.patch(`/request-milk/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Milk Requests</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">From Diary ID</label>
          <input
            type="text"
            name="diaryIdFrom"
            value={formData.diaryIdFrom}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            readOnly
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">To Diary ID</label>
          <select
            name="diaryIdAccept"
            value={formData.diaryIdAccept}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select a diary</option>
            {diaries.map((diary) => (
              <option key={diary.id} value={diary.id}>
                {diary.firstName} {diary.lastName} (ID: {diary.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Amount (L)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {isEditing ? 'Update Request' : 'Create Request'}
        </button>
      </form>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests
            .filter(
              (request) =>
                request.diaryIdFrom === userData.id || request.diaryIdAccept === userData.id
            )
            .map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{request.diaryFrom.firstName} {request.diaryFrom.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{request.diaryAccept.firstName} {request.diaryAccept.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{request.amount}L</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{request.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {request.diaryIdFrom === userData.id && (
                    <>
                      <button onClick={() => handleEdit(request)} className="text-blue-600 hover:text-blue-900 mr-2"><FiEdit /></button>
                      <button onClick={() => handleDelete(request.id)} className="text-red-600 hover:text-red-900 mr-2"><FiTrash /></button>
                      <button onClick={() => handleChangeStatus(request.id, request.status === 'pending' ? 'completed' : 'pending')} className="text-green-600 hover:text-green-900"><FiRefreshCw /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestMilkPage; 