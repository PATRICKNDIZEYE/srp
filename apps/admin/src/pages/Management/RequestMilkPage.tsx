import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import { FiEdit, FiTrash, FiRefreshCw } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { Diary, Request } from '../../types'; // Assuming you have a types file

const RequestMilkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [requests, setRequests] = useState<Request[]>([]);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [formData, setFormData] = useState({
    diaryIdFrom: id || '',
    diaryIdAccept: '',
    amount: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchRequests();
    }
    fetchDiaries();
  }, [id]);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(`/request-milk/from/${id}`);
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
      setFormData({ diaryIdFrom: id || '', diaryIdAccept: '', amount: '', description: '' });
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