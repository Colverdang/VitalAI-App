// App.js - UPDATED
import React, { useState } from 'react';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import PatientPortal from './pages/PatientPortal';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Kiosk from './pages/Kiosk';
import ChatInterface from './components/ChatInterface';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
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
    setUser(userData);
    console.log('User registered:', userData);
    if (userData.userType === 'patient') {
      setCurrentView('patient-portal');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // Render different views
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home 
          onLogin={() => setCurrentView('login')} 
          onRegister={() => setCurrentView('register')}
          onKiosk={() => setCurrentView('kiosk')}
          onChat={() => setCurrentView('chat')} // NEW: Direct chat access
        />;
      
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
            onBackHome={() => setCurrentView('home')}
            onChatAsGuest={() => setCurrentView('chat')} // NEW: Guest chat option
          />
        );
      
      case 'register':
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
            onBackHome={() => setCurrentView('home')}
            onChatAsGuest={() => setCurrentView('chat')} // NEW: Guest chat option
          />
        );
      
      case 'kiosk':
        return <Kiosk onBackHome={() => setCurrentView('home')} />;
      
      case 'chat': // NEW: Direct chat interface
        return <ChatInterface userType="patient" onBackHome={() => setCurrentView('home')} />;
      
      case 'patient-portal':
        return user ? <PatientPortal user={user} onLogout={handleLogout} /> : <Home />;
      
      case 'staff-dashboard':
        return user ? <StaffDashboard user={user} onLogout={handleLogout} /> : <Home />;
      
      case 'admin-dashboard':
        return user ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Home />;
      
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
};

export default App;