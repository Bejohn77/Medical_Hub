import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login/', credentials);
      const { tokens, ...userData } = response.data;
      
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      setToken(tokens.access);
      setUser(userData);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || { detail: 'Login failed' }
      };
    }
  };

  const register = async (userData, userType) => {
    try {
      const endpoint = userType === 'doctor'
        ? '/api/auth/register/doctor/'
        : userType === 'nurse'
          ? '/api/auth/register/nurse/'
          : '/api/auth/register/patient/';
      console.log('Registering with:', userData, 'to endpoint:', endpoint);
      const response = await axios.post(endpoint, userData);
      const { tokens, ...user } = response.data;
      
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      setToken(tokens.access);
      setUser(user);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data || { detail: 'Registration failed' }
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
