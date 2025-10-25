// App.js - COMPLETE FIXED VERSION
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import PatientPortal from './pages/PatientPortal';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Kiosk from './pages/Kiosk';
import ChatInterface from './components/ChatInterface';
import './App.css';

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is authenticated via kiosk staff login
  const isKioskStaffAuthenticated = () => {
    const isStaffLoggedIn = sessionStorage.getItem('isStaffLoggedIn');
    const staffUser = sessionStorage.getItem('staffUser');
    return isStaffLoggedIn && staffUser;
  };

  // Get kiosk staff user data
  const getKioskStaffUser = () => {
    if (isKioskStaffAuthenticated()) {
      try {
        return JSON.parse(sessionStorage.getItem('staffUser'));
      } catch (error) {
        console.error('Error parsing staff user data:', error);
        return null;
      }
    }
    return null;
  };

  // Handle authentication-based redirects
  useEffect(() => {
    if (!loading) {
      const currentPath = location.pathname;
      const kioskStaffUser = getKioskStaffUser();
      
      if (user) {
        // Redirect logged-in users from /chat to their dashboard
        if (currentPath === '/chat' || currentPath === '/') {
          if (user.userType === 'patient') {
            navigate('/portal', { replace: true });
          } else if (user.userType === 'staff') {
            navigate('/staff', { replace: true });
          } else if (user.userType === 'admin') {
            navigate('/admin', { replace: true });
          }
        }
      } else if (kioskStaffUser) {
        // Kiosk staff is logged in but no regular user session
        if (currentPath === '/chat' || currentPath === '/') {
          // Redirect kiosk staff to appropriate dashboard
          if (kioskStaffUser.role === 'admin' || kioskStaffUser.userType === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/staff', { replace: true });
          }
        }
      } else {
        // Redirect guests from protected routes to /chat
        const protectedPaths = ['/portal', '/staff', '/admin'];
        if (protectedPaths.includes(currentPath)) {
          navigate('/chat', { replace: true });
        }
      }
    }
  }, [user, loading, location, navigate]);

  const handleLogin = (userData) => {
    setShowLogin(false);
    // Clear any kiosk staff session when regular login occurs
    sessionStorage.removeItem('isStaffLoggedIn');
    sessionStorage.removeItem('staffUser');
    
    if (userData.userType === 'patient') {
      navigate('/portal');
    } else if (userData.userType === 'staff') {
      navigate('/staff');
    } else if (userData.userType === 'admin') {
      navigate('/admin');
    }
  };

  const handleRegister = (userData) => {
    setShowRegister(false);
    // Clear any kiosk staff session when regular registration occurs
    sessionStorage.removeItem('isStaffLoggedIn');
    sessionStorage.removeItem('staffUser');
    
    if (userData.userType === 'patient') {
      navigate('/portal');
    }
  };

  const handleLogout = () => {
    // Clear both regular auth and kiosk staff sessions
    logout();
    sessionStorage.removeItem('isStaffLoggedIn');
    sessionStorage.removeItem('staffUser');
    navigate('/chat');
  };

  const handleChatAsGuest = () => {
    // Clear kiosk staff session when switching to guest mode
    sessionStorage.removeItem('isStaffLoggedIn');
    sessionStorage.removeItem('staffUser');
    navigate('/chat');
  };

  // Enhanced route protection that checks both regular auth and kiosk staff auth
  const ProtectedRoute = ({ children, allowedUserTypes = [], allowedKioskRoles = [] }) => {
    const kioskStaffUser = getKioskStaffUser();
    
    // Check regular authentication
    if (user && allowedUserTypes.includes(user.userType)) {
      return children;
    }
    
    // Check kiosk staff authentication
    if (kioskStaffUser) {
      const staffRole = kioskStaffUser.role || kioskStaffUser.userType;
      if (allowedKioskRoles.includes(staffRole)) {
        return children;
      }
    }
    
    // If no valid authentication, redirect to chat
    return <Navigate to="/chat" replace />;
  };

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

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route
          path="/chat"
          element={
            <ChatInterface
              userType={user?.userType || (getKioskStaffUser() ? 'staff' : 'guest')}
              onLogin={() => setShowLogin(true)}
              user={user || getKioskStaffUser()}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/kiosk"
          element={<Kiosk onBackHome={() => navigate('/chat')} />}
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={handleLogin}
              onClose={() => navigate('/chat')}
              onSwitchToRegister={() => navigate('/register')}
              onChatAsGuest={handleChatAsGuest}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              onRegister={handleRegister}
              onClose={() => navigate('/chat')}
              onSwitchToLogin={() => navigate('/login')}
              onChatAsGuest={handleChatAsGuest}
            />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute allowedUserTypes={['patient']}>
              <PatientPortal 
                user={user} 
                onLogout={handleLogout} 
              />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/staff"
          element={
            <ProtectedRoute 
              allowedUserTypes={['staff', 'admin']} 
              allowedKioskRoles={['staff', 'nurse', 'doctor', 'receptionist', 'Staff']}
            >
              <StaffDashboard 
                user={user || getKioskStaffUser()} 
                onLogout={handleLogout} 
              />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute 
              allowedUserTypes={['admin']} 
              allowedKioskRoles={['admin', 'administrator', 'Admin']}
            >
              <AdminDashboard 
                user={user || getKioskStaffUser()} 
                onLogout={handleLogout} 
              />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>

      {/* Authentication Modals - Only show if not on auth routes */}
      {showLogin && !location.pathname.includes('/login') && (
        <Login
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onChatAsGuest={handleChatAsGuest}
        />
      )}

      {showRegister && !location.pathname.includes('/register') && (
        <Register
          onRegister={handleRegister}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onChatAsGuest={handleChatAsGuest}
        />
      )}
    </div>
  );
};

// Main App Component with Router and AuthProvider
const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;