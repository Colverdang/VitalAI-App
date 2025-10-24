// frontend/src/components/AppointmentScheduler.js - UPDATED WITH ALL FIELDS REQUIRED
import React, { useState } from 'react';
import { X, Calendar, Clock, User, IdCard, FileText } from 'lucide-react';
import { appointmentsAPI } from '../services/api';
import './AppointmentScheduler.css';

// List of available departments for appointment selection
const DEPARTMENTS = [
  'General Practice',
  'Pediatrics',
  'Emergency',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Dental'
];

// List of available time slots for appointments
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

// ID type options
const ID_TYPES = [
  { value: 'id', label: 'ID Number', pattern: /^[0-9]{13}$/, placeholder: 'Enter 13-digit ID number' },
  { value: 'passport', label: 'Passport Number', pattern: /^[A-Z0-9]{6,12}$/, placeholder: 'Enter passport number' },
  { value: 'file', label: 'File Number', pattern: /^[A-Z0-9]{4,20}$/, placeholder: 'Enter file number' }
];

// AppointmentScheduler component for scheduling a new appointment
const AppointmentScheduler = ({ onSchedule, onClose }) => {
  // State to hold form data for the appointment
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idType: '', // 'id', 'passport', or 'file' - REQUIRED
    idNumber: '', // REQUIRED
    department: '',
    date: '',
    time: '',
    reason: '' // Only this field is optional
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle changes to form fields and update state
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // If ID type changes, clear ID number
    if (field === 'idType') {
      setFormData(prev => ({
        ...prev,
        idNumber: ''
      }));
    }
  };

  // Get current ID type configuration
  const getCurrentIdType = () => {
    return ID_TYPES.find(type => type.value === formData.idType);
  };

  // Validate ID number based on selected type
  const validateIDNumber = (idNumber, idType) => {
    if (!idType || !idNumber.trim()) return false; // Required field
    
    const idConfig = ID_TYPES.find(type => type.value === idType);
    return idConfig.pattern.test(idNumber);
  };

  // Format ID number input based on type
  const formatIDInput = (value, idType) => {
    if (!idType) return value;
    
    switch (idType) {
      case 'id':
        // Only numbers, max 13 digits
        return value.replace(/\D/g, '').slice(0, 13);
      case 'passport':
        // Uppercase letters and numbers
        return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
      case 'file':
        // Uppercase letters and numbers
        return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 20);
      default:
        return value;
    }
  };

  // Get placeholder based on ID type
  const getIdPlaceholder = () => {
    const currentType = getCurrentIdType();
    return currentType ? currentType.placeholder : 'Select ID type';
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // First Name - Required
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name - Required
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // ID Type - Required
    if (!formData.idType) {
      newErrors.idType = 'ID type is required';
    }

    // ID Number - Required
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    } else if (!validateIDNumber(formData.idNumber, formData.idType)) {
      const currentType = getCurrentIdType();
      newErrors.idNumber = `Please enter a valid ${currentType?.label.toLowerCase()}`;
    }

    // Department - Required
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Date - Required
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    // Time - Required
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    // Reason is optional - no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission: validate and send appointment data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const appointmentData = {
        patient_name: `${formData.firstName} ${formData.lastName}`,
        id_type: formData.idType,
        id_number: formData.idNumber,
        clinician: formData.department,
        starts_at: `${formData.date}T${formData.time}:00Z`,
        ends_at: `${formData.date}T${formData.time}:30Z`,
        reason: formData.reason || 'Not specified'
      };
      
      // Use the appointmentsAPI to create appointment
      await appointmentsAPI.createAppointment(appointmentData);
      
      // Call the onSchedule callback with the formatted data
      onSchedule({
        ...appointmentData,
        id: 'APT-' + Date.now(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to create appointment:', error);
      alert('Failed to schedule appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for date input min value
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="modal-overlay">
      <div className="appointment-modal">
        {/* Modal header with title and close button */}
        <div className="modal-header">
          <h3>Schedule Appointment</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Appointment form */}
        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Patient Name - First and Last Name */}
          <div className="form-row">
            <div className="form-group">
              <label>
                <User size={16} />
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>
                <User size={16} />
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

            
            <div className="form-row">
              <div className="form-group">
                <label>ID Type *</label>
                <select
                  value={formData.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  required
                  className={errors.idType ? 'error' : ''}
                >
                  <option value="">Select ID type</option>
                  {ID_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.idType && <span className="error-text">{errors.idType}</span>}
              </div>

              <div className="form-group">
                <label>
                  <FileText size={16} />
                  {getCurrentIdType() ? `${getCurrentIdType().label} *` : 'ID Number *'}
              </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', formatIDInput(e.target.value, formData.idType))}
                  placeholder={getIdPlaceholder()}
                  disabled={!formData.idType}
                  required
                  className={errors.idNumber ? 'error' : ''}
                />
            
              </div>
            </div>

          {/* Department selection */}
          <div className="form-group">
            <label>
              <Calendar size={16} />
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              required
              className={errors.department ? 'error' : ''}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <span className="error-text">{errors.department}</span>}
          </div>

          {/* Date and Time selection */}
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={getTomorrowDate()}
                required
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label>
                <Clock size={16} />
                Time *
              </label>
              <select
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
                className={errors.time ? 'error' : ''}
              >
                <option value="">Select Time</option>
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && <span className="error-text">{errors.time}</span>}
            </div>
          </div>

          {/* Reason for visit textarea - Optional */}
          <div className="form-group">
            <label>Reason for Visit (Optional)</label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="Briefly describe the reason for your visit (optional)..."
              rows="3"
            />
          </div>

          {/* Modal action buttons */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentScheduler;