import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Paperclip, Calendar, History, FileText, Settings, X, Stethoscope, LogIn, Pill, Menu } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import FileUpload from './FileUpload';
import AppointmentScheduler from './AppointmentScheduler';
import Sidebar from './Sidebar';
import { chatAPI } from '../services/api';
import './ChatInterface.css';

const ChatInterface = ({ userType = 'patient', onLogin, user, onLogout, onBackHome }) => {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const messagesEndRef = useRef(null);
  const isGuest = !user;

  const userData = {
    patient: { name: "John Doe", id: "PT-001234" },
    guest: { name: "Guest User", id: "GUEST-001" }
  };
  const currentUser = isGuest ? userData.guest : userData.patient;

  const quickActions = {
    guest: [
      { icon: Calendar, label: 'Book Appointment', action: () => handleQuickAction('book appointment') },
      { icon: History, label: 'General Advice', action: () => handleQuickAction('general advice') },
      { icon: LogIn, label: 'Login / Sign Up', action: () => handleCreateAccount() }
    ],
    patient: [
      { icon: Calendar, label: 'Book Appointment', action: () => handleQuickAction('book appointment') },
      { icon: FileText, label: 'Medical History', action: () => handleQuickAction('medical history') },
      { icon: Stethoscope, label: 'Symptoms Check', action: () => handleQuickAction('symptoms check') },
      { icon: Pill, label: 'Prescriptions', action: () => handleQuickAction('prescriptions') }
    ]
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user', timestamp: new Date(), type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(inputText);
      const botMessage = { id: Date.now() + 1, text: response.data.reply, sender: 'bot', timestamp: new Date(), type: 'text' };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage = { id: Date.now() + 1, text: 'Sorry, I encountered an error. Please try again.', sender: 'bot', timestamp: new Date(), type: 'text' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (action) => {
    const userMessage = { id: Date.now(), text: action, sender: 'user', timestamp: new Date(), type: 'quick_action' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const responses = {
        'book appointment': "I can help you schedule an appointment!",
        'symptoms check': "Please describe your symptoms in detail.",
        'general advice': "I'm here to provide general medical advice.",
        'medical history': "Accessing your medical history...",
        'prescriptions': "Your current prescriptions: Amoxicillin, Vitamin D",
        'create account': "Creating an account will give you access to medical records."
      };
      const botMessage = { id: Date.now() + 1, text: responses[action] || `I can help you with ${action}.`, sender: 'bot', timestamp: new Date(), type: 'text' };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);

      if (action === 'book appointment') setShowAppointmentScheduler(true);
    }, 1000);
  };

  const handleCreateAccount = () => {
    if (typeof onLogin === 'function') onLogin();
    else window.location.href = '/login';
  };

  const handleFileUpload = (file) => {
    const fileMessage = { id: Date.now(), text: `Uploaded: ${file.name}`, sender: 'user', timestamp: new Date(), type: 'file', file };
    setMessages(prev => [...prev, fileMessage]);
    setShowFileUpload(false);
    setTimeout(() => {
      const botMessage = { id: Date.now() + 1, text: "📄 Document received!", sender: 'bot', timestamp: new Date(), type: 'text' };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleAppointmentSchedule = (data) => {
    const appointmentMessage = { id: Date.now(), text: `Appointment: ${data.department} on ${data.date} at ${data.time}`, sender: 'user', timestamp: new Date(), type: 'appointment', appointment: data };
    setMessages(prev => [...prev, appointmentMessage]);
    setShowAppointmentScheduler(false);
    setTimeout(() => {
      const botMessage = { id: Date.now() + 1, text: "✅ Appointment confirmed!", sender: 'bot', timestamp: new Date(), type: 'text' };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'chat' && onBackHome) {
      onBackHome(tabId);
    }
  };

  return (
    <div className="chat-interface-wrapper">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={onLogout}
        onBackHome={onBackHome}
        userType={isGuest ? 'guest' : userType}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
          <div className="header-center">
            <div className="bot-avatar"><Stethoscope size={18} /></div>
            <div className="header-info">
              <h3>VitalAI</h3>
              <span className="status">{isGuest ? '👤 Guest Mode' : '✅ Verified Patient'} • Online</span>
            </div>
          </div>
          <div className="header-actions">
            <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
          </div>
        </div>

        {/* Guest Notice */}
        {isGuest && (
          <div className="guest-notice">
            <span>You're chatting as a guest.</span>
            <button onClick={onLogin} className="guest-upgrade-btn">Login</button>
          </div>
        )}

        {/* Messages */}
        <div className="messages-container">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-avatar">{msg.sender === 'bot' ? <Stethoscope size={14}/> : <User size={14}/>}</div>
              <div className="message-content">
                {msg.type === 'text' && msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                {msg.type === 'file' && <p>📄 {msg.text}</p>}
                {msg.type === 'appointment' && <p>📅 {msg.text}</p>}
                <span className="timestamp">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          ))}
          {isLoading && <div className="message bot"><div className="message-avatar"><Stethoscope size={14}/></div><div className="message-content">VitalAI is typing...</div></div>}
          <div ref={messagesEndRef} className="scroll-anchor"/>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-bar">
          {quickActions[isGuest ? 'guest' : userType].map((action, i) => (
            <button key={i} className="quick-action-btn" onClick={action.action}>
              <action.icon size={16} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <button className="attachment-btn" onClick={() => setShowFileUpload(true)} disabled={isGuest}><Paperclip size={20} /></button>
          <div className="input-wrapper">
            <input 
              type="text" 
              value={inputText} 
              onChange={e => setInputText(e.target.value)} 
              onKeyDown={handleKeyPress} 
              placeholder={isGuest ? "Ask a question..." : "Message VitalAI..."} 
              disabled={isLoading} 
            />
            {inputText && <button className="clear-btn" onClick={() => setInputText('')}><X size={16}/></button>}
          </div>
          <button onClick={sendMessage} disabled={!inputText.trim() || isLoading} className="send-button"><Send size={20}/></button>
        </div>

        {/* Modals */}
        {showFileUpload && <FileUpload onFileUpload={handleFileUpload} onClose={() => setShowFileUpload(false)} />}
        {showAppointmentScheduler && <AppointmentScheduler onSchedule={handleAppointmentSchedule} onClose={() => setShowAppointmentScheduler(false)} />}
      </div>
    </div>
  );
};

export default ChatInterface;