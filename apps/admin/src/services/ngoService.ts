import axios from 'axios';
import { NGO, AnnualTarget } from '../types';
import axiosInstance from "../utils/axiosInstance.ts";


// Dummy data for NGOs

export const ngoService = {
  // NGO Registration
  registerNGO: async (ngoData: Omit<NGO, 'id'>) => {
    const response = await axios.post(`${API_URL}/ngos`, ngoData);
    return response.data;
  },

  // Get NGO Profile
  getNGOProfile: async (id: number) => {
    const response = await axios.get(`${API_URL}/ngos/${id}`);
    return response.data;
  },

  // Update NGO Profile
  updateNGOProfile: async (id: number, ngoData: Partial<NGO>) => {
    const response = await axios.put(`${API_URL}/ngos/${id}`, ngoData);
    return response.data;
  },

  // Submit Annual Target
  submitAnnualTarget: async (targetData: Omit<AnnualTarget, 'id'>) => {
    const response = await axios.post(`${API_URL}/annual-targets`, targetData);
    return response.data;
  },

  // Get Annual Targets
  getAnnualTargets: async (ngoId: number) => {
    const response = await axios.get(`${API_URL}/ngos/${ngoId}/annual-targets`);
    return response.data;
  },

  getAllNGOs: async () => {
    // Simulate API delay
    const response = await axiosInstance.get(`/ngos`);
    return (await response.data)
  },

  sendMessage : async (ngoId: number, content: string) => {
        const response = await axiosInstance.post(`/user-messages/ngo/${ngoId}/send`, {
          content,
          ngoId
        });
        return response.data;

        },

  getNgoMessage : async (ngoId : number) =>{
    const response = await axiosInstance.get(`/user-messages/ngo/${ngoId}/messages`)
    const messages = response.data;
    const messageIds = messages.map((message: any) => message.id);

    // Send a POST request to mark messages as read
    if (messageIds.length > 0) {
      const setMessageAsRead = await axiosInstance.post(
          `/user-messages/ngo/${ngoId}/messages/read`,
          { messageIds }
      );
      console.log("Set messages as read response:", setMessageAsRead.data);
    } else {
      console.log("No messages to mark as read.");
    }

    return (await response.data)

  },

  updateNGOStatus: async (id: number, status: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find and update the NGO status in dummy data
    const ngo = dummyNGOs.find(n => n.id === id);
    if (ngo) {
      ngo.status = status as 'pending' | 'approved' | 'declined';
    }
    
    return ngo;
  }
}; 