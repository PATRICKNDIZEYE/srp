import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        setLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export both hooks for backward compatibility
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const useUser = useUserContext; // Alias for the new name

export default UserContext; 