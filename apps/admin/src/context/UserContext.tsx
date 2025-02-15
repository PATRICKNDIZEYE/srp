import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'; // Import axiosInstance

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string; // Add phone to the User interface
}

interface UserContextType {
  userId: string;
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>('1'); // Replace '1' with actual logic to get user ID
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data using axiosInstance
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 