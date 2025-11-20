// app/components/Profiles/ProfileSelector.jsx
import React from 'react';
import DoctorProfile from './DoctorProfile';
import StaffProfile from './StaffProfile';
import PatientProfile from './PatientProfile';

const ProfileSelector = ({ user, onLogout, onUpdateUser }) => {
  if (!user) {
    return null;
  }

  // Determine user role and render appropriate profile
  switch (user.role) {
    case 'doctor':
      return (
        <DoctorProfile 
          user={user} 
          onLogout={onLogout} 
          onUpdateUser={onUpdateUser} 
        />
      );
    case 'staff':
      return (
        <StaffProfile 
          user={user} 
          onLogout={onLogout} 
          onUpdateUser={onUpdateUser} 
        />
      );
    case 'patient':
    default:
      return (
        <PatientProfile 
          user={user} 
          onLogout={onLogout} 
          onUpdateUser={onUpdateUser} 
        />
      );
  }
};

export default ProfileSelector;