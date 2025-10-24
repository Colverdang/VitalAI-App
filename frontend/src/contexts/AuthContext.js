// frontend/src/contexts/AuthContext.js - COMPLETE MOCK VERSION
import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      console.log('🔑 MOCK LOGIN - No API call, using mock data');
      console.log('Identifier:', identifier);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user data
      const mockUser = {
        id: 1,
        identifier: identifier,
        email: `${identifier}@example.com`,
        userType: 'patient',
        firstName: 'Test',
        lastName: 'User', 
        name: 'Test User',
        avatar: `https://ui-avatars.com/api/?name=Test+User&background=667eea&color=fff`
      };
      
      const mockToken = `mock_jwt_${identifier}_${Date.now()}`;
      
      // Save to localStorage
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      console.log('✅ MOCK LOGIN SUCCESSFUL:', mockUser);
      return { success: true, user: mockUser };

    } catch (error) {
      console.error('❌ Mock login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (identifier, password, role = 'patient', userData = {}) => {
    try {
      console.log('👤 MOCK REGISTRATION - No API call');
      console.log('Registration data:', { identifier, ...userData });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate ID if it's a South African ID number
      if (userData.identifierType === 'id') {
        const idRegex = /^[0-9]{13}$/;
        if (!idRegex.test(identifier)) {
          return { 
            success: false, 
            error: 'Please enter a valid 13-digit South African ID number' 
          };
        }
      }

      // Validate password
      if (password.length < 6) {
        return { 
          success: false, 
          error: 'Password must be at least 6 characters long' 
        };
      }

      // Create mock user
      const mockUser = {
        id: Date.now(),
        identifier: identifier,
        email: `${identifier}@example.com`,
        userType: 'patient',
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        name: `${userData.firstName || 'New'} ${userData.lastName || 'User'}`,
        phone: userData.phone || '',
        language: userData.language || 'en',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName || 'New')}+${encodeURIComponent(userData.lastName || 'User')}&background=667eea&color=fff`
      };
      
      const mockToken = `mock_jwt_${identifier}_${Date.now()}`;
      
      // Save to localStorage and set user
      localStorage.setItem('access_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      console.log('✅ MOCK REGISTRATION SUCCESSFUL:', mockUser);
      return { 
        success: true, 
        user: mockUser,
        message: 'Registration successful!'
      };

    } catch (error) {
      console.error('❌ Mock registration error:', error);
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('✅ User logged out');
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