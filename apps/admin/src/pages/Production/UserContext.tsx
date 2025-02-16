import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  phoneNumber: string;
  status: string;
}

interface UserContextType {
  userId: string;
  userRole: string;
  userPhone: string;
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>(localStorage.getItem('userId') || '');
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userPhone, setUserPhone] = useState<string>(localStorage.getItem('userPhone') || '');
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
      if (user.id) {
        localStorage.setItem('userId', user.id.toString());
      }
      if (user.status) {
        localStorage.setItem('userRole', user.status);
      }
      if (user.phoneNumber) {
        localStorage.setItem('userPhone', user.phoneNumber);
        setUserPhone(user.phoneNumber);
      }
    }
  }, [user]);

  console.log('User Context:', user);
  return (
    <UserContext.Provider value={{ userId, userRole, userPhone, user }}>
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

export { UserContext }; 