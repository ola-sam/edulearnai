import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  grade: number;
  points: number;
  avatarUrl: string | null;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // For demo purposes, initialize with the demo user (ID: 1)
  // In a real app, we would check for an auth token and fetch the user
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/users/1'],
    retry: false,
    onError: (error) => {
      console.error('Failed to load user:', error);
      setError(error as Error);
    }
  });
  
  useEffect(() => {
    if (userData) {
      setUser(userData);
      setError(null);
    }
  }, [userData]);
  
  // Simulated login function
  const login = async (username: string, password: string) => {
    try {
      // In a real app, we would make an API call to verify credentials
      // and get a token
      const response = await fetch('/api/users/1');
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      setUser(userData);
      setError(null);
      
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };
  
  // Simulated logout function
  const logout = () => {
    // Clear user data
    setUser(null);
  };
  
  return (
    <UserContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};
