import React, { useState } from 'react';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './pages/PatientPortal';
import StaffDashboard from './pages/StaffDashboard';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    console.log('User registered:', userData);
    // After registration, go to login or directly dashboard
    setCurrentView('login');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // If user is logged in, show dashboard based on type
  if (user) {
    if (user.userType === 'patient') {
      return <PatientDashboard user={user} onLogout={handleLogout} />;
    } else if (user.userType === 'staff') {
      return <StaffDashboard user={user} onLogout={handleLogout} />;
    } else {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Welcome, {user.name}!</h1>
          <p>Unknown user type: {user.userType}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    }
  }

  // Main navigation views
  switch (currentView) {
    case 'home':
      return <Home onLogin={() => setCurrentView('login')} onRegister={() => setCurrentView('register')} />;
    case 'login':
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentView('register')}
          onBackHome={() => setCurrentView('home')}
        />
      );
    case 'register':
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentView('login')}
          onBackHome={() => setCurrentView('home')}
        />
      );
    default:
      return <Home onLogin={() => setCurrentView('login')} onRegister={() => setCurrentView('register')} />;
  }
};

export default App;
