// frontend/src/components/ChatInterface.js - COMPLETELY REFRESHED
import { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Paperclip, Calendar, History, 
  FileText, Settings, Menu, X, Stethoscope,
  Phone, Download, AlertTriangle,
  LogIn, UserPlus, Pill
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import FileUpload from './FileUpload';
import AppointmentScheduler from './AppointmentScheduler';
import { chatAPI } from '../services/api';
import './ChatInterface.css';

const ChatInterface = ({ userType = 'patient', onBackHome, onLogin, user }) => {
  // All state variables properly defined
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm VitalAI, your medical assistant. You're chatting as a guest. I can help with symptoms, appointments, and general medical advice. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  
  const messagesEndRef = useRef(null);
  const isGuest = !user;

  // Mock data for demonstration
  const userData = {
    patient: {
      name: "John Doe",
      id: "PT-001234",
      age: 35,
      bloodType: "O+",
      lastVisit: "2024-01-15",
      primaryDoctor: "Dr. Sarah Smith"
    },
    guest: {
      name: "Guest User",
      id: "GUEST-001",
      age: null,
      bloodType: null,
      lastVisit: null,
      primaryDoctor: null
    }
  };

  // Quick actions configuration
  const quickActions = {
    guest: [
      { 
        icon: Calendar, 
        label: 'Book Appointment', 
        action: () => handleQuickAction('book appointment')
      },
      { 
        icon: History, 
        label: 'General Advice', 
        action: () => handleQuickAction('general advice')
      },
      { 
        icon: LogIn, 
        label: 'Login / sign up', 
        action: () => handleCreateAccount()
      }
    ],
    patient: [
      { 
        icon: Calendar, 
        label: 'Book Appointment', 
        action: () => handleQuickAction('book appointment')
      },
      { 
        icon: FileText, 
        label: 'Medical History', 
        action: () => handleQuickAction('medical history')
      },
      { 
        icon: Stethoscope, 
        label: 'Symptoms Check', 
        action: () => handleQuickAction('symptoms check')
      },
      { 
        icon: Pill, 
        label: 'Prescriptions', 
        action: () => handleQuickAction('prescriptions')
      }
    ]
  };

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
        setIsSidebarMinimized(false);
      } else {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle sidebar minimize
  const toggleSidebarMinimize = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  // Handle quick actions
  const handleQuickAction = (action) => {
    const userMessage = {
      id: Date.now(),
      text: action,
      sender: 'user',
      timestamp: new Date(),
      type: 'quick_action'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response based on action
    setTimeout(() => {
      const responses = {
        'book appointment': "I can help you schedule an appointment! Let me show you the appointment scheduler.",
        'symptoms check': "Please describe your symptoms in detail. I'll help assess them and provide guidance.",
        'general advice': "I'm here to provide general medical advice. What specific health questions do you have?",
        'medical history': "Accessing your medical history... You have 3 visits in the past year.",
        'prescriptions': "Your current prescriptions: Amoxicillin (500mg), Vitamin D (1000 IU)",
        'create account': "Creating an account will give you access to medical records, prescription management, and personalized care."
      };

      const botMessage = {
        id: Date.now() + 1,
        text: responses[action] || `I can help you with ${action}. What would you like to know?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);

      // Open appointment scheduler for booking
      if (action === 'book appointment') {
        setTimeout(() => setShowAppointmentScheduler(true), 1000);
      }
    }, 1500);
  };

  // Handle create account
  const handleCreateAccount = () => {
    // Redirect user to login page (use onLogin prop if provided, otherwise fallback to a route)
    setTimeout(() => {
      if (typeof onLogin === 'function') {
        onLogin();
      } else {
        window.location.href = '/login';
      }
    }, 1200);
  };

  // Send message function
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Use real backend API
      const response = await chatAPI.sendMessage(inputText);
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (file) => {
    const fileMessage = {
      id: Date.now(),
      text: `Uploaded medical document: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'file',
      file: file
    };
    setMessages(prev => [...prev, fileMessage]);
    setShowFileUpload(false);
    
    // Simulate AI processing file
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: "📄 Document received! I've added it to your medical records.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  // Handle appointment scheduling
  const handleAppointmentSchedule = (appointmentData) => {
    const appointmentMessage = {
      id: Date.now(),
      text: `Appointment scheduled: ${appointmentData.department} on ${appointmentData.date} at ${appointmentData.time}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'appointment',
      appointment: appointmentData
    };
    setMessages(prev => [...prev, appointmentMessage]);
    setShowAppointmentScheduler(false);
    
    // Follow-up message
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: "✅ Appointment confirmed! I've added it to your personal calendar.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get current user data
  const currentUser = isGuest ? userData.guest : userData.patient;

  // Sidebar content component
  const SidebarContent = () => (
    <>
      <div className="sidebar-header">
        {!isSidebarMinimized && <h3>VitalAI Menu</h3>}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {!isMobile && (
            <button 
              className="minimize-btn"
              onClick={toggleSidebarMinimize}
              aria-label={isSidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              {isSidebarMinimized ? '>' : '<'}
            </button>
          )}
          {isMobile && (
            <button 
              className="close-sidebar-btn"
              onClick={() => setShowSidebar(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      
      <div className="sidebar-content">
        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar-large">
            <User size={24} />
          </div>
          {!isSidebarMinimized && (
            <div className="user-details">
              <h4>{currentUser.name}</h4>
              <p className="user-id">{currentUser.id}</p>
              {!isGuest && (
                <div className="user-health">
                  <span>Age: {currentUser.age}</span>
                  <span>Blood: {currentUser.bloodType}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {!isGuest ? (
            <>
              <button className="nav-item">
                <History size={18} />
                {!isSidebarMinimized && <span>Medical History</span>}
              </button>
              <button className="nav-item">
                <Pill size={18} />
                {!isSidebarMinimized && <span>Prescriptions</span>}
              </button>
              <button className="nav-item">
                <Calendar size={18} />
                {!isSidebarMinimized && <span>Appointments</span>}
              </button>
              <button className="nav-item">
                <FileText size={18} />
                {!isSidebarMinimized && <span>Medical Records</span>}
              </button>
            </>
          ) : (
            <button className="nav-item highlight" onClick={onLogin}>
              <UserPlus size={18} />
              {!isSidebarMinimized && <span>Login</span>}
              {!isSidebarMinimized && <span className="nav-badge">Recommended</span>}
            </button>
          )}
          
          <button className="nav-item">
            <Settings size={18} />
            {!isSidebarMinimized && <span>Settings</span>}
          </button>
        </nav>

        {/* Emergency Section */}
        <div className="emergency-section">
          {!isSidebarMinimized && (
            <div className="emergency-header">
              <AlertTriangle size={18} />
              <span>Emergency Contacts</span>
            </div>
          )}
          <button className="emergency-btn primary">
            <Phone size={16} />
            {!isSidebarMinimized && <span>Call Emergency: 10111</span>}
          </button>
          <button className="emergency-btn secondary">
            <Phone size={16} />
            {!isSidebarMinimized && <span>Clinic Emergency Line</span>}
          </button>
          
          {onBackHome && (
            <button className="back-home-btn" onClick={onBackHome}>
              {!isSidebarMinimized ? "← Back to Homepage" : "←"}
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="chat-interface">
      {/* Desktop Sidebar */}
      {!isMobile && showSidebar && (
        <div className={`sidebar-menu ${isSidebarMinimized ? 'minimized' : ''}`}>
          <SidebarContent />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="main-chat-area">
        {/* Header */}
        <div className="chat-header">
          <button 
            className="menu-btn"
            onClick={() => {
              if (isMobile) {
                setShowSidebar(!showSidebar);
              } else {
                setIsSidebarMinimized(!isSidebarMinimized);
              }
            }}
            aria-label={isMobile ? "Open menu" : isSidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            <Menu size={20} />
          </button>
          
          <div className="header-center">
            <div className="bot-avatar">
              <Stethoscope size={18} />
            </div>
            <div className="header-info">
              <h3>VitalAI</h3>
              <span className="status">
                {isGuest ? '👤 Guest Mode' : '✅ Verified Patient'} • Online
              </span>
            </div>
          </div>

          <div className="header-actions">
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>

        {/* Guest Notice */}
        {isGuest && (
          <div className="guest-notice">
            <span className="guest-icon">👤</span>
            <span>You're chatting as a guest. </span>
            <button onClick={onLogin} className="guest-upgrade-btn">
              login
            </button>
          </div>
        )}

        {/* Messages Container */}
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'bot' ? 
                  <div className="bot-avatar-icon">
                    <Stethoscope size={14} />
                  </div> : 
                  <div className="user-avatar-icon">
                    <User size={14} />
                  </div>
                }
              </div>
              <div className="message-content">
                {message.type === 'file' && (
                  <div className="file-message">
                    <Paperclip size={16} />
                    <span className="file-name">{message.text}</span>
                    <button className="download-btn">
                      <Download size={14} />
                    </button>
                  </div>
                )}
                {message.type === 'appointment' && (
                  <div className="appointment-message">
                    <Calendar size={16} />
                    <span>{message.text}</span>
                  </div>
                )}
                {message.type === 'text' && (
                  <div className="text-message">
                    {message.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="message bot">
              <div className="message-avatar">
                <div className="bot-avatar-icon">
                  <Stethoscope size={14} />
                </div>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span>VitalAI is typing</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="scroll-anchor" />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-bar">
          {quickActions[isGuest ? 'guest' : userType].map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={action.action}
            >
              <action.icon size={16} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

    {/* Input Area */}
<div className="input-area">
  <button 
    className="attachment-btn"
    onClick={() => {
      console.log('Attachment button clicked'); // Debug log
      setShowFileUpload(true);
    }}
    disabled={isGuest}
    title={isGuest ? "Create account to upload files" : "Upload medical document"}
  >
    <Paperclip size={20} />
  </button>
  
  <div className="input-wrapper">
    <input
      type="text"
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder={isGuest ? "Describe your symptoms or ask a medical question..." : "Message VitalAI about your health concerns..."}
      disabled={isLoading}
    />
    {inputText && (
      <button 
        className="clear-btn"
        onClick={() => setInputText('')}
      >
        <X size={16} />
      </button>
    )}
  </div>
  
  <button 
    onClick={sendMessage} 
    disabled={!inputText.trim() || isLoading}
    className="send-button"
  >
    <Send size={20} />
  </button>
</div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
          <div className="sidebar-menu" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Modals */}
      {showFileUpload && (
        <FileUpload 
          onFileUpload={handleFileUpload}
          onClose={() => setShowFileUpload(false)}
        />
      )}
      
      {showAppointmentScheduler && (
        <AppointmentScheduler 
          onSchedule={handleAppointmentSchedule}
          onClose={() => setShowAppointmentScheduler(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;