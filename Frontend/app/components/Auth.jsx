// app/components/Auth.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles/Auth';
import LanguageSelector from './LanguageSelector';
import { apiService } from '../services/api';

// IdentificationStep component with auto ID type detection
const IdentificationStep = ({ 
  isLogin, 
  formData, 
  loading, 
  onInputChange, 
  onRealLogin, 
  onNext, 
  onRealRegister, 
  onTemporaryLogin,
  onShowLanguageSelector,
  getLanguageName,
  showGenderDropdown,
  onGenderSelect,
  onToggleGenderDropdown,
  onDateOfBirthChange,
  onIdNumberChange,
  detectedIdType
}) => (
  <View>
    <Text style={styles.stepTitle}>Identification</Text>
    
    {!isLogin && (
      <>
        <Text style={styles.label}>Name</Text>
        <TextInput
          key="name-input"
          style={styles.input}
          placeholder="Enter your name"
          value={formData.name}
          onChangeText={(text) => onInputChange('name', text)}
        />

        <Text style={styles.label}>Surname</Text>
        <TextInput
          key="surname-input"
          style={styles.input}
          placeholder="Enter your surname"
          value={formData.surname}
          onChangeText={(text) => onInputChange('surname', text)}
        />
      </>
    )}

    <Text style={styles.label}>
      {detectedIdType === 'id' ? 'ID Number (13 digits)' : 
       detectedIdType === 'file' ? 'File Number (10 digits)' : 
       'ID/Passport/File Number'}
    </Text>
    
    {/* Show detected type indicator */}
    {formData.idNumber && detectedIdType && (
      <View style={styles.idTypeIndicator}>
        <Text style={styles.idTypeText}>
          Detected: {detectedIdType === 'id' ? 'ID Number' : 
                    detectedIdType === 'file' ? 'File Number' : 
                    'Passport Number'}
        </Text>
      </View>
    )}

    <TextInput
        key="name-input"
        style={styles.input}
        placeholder={
          detectedIdType === 'id'
              ? "Enter your email or ID number"
              : detectedIdType === 'file'
                  ? "Enter your email or file number"
                  : "Enter email, ID, passport, or file number"
        }
        value={formData.idNumber}
        onChangeText={(text) => {
          // ALLOW EVERYTHING (letters + numbers)
          let cleaned = text;

          // Optional: uppercase passport, file, etc.
          cleaned = cleaned.trim();

          // Optional: limit to reasonable length
          if (cleaned.length > 40) cleaned = cleaned.slice(0, 40);

          onIdNumberChange(cleaned);
        }}
        keyboardType="default"        // <- allows letters and numbers
        autoCapitalize="none"
    />


    {!isLogin && (
      <>
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity 
          style={[
            styles.dropdownButton,
            formData.idNumber.length === 13 && styles.disabledInput
          ]}
          onPress={formData.idNumber.length !== 13 ? onToggleGenderDropdown : null}
          disabled={formData.idNumber.length === 13}
        >
          <Text style={formData.gender ? styles.inputText : styles.placeholderText}>
            {formData.gender || "Select Gender"}
          </Text>
          <Ionicons
            name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={formData.idNumber.length === 13 ? "#999" : "#666"} 
          />
        </TouchableOpacity>

        {showGenderDropdown && formData.idNumber.length !== 13 && (
          <View style={styles.dropdownOptions}>
            {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownOption}
                onPress={() => onGenderSelect(option)}
              >
                <Text style={styles.dropdownOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Phone Number (10-Digits)</Text>
        <TextInput
          key="phoneNumber-input"
          style={styles.input}
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
            onInputChange('phoneNumber', numericText);
          }}
          keyboardType="number-pad"
          maxLength={10}
        />

        <Text style={styles.label}>Preferred Language</Text>
        <TouchableOpacity 
          style={styles.languageInput}
          onPress={onShowLanguageSelector}
        >
          <Text style={formData.language ? styles.inputText : styles.placeholderText}>
            {formData.language ? 
              getLanguageName(formData.language) 
              : "Select your preferred language"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          key="dateOfBirth-input"
          style={[
            styles.input,
            formData.idNumber.length === 13 && styles.disabledInput
          ]}
          placeholder="YYYY-MM-DD"
          value={formData.dateOfBirth}
          onChangeText={(text) => onDateOfBirthChange(text)}
          keyboardType="default"
          maxLength={13}
          editable={formData.idNumber.length !== 13}
          selectTextOnFocus={formData.idNumber.length !== 13}
        />

        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          key="email-input"
          style={styles.input}
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => {
            const validText = text.replace(/[^a-zA-Z0-9@._-]/g, '');
            onInputChange('email', validText);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {formData.email &&
          (!formData.email.includes('@') || !formData.email.includes('.')) && (
            <Text style={{ color: 'red', marginTop: 4 }}>
              Email must contain both "@" and "."
            </Text>
          )}
      </>
    )}

    <Text style={styles.label}>Password *</Text>
    <TextInput
      key="password-input"
      style={styles.input}
      placeholder="Enter password"
      value={formData.password}
      onChangeText={(text) => onInputChange('password', text)}
      secureTextEntry
    />

    {!isLogin && (
      <>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          key="confirmPassword-input"
          style={styles.input}
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChangeText={(text) => onInputChange('confirmPassword', text)}
          secureTextEntry
        />
      </>
    )}

    {isLogin ? (
      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={onRealLogin}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={onNext}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Please wait...' : 'Next'}
        </Text>
      </TouchableOpacity>
    )}

    {/* Demo Login Button */}
    <TouchableOpacity style={styles.temporaryButton} onPress={onTemporaryLogin}>
      <Ionicons name="play-circle-outline" size={20} color="#666" />
      <Text style={styles.temporaryButtonText}>Try Demo Mode</Text>
    </TouchableOpacity>
    <Text style={styles.demoHint}>Quick access without registration</Text>
  </View>
);

// Additional Information Step
const AdditionalInfoStep = ({ 
  formData, 
  loading, 
  onInputChange, 
  onBack, 
  onRealRegister 
}) => (
  <View>
    <Text style={styles.stepTitle}>Additional Information</Text>
    
    {/* Medical History Section - Now 3 separate inputs */}
    <Text style={styles.label}>Medical History (Optional)</Text>
    
    <Text style={styles.subLabel}>Allergies</Text>
    <TextInput
      style={styles.input}
      placeholder="List any known allergies"
      value={formData.allergies}
      onChangeText={(text) => onInputChange('allergies', text)}
    />

    <Text style={styles.subLabel}>Medical Conditions</Text>
    <TextInput
      style={styles.input}
      placeholder="List any medical conditions"
      value={formData.medicalConditions}
      onChangeText={(text) => onInputChange('medicalConditions', text)}
    />

    <Text style={styles.subLabel}>Current Medications</Text>
    <TextInput
      style={styles.input}
      placeholder="List current medications"
      value={formData.medications}
      onChangeText={(text) => onInputChange('medications', text)}
    />

    {/* Emergency Contact Section - Fixed separate inputs */}
    <Text style={styles.label}>Emergency Contact (Optional)</Text>
    
    <Text style={styles.subLabel}>Contact Name</Text>
    <TextInput
      style={styles.input}
      placeholder="Full name of emergency contact"
      value={formData.emergencyContactName}
      onChangeText={(text) => onInputChange('emergencyContactName', text)}
    />

    <Text style={styles.subLabel}>Contact Phone Number</Text>
    <TextInput
      style={styles.input}
      placeholder="Phone number"
      value={formData.emergencyContactPhone}
      onChangeText={(text) => {
        // Remove all non-numeric characters and limit to 10 digits
        const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
        onInputChange('emergencyContactPhone', numericText);
      }}
      keyboardType="number-pad"
      maxLength={10}
    />

    <Text style={styles.label}>Address (Optional)</Text>
    <TextInput
      style={styles.input}
      placeholder="Your residential address"
      value={formData.address}
      onChangeText={(text) => onInputChange('address', text)}
    />

    {/* Vertical Button Layout */}
    <View style={styles.verticalButtonContainer}>
      <TouchableOpacity 
        style={[styles.secondaryButton, loading && styles.buttonDisabled]}
        onPress={onBack}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={onRealRegister}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? 'Registering...' : 'Complete Registration'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Main Auth Component
const Auth = ({ onLogin, onClose, visible }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    idNumber: '',
    passportNumber: '',
    fileNumber: '',
    gender: '',
    phoneNumber: '',
    language: '',
    password: '',
    confirmPassword: '',
    email: '',
    dateOfBirth: '',
    // Updated medical history fields
    allergies: '',
    medicalConditions: '',
    medications: '',
    // Updated emergency contact fields
    emergencyContactName: '',
    emergencyContactPhone: '',
    address: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to detect ID type based on string length and pattern
  const detectIdType = (input) => {
    const cleaned = input.replace(/[^\d]/g, '');
    
    if (cleaned.length === 13) {
      return 'id'; // South African ID number
    } else if (cleaned.length === 10) {
      return 'file'; // File number
    } else if (input.length > 0) {
      return 'passport'; // Passport or other identification
    }
    return null;
  };

  // Function to parse date from SA ID number
  const parseDateFromSAID = (idNumber) => {
    if (!/^\d{13}$/.test(idNumber)) return null;
    
    try {
      const year = idNumber.substring(0, 2);
      const month = idNumber.substring(2, 4);
      const day = idNumber.substring(4, 6);
      
      // Determine century (SA ID numbers: 00-21 typically 2000s, 22-99 typically 1900s)
      let fullYear;
      const yearNum = parseInt(year, 10);
      if (yearNum <= 21) {
        fullYear = `20${year}`;
      } else {
        fullYear = `19${year}`;
      }
      
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      
      // Validate date components
      if (monthNum < 1 || monthNum > 12) return null;
      if (dayNum < 1 || dayNum > 31) return null;
      
      // Create date string in YYYY-MM-DD format
      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error parsing ID number date:', error);
      return null;
    }
  };

  // Function to parse gender from SA ID number (7th digit: 0-4 = female, 5-9 = male)
  const parseGenderFromSAID = (idNumber) => {
    if (!/^\d{13}$/.test(idNumber)) return '';
    
    try {
      const genderDigit = parseInt(idNumber.substring(6, 7), 10);
      return genderDigit < 5 ? 'Female' : 'Male';
    } catch (error) {
      console.error('Error parsing gender from ID:', error);
      return '';
    }
  };

  const handleIdNumberChange = (text) => {
    // Allow letters + numbers for login always
    const cleaned = text.replace(/[^a-zA-Z0-9@.]/g, '');

    handleInputChange('idNumber', cleaned);

    const idType = detectIdType(cleaned);

    // Only auto-fill DOB + gender if it's a TRUE 13-digit numeric ID
    if (/^\d{13}$/.test(cleaned)) {
      const dateOfBirth = parseDateFromSAID(cleaned);
      if (dateOfBirth) handleInputChange('dateOfBirth', dateOfBirth);

      const gender = parseGenderFromSAID(cleaned);
      if (gender) handleInputChange('gender', gender);
    } else {
      // Clear auto-filled fields
      handleInputChange('dateOfBirth', '');
      handleInputChange('gender', '');
    }
  };

  const handleGenderSelect = (gender) => {
    handleInputChange('gender', gender);
    setShowGenderDropdown(false);
  };

  const handleDateOfBirthChange = (text) => {
    // Allow backspace/delete
    if (text.length < formData.dateOfBirth.length) {
      handleInputChange('dateOfBirth', text);
      return;
    }
    
    // Remove all non-digit characters
    let cleaned = text.replace(/[^\d]/g, '');
    
    // Limit to 8 digits (YYYYMMDD)
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }
    
    let formatted = cleaned;
    
    // Auto-add dashes
    if (cleaned.length >= 5) {
      formatted = cleaned.substring(0, 4) + '-' + cleaned.substring(4);
    }
    if (cleaned.length >= 7) {
      formatted = formatted.substring(0, 7) + '-' + formatted.substring(7);
    }
    
    handleInputChange('dateOfBirth', formatted);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!isLogin) {
          // Check if we have any identification number
          if (!formData.idNumber) {
            Alert.alert('Error', 'Please provide an ID, passport, or file number');
            return false;
          }
          
          // Get detected type
          const idType = detectIdType(formData.idNumber);
          
          // Validate based on detected type
          if (idType === 'id' && formData.idNumber.length !== 13) {
            Alert.alert('Error', 'ID number must be exactly 13 digits');
            return false;
          }
          
          if (idType === 'file' && formData.idNumber.length !== 10) {
            Alert.alert('Error', 'File number must be exactly 10 digits');
            return false;
          }
          
          // For passport, just ensure it's not empty
          if (idType === 'passport' && !formData.idNumber.trim()) {
            Alert.alert('Error', 'Please enter a valid passport number');
            return false;
          }
        }

        if (!formData.password) {
          Alert.alert('Error', 'Please enter your password');
          return false;
        }
        
        if (!isLogin && formData.password.length < 8) {
          Alert.alert('Error', 'Password must be at least 8 characters long');
          return false;
        }
        
        if (!isLogin && formData.password !== formData.confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return false;
        }

        if (!isLogin && !formData.email) {
          Alert.alert('Error', 'Please enter your email address');
          return false;
        }

        if (!isLogin && (!formData.name || !formData.surname)) {
          Alert.alert('Error', 'Please enter your name and surname');
          return false;
        }
        return true;
      
      case 1:
        return true;
      
      default:
        return true;
    }
  };

  // REAL BACKEND INTEGRATION
  const handleRealLogin = async () => {
    if (!validateStep(0)) return;

    setLoading(true);

    try {
      // Determine identifier (ID / File / Passport)
      let identifier = '';
      const idType = detectIdType(formData.idNumber);
      
      if (idType === 'id' && formData.idNumber.length === 13) {
        identifier = formData.idNumber; // SA ID
      } else if (idType === 'file' && formData.idNumber.length === 10) {
        identifier = formData.idNumber; // File Number
      } else if (idType === 'passport' && formData.idNumber) {
        identifier = formData.idNumber; // Passport Number
      } else if (formData.email) {
        identifier = formData.email; // fallback to email for dev/testing
      } else {
        Alert.alert('Error', 'Please enter your ID, File Number, Passport, or Email');
        setLoading(false);
        return;
      }

      const loginData = {
        identifier,
        password: formData.password
      };

      const response = await apiService.login(loginData);

      if (response.access_token) {
        const userData = {
          id: response.user?.id || '1',
          fullName: `${response.user?.name || ''} ${response.user?.surname || ''}`.trim() || 'User',
          email: response.user?.email || '',
          phone: response.user?.phone_number,
          idNumber: response.user?.id_number,
          fileNumber: response.user?.file_number,
          passportNumber: response.user?.passport_number,
          gender: response.user?.gender,
          language: response.user?.preferred_language,
          dateOfBirth: response.user?.date_of_birth,
          isTemporary: false
        };

        onLogin(userData);
        Alert.alert('Success', 'Login successful! Welcome back!');
        resetForm();
      } else {
        Alert.alert('Error', 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRealRegister = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {
      const idType = detectIdType(formData.idNumber);
      
      const registerData = {
        name: `${formData.name} ${formData.surname}`.trim(),
        email: formData.email,
        password: formData.password,
        phone_number: formData.phoneNumber,
        // Set the appropriate identification field based on detected type
        ...(idType === 'id' && { id_number: formData.idNumber }),
        ...(idType === 'file' && { file_number: formData.idNumber }),
        ...(idType === 'passport' && { passport_number: formData.idNumber }),
        gender: formData.gender,
        preferred_language: formData.language,
        date_of_birth: formData.dateOfBirth,
        allergies: formData.allergies,
        medical_conditions: formData.medicalConditions,
        medications: formData.medications,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        address: formData.address
      };

      const response = await apiService.register(registerData);
      
      if (response.id || response.user) {
        // Auto-login after registration
        const loginResponse = await apiService.login({
          email: formData.email,
          password: formData.password
        });

        if (loginResponse.access_token) {
          const userData = {
            id: response.id || response.user.id,
            fullName: registerData.name,
            email: formData.email,
            phone: formData.phoneNumber,
            // Set the appropriate identification in user data
            ...(idType === 'id' && { idNumber: formData.idNumber }),
            ...(idType === 'file' && { fileNumber: formData.idNumber }),
            ...(idType === 'passport' && { passportNumber: formData.idNumber }),
            gender: formData.gender,
            language: formData.language,
            dateOfBirth: formData.dateOfBirth,
            allergies: formData.allergies,
            medicalConditions: formData.medicalConditions,
            medications: formData.medications,
            emergencyContactName: formData.emergencyContactName,
            emergencyContactPhone: formData.emergencyContactPhone,
            address: formData.address,
            isTemporary: false
          };

          onLogin(userData);
          Alert.alert('Success', 'Registration successful! Welcome to VitalAi!');
          resetForm();
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemporaryLogin = () => {
    const tempUser = {
      id: 'temp-123',
      fullName: 'Demo User',
      email: 'demo@vitalai.com',
      phone: '+27 12 345 6789',
      idNumber: '9001015000089',
      gender: 'Male',
      language: 'en',
      dateOfBirth: '1990-01-01',
      medicalHistory: {
        allergies: 'None',
        medications: 'None',
        conditions: 'None'
      },
      isTemporary: true
    };

    onLogin(tempUser);
    Alert.alert('Demo Mode', 'You are now logged in with a demo account. Some features may be limited.');
    resetForm();
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      surname: '',
      idNumber: '',
      passportNumber: '',
      fileNumber: '',
      gender: '',
      phoneNumber: '',
      language: '',
      password: '',
      confirmPassword: '',
      email: '',
      dateOfBirth: '',
      // Reset new medical history fields
      allergies: '',
      medicalConditions: '',
      medications: '',
      // Reset new emergency contact fields
      emergencyContactName: '',
      emergencyContactPhone: '',
      address: '',
    });
    setCurrentStep(0);
    setShowGenderDropdown(false);
  };

  const handleLanguageSelect = (language) => {
    handleInputChange('language', language.code);
    setShowLanguageSelector(false);
  };

  const getLanguageName = (code) => {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'af', name: 'Afrikaans' },
      { code: 'zu', name: 'Zulu' },
      { code: 'xh', name: 'Xhosa' },
      { code: 'nso', name: 'Sepedi' },
      { code: 'tn', name: 'Setswana' },
      { code: 'st', name: 'Sesotho' },
      { code: 'ts', name: 'Xitsonga' },
      { code: 'ss', name: 'SiSwati' },
      { code: 've', name: 'Tshivenda' },
      { code: 'nr', name: 'isiNdebele' },
    ];
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const renderStepContent = () => {
    const detectedIdType = detectIdType(formData.idNumber);
    
    if (isLogin) {
      return (
        <IdentificationStep 
          isLogin={isLogin}
          formData={formData}
          loading={loading}
          onInputChange={handleInputChange}
          onRealLogin={handleRealLogin}
          onNext={handleNext}
          onRealRegister={handleRealRegister}
          onTemporaryLogin={handleTemporaryLogin}
          onShowLanguageSelector={() => setShowLanguageSelector(true)}
          getLanguageName={getLanguageName}
          showGenderDropdown={showGenderDropdown}
          onGenderSelect={handleGenderSelect}
          onToggleGenderDropdown={() => setShowGenderDropdown(!showGenderDropdown)}
          onDateOfBirthChange={handleDateOfBirthChange}
          onIdNumberChange={handleIdNumberChange}
          detectedIdType={detectedIdType}
        />
      );
    }

    // Registration steps
    switch (currentStep) {
      case 0:
        return (
          <IdentificationStep 
            isLogin={isLogin}
            formData={formData}
            loading={loading}
            onInputChange={handleInputChange}
            onRealLogin={handleRealLogin}
            onNext={handleNext}
            onRealRegister={handleRealRegister}
            onTemporaryLogin={handleTemporaryLogin}
            onShowLanguageSelector={() => setShowLanguageSelector(true)}
            getLanguageName={getLanguageName}
            showGenderDropdown={showGenderDropdown}
            onGenderSelect={handleGenderSelect}
            onToggleGenderDropdown={() => setShowGenderDropdown(!showGenderDropdown)}
            onDateOfBirthChange={handleDateOfBirthChange}
            onIdNumberChange={handleIdNumberChange}
            detectedIdType={detectedIdType}
          />
        );
      case 1:
        return (
          <AdditionalInfoStep 
            formData={formData}
            loading={loading}
            onInputChange={handleInputChange}
            onBack={handleBack}
            onRealRegister={handleRealRegister}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isLogin ? 'Login to VitalAi' : `Create Account ${!isLogin ? `(${currentStep + 1}/2)` : ''}`}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
              onPress={() => {
                setIsLogin(true);
                resetForm();
              }}
            >
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
              onPress={() => {
                setIsLogin(false);
                resetForm();
              }}
            >
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {renderStepContent()}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text 
                style={styles.footerLink}
                onPress={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
              >
                {isLogin ? 'Register' : 'Login'}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Language Selector Modal */}
      <LanguageSelector 
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onLanguageSelect={handleLanguageSelect}
        currentLanguage={formData.language}
      />
    </Modal>
  );
};

export default Auth;