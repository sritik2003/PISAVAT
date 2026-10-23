import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pisawat_token') || null);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('pisawat_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState('login');

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('pisawat_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Verify and load user on initial render
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('pisawat_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            if (res.user.wishlist && Array.isArray(res.user.wishlist)) {
              // Extract IDs or full items
              const ids = res.user.wishlist.map(w => (typeof w === 'object' ? w._id : w));
              setWishlist(ids);
            }
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
      if (data.user.wishlist && Array.isArray(data.user.wishlist)) {
        const ids = data.user.wishlist.map(w => (typeof w === 'object' ? w._id : w));
        setWishlist(ids);
      }
      setIsAuthModalOpen(false);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (name, email, password, phone = '', role = 'buyer', storeName = '') => {
    const data = await authAPI.register(name, email, password, phone, role, storeName);
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

  const toggleWishlist = async (product) => {
    const productId = product._id || product.slug || product.id;
    const exists = wishlist.includes(productId);

    // Optimistically update local wishlist
    let updated;
    if (exists) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);

    // If logged in, sync with backend
    if (user && token) {
      try {
        await authAPI.toggleWishlist(productId);
      } catch (err) {
        console.warn('Could not sync wishlist with server:', err.message);
      }
    }

    return !exists;
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
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
        role: user?.role === 'user' ? 'buyer' : (user?.role || 'buyer'),
        isBuyer: !user || user.role === 'buyer' || user.role === 'user',
        isSeller: user?.role === 'seller',
        isAdmin: user?.role === 'admin',
        isSuspended: user?.status === 'suspended',
        isOnHold: user?.status === 'on_hold',
        isAuthenticated: !!user,
        isLoading,
        wishlist,
        toggleWishlist,
        isInWishlist,
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
