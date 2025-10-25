import React, { useState } from 'react';
import { 
  BarChart3, Users, Calendar, FileText, 
  Bell, Settings, LogOut, Menu, X,
  TrendingUp, Clock, AlertTriangle, MessageCircle, History
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './StaffDashboard.css';

const StaffDashboard = ({ user, onLogout, kioskMode = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = [
    { label: 'Total Patients', value: '1,247', icon: Users, change: '+12%', trend: 'up' },
    { label: 'Appointments Today', value: '34', icon: Calendar, change: '+5%', trend: 'up' },
    { label: 'Pending Tasks', value: '8', icon: FileText, change: '-2%', trend: 'down' },
    { label: 'AI Accuracy', value: '94%', icon: BarChart3, change: '+3%', trend: 'up' }
  ];

  const recentActivities = [
    { id: 1, type: 'appointment', message: 'New appointment scheduled with Dr. Smith', time: '2 min ago' },
    { id: 2, type: 'chat', message: 'Patient consultation completed via chat', time: '15 min ago' },
    { id: 3, type: 'upload', message: 'Medical document uploaded by patient', time: '1 hour ago' },
    { id: 4, type: 'emergency', message: 'Emergency triage case handled', time: '2 hours ago' }
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'John Doe', time: '09:30 AM', department: 'General Practice', status: 'confirmed' },
    { id: 2, patient: 'Sarah Wilson', time: '10:15 AM', department: 'Pediatrics', status: 'confirmed' },
    { id: 3, patient: 'Mike Johnson', time: '11:00 AM', department: 'Cardiology', status: 'pending' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'chat': return MessageCircle;
      case 'upload': return FileText;
      case 'emergency': return AlertTriangle;
      default: return Bell;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Staff-specific navigation items
  const staffNavItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'chats', label: 'Chat Sessions', icon: MessageCircle },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'Activity History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h1>Patient Management</h1>
              <p>Manage patient records and information</p>
            </div>
            <div className="content-placeholder">
              <h3>Patient Management System</h3>
              <p>Patient records, medical history, and treatment plans would be displayed here.</p>
            </div>
          </div>
        );
      
      case 'appointments':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h1>Appointment Schedule</h1>
              <p>View and manage all appointments</p>
            </div>
            <div className="content-placeholder">
              <h3>Appointment Management</h3>
              <p>Full appointment calendar and scheduling system would be displayed here.</p>
            </div>
          </div>
        );
      
      case 'chats':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h1>Chat Sessions</h1>
              <p>Monitor and manage patient chat sessions</p>
            </div>
            <div className="content-placeholder">
              <h3>Chat Management</h3>
              <p>Active chat sessions and conversation history would be displayed here.</p>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h1>Reports & Analytics</h1>
              <p>View clinic performance and patient reports</p>
            </div>
            <div className="content-placeholder">
              <h3>Reports Dashboard</h3>
              <p>Analytics, performance metrics, and report generation would be displayed here.</p>
            </div>
          </div>
        );
      
      case 'history':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h1>Activity History</h1>
              <p>Complete history of clinic activities</p>
            </div>
            <div className="content-placeholder">
              <h3>Activity Log</h3>
              <p>Complete audit trail of all clinic activities would be displayed here.</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="tab-content">
            <div className="content-header">
              <h1>Clinic Settings</h1>
              <p>Manage clinic configuration and preferences</p>
            </div>
            <div className="content-placeholder">
              <h3>Settings Panel</h3>
              <p>Clinic configuration, user management, and system settings would be displayed here.</p>
            </div>
          </div>
        );
      
      default: // overview
        return (
          <div className="dashboard-content">
            <div className="content-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back, {user.name}. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <stat.icon size={24} className="stat-icon" />
                    <span className={`trend ${stat.trend}`}>
                      <TrendingUp size={14} />
                      {stat.change}
                    </span>
                  </div>
                  <div className="stat-content">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="content-grid">
              {/* Recent Activities */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Recent Activities</h3>
                  <Clock size={18} />
                </div>
                <div className="activities-list">
                  {recentActivities.map(activity => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <Icon size={16} />
                        </div>
                        <div className="activity-content">
                          <p>{activity.message}</p>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Upcoming Appointments</h3>
                  <Calendar size={18} />
                </div>
                <div className="appointments-list">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-info">
                        <h4>{appointment.patient}</h4>
                        <p>{appointment.department} • {appointment.time}</p>
                      </div>
                      <span 
                        className="appointment-status"
                        style={{ color: getStatusColor(appointment.status) }}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="staff-dashboard">
      {/* Reusable Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        userType="staff"
        navItems={staffNavItems}
        showLanguageSelector={false}
      />

      {/* Main Content */}
      <div className="main-content">


        {/* Page Content */}
        <div className="page-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;