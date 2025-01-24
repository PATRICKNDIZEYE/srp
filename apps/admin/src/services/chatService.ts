import axios from 'axios';
import { API_URL } from '../config';

export interface ChatUser {
  id: number;
  name: string;
  ngoName: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  email: string;
}

export interface ChatMessage {
  id: number;
  sender: 'Admin' | 'NGO User';
  message: string;
  timestamp: string;
  senderId: number;
}

export const chatService = {
  getNGOUsers: async () => {
    const response = await axios.get(`${API_URL}/ngos`);
    return response.data;
  },

  getMessages: async (ngoId: number) => {
    const response = await axios.get(`${API_URL}/messages/${ngoId}`);
    return response.data;
  },

  sendMessage: async (ngoId: number, message: string) => {
    const response = await axios.post(`${API_URL}/messages`, {
      ngoId,
      message,
      sender: 'Admin'
    });
    return response.data;
  }
}; 