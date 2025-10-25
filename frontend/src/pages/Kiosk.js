// Kiosk.js - UPDATED WITH STAFF/ADMIN SELECTION FIRST
import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Clock, Calendar, MessageCircle, UserPlus, ArrowLeft, Lock, LogIn, Shield, UserCheck } from 'lucide-react';
import PatientPortal from './PatientPortal';
import StaffDashboard from './StaffDashboard';
import AdminDashboard from './AdminDashboard';
import './Kiosk.css';

const Kiosk = ({ onBackHome }) => {
  const [userType, setUserType] = useState(null);
  const [quickAction, setQuickAction] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showStaffTypeSelection, setShowStaffTypeSelection] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [selectedStaffType, setSelectedStaffType] = useState(null);
  const [staffCredentials, setStaffCredentials] = useState({ username: '', password: '' });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Sample staff data for demo
  const sampleStaffData = [
    { 
      username: 'doctor', 
      password: 'doctor123', 
      name: 'Dr. Sarah Wilson', 
      role: 'Doctor',
      department: 'Cardiology'
    },
    { 
      username: 'nurse', 
      password: 'nurse123', 
      name: 'Nurse Jane Smith', 
      role: 'Nurse',
      department: 'Emergency'
    },
    { 
      username: 'admin', 
      password: 'admin123', 
      name: 'Admin User', 
      role: 'Administrator',
      department: 'Administration'
    },
    { 
      username: 'reception', 
      password: 'reception123', 
      name: 'Reception Staff', 
      role: 'Receptionist',
      department: 'Front Desk'
    },
    { 
      username: 'staff', 
      password: 'staff123', 
      name: 'Medical Staff', 
      role: 'Staff',
      department: 'General Practice'
    }
  ];

  // Check if kiosk is accessed via direct URL or has access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('kiosk');
    const validCodes = ['CLINIC123', 'KIOSK2024', 'VITALAI-KIOSK', 'WAITINGROOM'];
    
    if (validCodes.includes(code)) {
      setIsAuthorized(true);
    }
    
    const path = window.location.pathname;
    if (path.includes('/kiosk') || path.includes('/clinic')) {
      setIsAuthorized(true);
    }
  }, []);

  const handleAccessCodeSubmit = (e) => {
    e.preventDefault();
    const validCodes = ['CLINIC123', 'KIOSK2024', 'VITALAI-KIOSK', 'WAITINGROOM'];
    if (validCodes.includes(accessCode.toUpperCase())) {
      setIsAuthorized(true);
    } else {
      alert('❌ Invalid access code. This kiosk mode is for clinic devices only.');
      setAccessCode('');
    }
  };

  // Handle staff type selection
  const handleStaffTypeSelect = (staffType) => {
    setSelectedStaffType(staffType);
    setShowStaffTypeSelection(false);
    setShowStaffLogin(true);
  };

  // Staff login handler
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check against sample staff data
    const staff = sampleStaffData.find(s => 
      s.username === staffCredentials.username && s.password === staffCredentials.password
    );

    if (staff) {
      // Create staff user object
      const staffUser = {
        name: staff.name,
        email: `${staff.username}@clinic.com`,
        userType: staff.role.toLowerCase(),
        role: staff.role,
        department: staff.department,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=667eea&color=fff`
      };
      
      // Store staff session
      sessionStorage.setItem('staffUser', JSON.stringify(staffUser));
      sessionStorage.setItem('isStaffLoggedIn', 'true');
      
      // Redirect based on selected staff type
      if (selectedStaffType === 'staff') {
        setQuickAction('dashboard');
        setUserType('staff');
      } else if (selectedStaffType === 'admin') {
        setQuickAction('dashboard');
        setUserType('admin');
      }
      
      setShowStaffLogin(false);
      
      // Show welcome message
      alert(`✅ Welcome ${staff.name}! You are logged in as ${staff.role}`);
    } else {
      alert('❌ Invalid staff credentials. Please try again.');
    }
    
    setIsAuthenticating(false);
    setStaffCredentials({ username: '', password: '' });
  };

  // Check for existing staff session
  useEffect(() => {
    const isStaffLoggedIn = sessionStorage.getItem('isStaffLoggedIn');
    const staffUser = sessionStorage.getItem('staffUser');
    
    if (isStaffLoggedIn && staffUser) {
      const user = JSON.parse(staffUser);
      // Auto-determine dashboard based on role
      if (user.role === 'Administrator' || user.role === 'admin') {
        setUserType('admin');
      } else {
        setUserType('staff');
      }
      setQuickAction('dashboard');
    }
  }, []);

  // Staff logout handler
  const handleStaffLogout = () => {
    sessionStorage.removeItem('staffUser');
    sessionStorage.removeItem('isStaffLoggedIn');
    setUserType(null);
    setQuickAction(null);
    setShowStaffTypeSelection(false);
    setShowStaffLogin(false);
    setSelectedStaffType(null);
    alert('👋 You have been logged out successfully.');
  };

  // Quick actions for patients
  const patientQuickActions = [
    { 
      id: 'checkin', 
      label: 'Quick Check-in', 
      description: 'Check in for your appointment',
      icon: UserPlus,
      color: '#10B981'
    },
    { 
      id: 'appointment', 
      label: 'Schedule Appointment', 
      description: 'Book a new appointment',
      icon: Calendar,
      color: '#3B82F6'
    },
    { 
      id: 'chat', 
      label: 'Medical Assistance', 
      description: 'Chat with VitalAI for help',
      icon: MessageCircle,
      color: '#8B5CF6'
    },
    { 
      id: 'info', 
      label: 'Clinic Information', 
      description: 'View services and wait times',
      icon: Clock,
      color: '#F59E0B'
    }
  ];

  // Quick actions for staff
  const staffQuickActions = [
    { 
      id: 'dashboard', 
      label: 'Staff Dashboard', 
      description: 'Access full staff dashboard',
      icon: Users,
      color: '#EF4444'
    },
    { 
      id: 'patients', 
      label: 'Patient Queue', 
      description: 'View current patients',
      icon: Users,
      color: '#3B82F6'
    },
    { 
      id: 'schedule', 
      label: 'Today\'s Schedule', 
      description: 'View appointments',
      icon: Calendar,
      color: '#10B981'
    },
    { 
      id: 'quickcheck', 
      label: 'Quick Check-in', 
      description: 'Check in patients quickly',
      icon: UserPlus,
      color: '#8B5CF6'
    }
  ];

  // ACCESS CONTROL SCREEN
  if (!isAuthorized) {
    return (
      <div className="kiosk-access-container">
        <div className="kiosk-access-card">
          <button className="back-button" onClick={onBackHome}>
            <ArrowLeft size={20} />
            Back to VitalAI Chat
          </button>
          
          <div className="kiosk-access-header">
            <div className="clinic-icon">
              <Lock size={48} />
            </div>
            <h1>Clinic Kiosk Access</h1>
            <p>This kiosk mode is designed for physical clinic devices</p>
          </div>

          <form onSubmit={handleAccessCodeSubmit} className="access-code-form">
            <div className="form-group">
              <label htmlFor="accessCode">Enter Clinic Access Code:</label>
              <input
                type="password"
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter authorized clinic code"
                required
                autoComplete="off"
              />
            </div>
            
            <button type="submit" className="access-submit-btn">
              🏥 Access Clinic Kiosk Mode
            </button>
          </form>

          <div className="kiosk-info">
            <h3>For Clinic Use Only:</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Patient Check-in System</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Touch-Optimized Interface</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Quick Actions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STAFF TYPE SELECTION MODAL (FIRST STEP)
  if (showStaffTypeSelection) {
    return (
      <div className="kiosk-staff-type-container">
        <div className="kiosk-staff-type-card">
          <button 
            className="back-button" 
            onClick={() => setShowStaffTypeSelection(false)}
          >
            <ArrowLeft size={20} />
            Back to Selection
          </button>
          
          <div className="staff-type-header">
            <div className="staff-type-icon">
              <UserCheck size={48} />
            </div>
            <h1>Staff Access</h1>
            <p>Please select the type of staff dashboard you want to access</p>
          </div>

          <div className="staff-type-options">
            <div 
              className="staff-type-option staff"
              onClick={() => handleStaffTypeSelect('staff')}
            >
              <div className="type-icon">
                <Users size={32} />
              </div>
              <div className="type-content">
                <h3>Staff Dashboard</h3>
                <p>For medical staff, nurses, doctors, and receptionists</p>
                <ul className="type-features">
                  <li>✓ Patient queue management</li>
                  <li>✓ Appointment scheduling</li>
                  <li>✓ Medical records access</li>
                  <li>✓ Clinic operations</li>
                </ul>
              </div>
              <div className="type-arrow">→</div>
            </div>

            <div 
              className="staff-type-option admin"
              onClick={() => handleStaffTypeSelect('admin')}
            >
              <div className="type-icon">
                <Shield size={32} />
              </div>
              <div className="type-content">
                <h3>Admin Dashboard</h3>
                <p>For administrators and system managers</p>
                <ul className="type-features">
                  <li>✓ System configuration</li>
                  <li>✓ User management</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Security settings</li>
                </ul>
              </div>
              <div className="type-arrow">→</div>
            </div>
          </div>

          <div className="staff-type-footer">
            <p className="note">
              💡 You'll be asked to login with your staff credentials after selecting a dashboard type
            </p>
          </div>
        </div>
      </div>
    );
  }

  // STAFF LOGIN MODAL (SECOND STEP)
  if (showStaffLogin) {
    const dashboardType = selectedStaffType === 'staff' ? 'Staff' : 'Admin';
    
    return (
      <div className="kiosk-login-container">
        <div className="kiosk-login-card">
          <button 
            className="back-button" 
            onClick={() => {
              setShowStaffLogin(false);
              setShowStaffTypeSelection(true);
            }}
          >
            <ArrowLeft size={20} />
            Back to Staff Type
          </button>
          
          <div className="login-header">
            <div className="login-icon">
              {selectedStaffType === 'staff' ? <Users size={48} /> : <Shield size={48} />}
            </div>
            <h1>{dashboardType} Login</h1>
            <p>Enter your staff credentials to access the {dashboardType.toLowerCase()} dashboard</p>
          </div>

          <form onSubmit={handleStaffLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Staff ID / Username:</label>
              <input
                type="text"
                id="username"
                value={staffCredentials.username}
                onChange={(e) => setStaffCredentials(prev => ({...prev, username: e.target.value}))}
                placeholder="Enter your username"
                required
                disabled={isAuthenticating}
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={staffCredentials.password}
                onChange={(e) => setStaffCredentials(prev => ({...prev, password: e.target.value}))}
                placeholder="Enter your password"
                required
                disabled={isAuthenticating}
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit" 
              className="login-submit-btn"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <div className="spinner"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In to {dashboardType} Dashboard
                </>
              )}
            </button>
          </form>

          <div className="demo-credentials">
            <h3>Demo Staff Credentials:</h3>
            <div className="credential-list">
              <div><strong>Doctor:</strong> doctor / doctor123</div>
              <div><strong>Nurse:</strong> nurse / nurse123</div>
              <div><strong>Admin:</strong> admin / admin123</div>
              <div><strong>Reception:</strong> reception / reception123</div>
              <div><strong>Staff:</strong> staff / staff123</div>
            </div>
            <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#64748b'}}>
              💡 Use any of the above credentials to login
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If staff is authenticated and selected dashboard, show appropriate dashboard
  if (userType === 'staff' && quickAction === 'dashboard') {
    const staffUser = JSON.parse(sessionStorage.getItem('staffUser') || '{}');
    
    return (
      <div className="clinic-interface">
        <StaffDashboard 
          user={staffUser} 
          onLogout={handleStaffLogout}
          kioskMode={true}
        />
      </div>
    );
  }

  // If admin is authenticated and selected dashboard, show AdminDashboard
  if (userType === 'admin' && quickAction === 'dashboard') {
    const staffUser = JSON.parse(sessionStorage.getItem('staffUser') || '{}');
    
    return (
      <div className="clinic-interface">
        <AdminDashboard 
          user={staffUser} 
          onLogout={handleStaffLogout}
          kioskMode={true}
        />
      </div>
    );
  }

  // If user has selected a specific mode, show that interface
  if (userType === 'patient' && quickAction) {
    return (
      <div className="clinic-interface">
        <div className="kiosk-header">
          <button className="back-btn" onClick={() => setQuickAction(null)}>
            <ArrowLeft size={20} />
            Back to Services
          </button>
          <h1>Patient Services - {patientQuickActions.find(a => a.id === quickAction)?.label}</h1>
        </div>
        <PatientPortal 
          kioskMode={true} 
          quickAction={quickAction}
          onBackHome={() => {
            setQuickAction(null);
            setUserType(null);
          }}
        />
      </div>
    );
  }

  if (userType === 'staff' && quickAction && quickAction !== 'dashboard') {
    return (
      <div className="clinic-interface">
        <div className="kiosk-header">
          <button className="back-btn" onClick={() => setQuickAction(null)}>
            <ArrowLeft size={20} />
            Back to Services
          </button>
          <h1>Staff Portal - {staffQuickActions.find(a => a.id === quickAction)?.label}</h1>
        </div>
        <div className="quick-action-content">
          <div className="action-message">
            <h2>Quick Action: {staffQuickActions.find(a => a.id === quickAction)?.label}</h2>
            <p>This would open the specific staff function in a real implementation.</p>
            <button 
              className="btn-primary"
              onClick={() => setQuickAction('dashboard')}
            >
              Go to Full Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user has selected a type but no specific action, show quick actions
  if (userType) {
    const actions = userType === 'patient' ? patientQuickActions : staffQuickActions;
    
    return (
      <div className="clinic-interface">
        <div className="clinic-header">
          <button className="back-btn" onClick={() => setUserType(null)}>
            <ArrowLeft size={20} />
            Back to Main Menu
          </button>
          <h1>{userType === 'patient' ? 'Patient Services' : 'Staff Portal'}</h1>
          {userType === 'staff' && (
            <button 
              className="staff-logout-btn"
              onClick={handleStaffLogout}
            >
              <LogIn size={16} />
              Switch User
            </button>
          )}
        </div>

        <div className="quick-actions-view">
          <h2>What would you like to do?</h2>
          <div className="quick-actions-grid">
            {actions.map((action) => (
              <div
                key={action.id}
                className="quick-action-card"
                onClick={() => setQuickAction(action.id)}
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon">
                  <action.icon size={32} />
                </div>
                <div className="action-content">
                  <h3>{action.label}</h3>
                  <p>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main selection screen (initial authorized view)
  return (
    <div className="clinic-interface initial">
      <div className="clinic-header">
        <div className="clinic-logo">
          <Stethoscope size={40} />
          <h1>VitalAI Clinic Center</h1>
        </div>
        <div className="clinic-status">
          <div className="status-open">● Clinic Open</div>
          <span>Current Wait Time: 15-20 mins</span>
        </div>
      </div>

      <div className="user-selection">
        <h2>Welcome to Our Clinic</h2>
        <p className="selection-subtitle">Please select how you would like to use this kiosk:</p>
        
        <div className="selection-grid">
          <div 
            className="selection-card patient"
            onClick={() => setUserType('patient')}
          >
            <div className="selection-icon">
              <Users size={48} />
            </div>
            <div className="selection-content">
              <h3>I'm a Patient</h3>
              <p>Check in, schedule appointments, get medical assistance, or view clinic information</p>
              <ul className="feature-list">
                <li>✓ Quick check-in</li>
                <li>✓ Schedule appointments</li>
                <li>✓ Medical assistance</li>
                <li>✓ Clinic information</li>
              </ul>
            </div>
            <div className="selection-arrow">→</div>
          </div>

          <div 
            className="selection-card staff"
            onClick={() => setShowStaffTypeSelection(true)} // Changed this line
          >
            <div className="selection-icon">
              <Stethoscope size={48} />
            </div>
            <div className="selection-content">
              <h3>I'm Clinic Staff</h3>
              <p>Access patient queue, medical records, schedule, and clinic analytics</p>
              <ul className="feature-list">
                <li>✓ Patient queue management</li>
                <li>✓ Medical records access</li>
                <li>✓ Appointment schedule</li>
                <li>✓ Clinic analytics</li>
              </ul>
            </div>
            <div className="selection-arrow">→</div>
          </div>
        </div>

        <div className="kiosk-footer">
          <button className="back-home-btn" onClick={onBackHome}>
            ← Back to VitalAI Home
          </button>
        </div>
      </div>

      <div className="help-section">
        <div className="emergency-alert">
          <div className="emergency-info">
            <strong>Emergency?</strong> Please proceed directly to reception
          </div>
          <div className="help-info">
            <strong>Need help?</strong> Ask our staff for assistance
          </div>
        </div>
        
        <div className="language-selector">
          <span>Language: </span>
          <select>
            <option>English</option>
            <option>isiZulu</option>
            <option>isiXhosa</option>
            <option>Afrikaans</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Kiosk;