// frontend/src/contexts/AuthContext.js - IMPROVED ERROR HANDLING
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = async (identifier, password) => {
    try {
      console.log('Attempting login with:', { identifier });
      
      const response = await authAPI.login(identifier, password);
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('access_token', access_token);
      
      // Format user data for frontend
      const frontendUser = {
        ...userData,
        userType: userData.role === 'admin' ? 'admin' : 
                  userData.role === 'staff' ? 'staff' : 'patient',
        name: userData.first_name ? `${userData.first_name} ${userData.last_name}` : userData.identifier,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.first_name || userData.identifier)}&background=667eea&color=fff`
      };
      
      setUser(frontendUser);
      localStorage.setItem('user', JSON.stringify(frontendUser));
      
      return { success: true, user: frontendUser };
    } catch (error) {
      console.error('Login error details:', error);
      
      // Better error message extraction
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (identifier, password, role = 'patient', userData = {}) => {
    try {
      console.log('Attempting registration with:', { identifier, ...userData });
      
      const registrationData = {
        identifier,
        password,
        role,
        ...userData
      };
      
      const response = await authAPI.register(registrationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error details:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};