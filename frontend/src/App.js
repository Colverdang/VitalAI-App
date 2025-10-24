// App.js - UPDATED WITH CHATINTERFACE AS LANDING PAGE
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import PatientPortal from './pages/PatientPortal';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Kiosk from './pages/Kiosk';
import ChatInterface from './components/ChatInterface';
import './App.css';

// Main App Content Component
const AppContent = () => {
  const [currentView, setCurrentView] = useState('chat'); // CHANGED: Default to 'chat' instead of 'home'
  const { user, logout, loading } = useAuth();

  // Backend connection test
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log('Testing backend connection to:', process.env.REACT_APP_API_URL);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend connection successful:', data);
        return true;
      } catch (error) {
        console.error('❌ Backend connection failed:', error.message);
        console.log('💡 Please ensure:');
        console.log('1. Backend server is running on port 8000');
        console.log('2. CORS is properly configured');
        console.log('3. The /api/health endpoint exists');
        return false;
      }
    };

    // Test specific endpoints
    const testEndpoints = async () => {
      const endpoints = ['/health', '/auth/login', '/auth/register'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`);
          console.log(`🔍 ${endpoint}: ${response.status} ${response.statusText}`);
        } catch (error) {
          console.error(`🔍 ${endpoint}:`, error.message);
        }
      }
    };

    testBackendConnection().then(isConnected => {
      if (isConnected) {
        testEndpoints();
      }
    });
  }, []);

  // Redirect based on authentication status
  useEffect(() => {
    if (!loading && user) {
      // User is logged in, redirect to appropriate dashboard
      if (user.userType === 'patient') {
        setCurrentView('patient-portal');
      } else if (user.userType === 'staff') {
        setCurrentView('staff-dashboard');
      } else if (user.userType === 'admin') {
        setCurrentView('admin-dashboard');
      }
    } else if (!loading && !user && currentView !== 'chat' && currentView !== 'login' && currentView !== 'register' && currentView !== 'home') {
      // User is not logged in and not on public pages, redirect to chat (new landing page)
      setCurrentView('chat');
    }
  }, [user, loading, currentView]);

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    
    // Redirect based on user type
    if (userData.userType === 'patient') {
      setCurrentView('patient-portal');
    } else if (userData.userType === 'staff') {
      setCurrentView('staff-dashboard');
    } else if (userData.userType === 'admin') {
      setCurrentView('admin-dashboard');
    }
  };

  const handleRegister = (userData) => {
    console.log('User registered:', userData);
    if (userData.userType === 'patient') {
      setCurrentView('patient-portal');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('chat'); // CHANGED: Redirect to chat after logout
  };

  const handleChatAsGuest = () => {
    setCurrentView('chat');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading VitalAI...</p>
        </div>
      </div>
    );
  }

  // Render different views
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            onLogin={() => setCurrentView('login')} 
            onRegister={() => setCurrentView('register')}
            onKiosk={() => setCurrentView('kiosk')}
            onChat={() => setCurrentView('chat')}
            user={user}
            onLogout={handleLogout}
          />
        );
      
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
            onBackHome={() => setCurrentView('chat')} // CHANGED: Back to chat instead of home
            onChatAsGuest={handleChatAsGuest}
          />
        );
      
      case 'register':
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
            onBackHome={() => setCurrentView('chat')} // CHANGED: Back to chat instead of home
            onChatAsGuest={handleChatAsGuest}
          />
        );
      
      case 'kiosk':
        return (
          <Kiosk 
            onBackHome={() => setCurrentView('chat')} // CHANGED: Back to chat instead of home
            onLogin={() => setCurrentView('login')}
          />
        );
      
      case 'chat': // CHANGED: This is now the main landing page
        return (
          <ChatInterface 
            userType={user?.userType || 'guest'} 
            onBackHome={() => setCurrentView('home')} // Keep option to go to original home if needed
            onLogin={() => setCurrentView('login')}
            user={user}
            isLandingPage={true} // Add this prop to customize behavior
          />
        );
      
      case 'patient-portal':
        return user ? (
          <PatientPortal 
            user={user} 
            onLogout={handleLogout}
            onBackHome={() => setCurrentView('chat')} // CHANGED: Back to chat instead of home
          />
        ) : (
          <ChatInterface /> // CHANGED: Redirect to chat if not authenticated
        );
      
      case 'staff-dashboard':
        return user ? (
          <StaffDashboard 
            user={user} 
            onLogout={handleLogout}
            onBackHome={() => setCurrentView('chat')} // CHANGED: Back to chat instead of home
          />
        ) : (
          <ChatInterface /> // CHANGED: Redirect to chat if not authenticated
        );
      
      case 'admin-dashboard':
        return user ? (
          <AdminDashboard 
            user={user} 
            onLogout={handleLogout}
            onBackHome={() => setCurrentView('chat')} // CHANGED: Back to chat instead of home
          />
        ) : (
          <ChatInterface /> // CHANGED: Redirect to chat if not authenticated
        );
      
      default:
        return <ChatInterface />; // CHANGED: Default to chat interface
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
};

// Main App Component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;