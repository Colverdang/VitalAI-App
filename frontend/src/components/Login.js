// frontend/src/components/Login.js - UPDATED
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Stethoscope, MessageCircle, IdCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = ({ onLogin, onSwitchToRegister, onBackHome, onChatAsGuest }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    identifierType: 'id', // id | passport | file
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate ID if it's a South African ID number
    if (formData.identifierType === 'id') {
      const idRegex = /^[0-9]{13}$/;
      if (!idRegex.test(formData.identifier)) {
        setError('Please enter a valid 13-digit South African ID number');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.identifier, formData.password);
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Stethoscope size={32} />
            <h1>VitalAI</h1>
          </div>
          <p>Sign in with your credentials or chat as guest</p>
        </div>

        {/* Guest Chat Option */}
        <div className="guest-section">
          <button 
            className="guest-chat-btn"
            onClick={onChatAsGuest}
          >
            <MessageCircle size={20} />
            <div>
              <strong>Chat as Guest</strong>
              <span>No login required • Immediate access</span>
            </div>
            <span className="arrow">→</span>
          </button>
        </div>

        <div className="divider">
          <span>Or sign in</span>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Identifier Type */}
          <div className="form-group">
            <label htmlFor="identifierType">ID Type</label>
            <div className="input-wrapper">
              <IdCard size={18} className="input-icon" />
              <select
                id="identifierType"
                value={formData.identifierType}
                onChange={(e) => handleInputChange('identifierType', e.target.value)}
                required
              >
                <option value="id">South African ID Number</option>
                <option value="passport">Passport Number</option>
                <option value="file">Hospital File Number</option>
              </select>
            </div>
          </div>

          {/* Identifier */}
          <div className="form-group">
            <label htmlFor="identifier">
              {formData.identifierType === 'id'
                ? 'ID Number'
                : formData.identifierType === 'passport'
                ? 'Passport Number'
                : 'File Number'}
            </label>
            <div className="input-wrapper">
              <IdCard size={18} className="input-icon" />
              <input
                id="identifier"
                type="text"
                value={formData.identifier}
                onChange={(e) => handleInputChange('identifier', e.target.value)}
                placeholder={`Enter your ${formData.identifierType === 'id' ? '13-digit ID number' : formData.identifierType}`}
                required
                pattern={formData.identifierType === 'id' ? '[0-9]{13}' : '.*'}
                title={formData.identifierType === 'id' ? 'Please enter a valid 13-digit South African ID number' : ''}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#forgot" className="forgot-link">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button className="switch-link" onClick={onSwitchToRegister}>
              Sign up
            </button>
          </p>
          <button className="back-link" onClick={onBackHome}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;