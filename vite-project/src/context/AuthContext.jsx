import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pisawat_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState('login');

  // Verify and load user on initial render
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('pisawat_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Session expired or invalid, logging out:', error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    if (data.success && data.token) {
      localStorage.setItem('pisawat_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (name, email, password, phone = '') => {
    const data = await authAPI.register(name, email, password, phone);
    if (data.success && data.token) {
      localStorage.setItem('pisawat_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('pisawat_token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (view = 'login') => {
    setAuthInitialView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authInitialView,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
