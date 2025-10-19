// Home.js - UPDATED
import React from 'react';
import { Stethoscope, MessageCircle, Calendar, Upload, Users, Shield } from 'lucide-react';
import './Home.css';

const Home = ({ onLogin, onRegister, onKiosk, onChat }) => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo">
            <Stethoscope size={32} />
            <h1>VitalAI</h1>
          </div>
          <nav className="nav-links">
            <button onClick={onChat} className="nav-link">Start Chat</button>
            <button onClick={onLogin} className="nav-link">Login</button>
            <button onClick={onKiosk} className="nav-link">Clinic Kiosk</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>AI-Powered Healthcare Assistance</h1>
            <p className="hero-subtitle">
              Get instant medical help - No login required
            </p>
            <p className="hero-description">
              Start chatting with VitalAI immediately for symptom checks, appointment scheduling, 
              and medical advice. Your privacy and immediate access are our priority.
            </p>
            <div className="hero-actions">
              <button 
                onClick={onChat}
                className="cta-button primary large"
              >
                <MessageCircle size={20} />
                Start Free Chat Now
              </button>
              <div className="secondary-actions">
                <button onClick={onLogin} className="cta-button secondary">
                  Patient Login
                </button>
                <button onClick={onKiosk} className="cta-button secondary">
                  Clinic Kiosk
                </button>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="chat-preview">
              <div className="chat-message bot">
                <div className="message-avatar">V</div>
                <div className="message-content">
                  Hello! I'm VitalAI. How can I help you today?
                </div>
              </div>
              <div className="chat-message user">
                <div className="message-content">
                  I have a headache and fever
                </div>
                <div className="message-avatar">U</div>
              </div>
              <div className="chat-message bot">
                <div className="message-avatar">V</div>
                <div className="message-content">
                  I can help assess your symptoms. How long have you had these symptoms?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Immediate Healthcare Access</h2>
          <div className="features-grid">
            <div className="feature-card">
              <MessageCircle className="feature-icon" />
              <h3>No Login Required</h3>
              <p>Start chatting immediately without creating an account</p>
            </div>
            <div className="feature-card">
              <Calendar className="feature-icon" />
              <h3>Quick Appointments</h3>
              <p>Schedule hospital appointments directly through chat</p>
            </div>
            <div className="feature-card">
              <Upload className="feature-icon" />
              <h3>Document Upload</h3>
              <p>Share medical documents securely during your chat</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Multilingual Support</h3>
              <p>Available in 11 South African languages</p>
            </div>
            <div className="feature-card">
              <Shield className="feature-icon" />
              <h3>Private & Secure</h3>
              <p>Your conversations are encrypted and confidential</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Chat Without Login?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <h3>⚡ Instant Access</h3>
              <p>Get medical assistance immediately when you need it most</p>
            </div>
            <div className="benefit-item">
              <h3>🔒 Privacy First</h3>
              <p>No personal information required for basic assistance</p>
            </div>
            <div className="benefit-item">
              <h3>💬 Natural Conversation</h3>
              <p>Chat naturally like you would with a healthcare professional</p>
            </div>
            <div className="benefit-item">
              <h3>🏥 South African Focus</h3>
              <p>Designed specifically for South African healthcare needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Immediate Help?</h2>
          <p>Thousands of South Africans use VitalAI for quick medical assistance</p>
          <button 
            onClick={onChat}
            className="cta-button primary large"
          >
            <MessageCircle size={20} />
            Start Chatting Now - It's Free
          </button>
          <p className="cta-note">
            No registration required • 100% private • Available 24/7
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container">
          <p>&copy; 2024 VitalAI. Immediate healthcare assistance for South Africa.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;