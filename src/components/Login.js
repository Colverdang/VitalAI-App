import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Stethoscope, IdCard } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    userType: 'patient',
    idNumber: '',
    staffNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login - replace with actual API call
    setTimeout(() => {
      const identityNumber = formData.userType === 'patient' ? formData.idNumber : formData.staffNumber;
      const userData = {
        id: 'user-' + Date.now(),
        userType: formData.userType,
        identityNumber: identityNumber,
        name: formData.userType === 'patient' ? 'Patient User' : 'Staff Member',
        avatar: `https://ui-avatars.com/api/?name=${formData.userType}&background=667eea&color=fff`
      };
      onLogin(userData);
      setIsLoading(false);
    }, 1500);
  };

  const getIdentityField = () => {
    if (formData.userType === 'patient') {
      return (
        <div className="form-group">
          <label htmlFor="idNumber">ID/Passport Number</label>
          <div className="input-wrapper">
            <IdCard size={18} className="input-icon" />
            <input
              id="idNumber"
              type="text"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              placeholder="Enter your ID or passport number"
              required
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <label htmlFor="staffNumber">Staff ID</label>
          <div className="input-wrapper">
            <IdCard size={18} className="input-icon" />
            <input
              id="staffNumber"
              type="text"
              value={formData.staffNumber}
              onChange={(e) => handleInputChange('staffNumber', e.target.value)}
              placeholder="Enter your staff ID"
              required
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <Stethoscope size={32} />
            <h1>VitalAI</h1>
          </div>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>User Type</label>
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'patient' ? 'active' : ''}`}
                onClick={() => handleInputChange('userType', 'patient')}
              >
                <User size={16} />
                Patient
              </button>
              <button
                type="button"
                className={`user-type-btn ${formData.userType === 'staff' ? 'active' : ''}`}
                onClick={() => handleInputChange('userType', 'staff')}
              >
                <Stethoscope size={16} />
                Staff
              </button>
            </div>
          </div>

          {getIdentityField()}

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
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button className="switch-link" onClick={onSwitchToRegister}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;