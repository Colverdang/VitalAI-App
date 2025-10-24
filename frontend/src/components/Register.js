import React, { useState } from 'react';
import { Lock, Eye, EyeOff, User, IdCard, Phone, Globe, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import './Auth.css';

const Register = ({ onRegister, onSwitchToLogin, onBackHome }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    identifierType: 'id', // id | passport | file
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    language: 'en',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await register(
        formData.identifier,
        formData.password,
        'patient',
        formData
      );

      if (result.success) onSwitchToLogin();
      else setError(result.error);
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Join VitalAI for a smarter healthcare experience</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Identifier Type */}
          <div className="form-group">
            <label htmlFor="identifierType">Select ID Type</label>
            <div className="input-wrapper">
              <FileText size={18} className="input-icon" />
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
                placeholder={`Enter your ${formData.identifierType}`}
                required
              />
            </div>
          </div>

          {/* First Name */}
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Password */}
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
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="form-group">
            <label htmlFor="language">Preferred Language</label>
            <div className="input-wrapper">
              <Globe size={18} className="input-icon" />
              <LanguageSelector
                selectedLanguage={formData.language}
                onLanguageChange={(lang) => handleInputChange('language', lang)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <span className="auth-link" onClick={onSwitchToLogin}>
            Log in
          </span>
        </p>

        <button className="back-home" onClick={onBackHome}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default Register;
