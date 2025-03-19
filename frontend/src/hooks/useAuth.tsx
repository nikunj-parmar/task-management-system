import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { LoginCredentials, RegisterData, User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data);
    } catch (error: any) {
      console.error('Failed to fetch current user:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await userAPI.login(credentials);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await fetchCurrentUser();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.detail || 'Login failed');
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await userAPI.register(data);
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await fetchCurrentUser();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.response?.data) {
        throw new Error(error.response.data.detail || 'Registration failed');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 