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
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const rsaLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'nso', name: 'Sepedi', nativeName: 'Sesotho sa Leboa', flag: '🇿🇦' },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana', flag: '🇿🇦' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flag: '🇿🇦' },
  { code: 'ts', name: 'Xitsonga', nativeName: 'Xitsonga', flag: '🇿🇦' },
  { code: 'ss', name: 'SiSwati', nativeName: 'SiSwati', flag: '🇿🇦' },
  { code: 've', name: 'Tshivenda', nativeName: 'Tshivenda', flag: '🇿🇦' },
  { code: 'nr', name: 'isiNdebele', nativeName: 'isiNdebele', flag: '🇿🇦' },
];

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
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateSAID = (id) => {
    // Basic South African ID number validation
    if (!/^\d{13}$/.test(id)) return false;
    
    const month = parseInt(id.substring(2, 4));
    const day = parseInt(id.substring(4, 6));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    return true;
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // ID step
        if (!formData.idNumber && !formData.passportNumber && !formData.fileNumber) {
          Alert.alert('Error', 'Please enter at least one identification number');
          return false;
        }
        
        if (formData.idNumber && !validateSAID(formData.idNumber)) {
          Alert.alert('Error', 'Please enter a valid 13-digit South African ID number');
          return false;
        }
        
        if (formData.passportNumber && formData.passportNumber.length < 6) {
          Alert.alert('Error', 'Please enter a valid passport number');
          return false;
        }
        
        if (formData.fileNumber && formData.fileNumber.length < 4) {
          Alert.alert('Error', 'Please enter a valid hospital file number');
          return false;
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
        return true;
      
      case 1: // Personal info step (registration only)
        if (!formData.name.trim() || !formData.surname.trim()) {
          Alert.alert('Error', 'Please enter your name and surname');
          return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
          Alert.alert('Error', 'Please enter a valid email address');
          return false;
        }
        if (!formData.phoneNumber.trim()) {
          Alert.alert('Error', 'Please enter your phone number');
          return false;
        }
        if (!formData.gender.trim()) {
          Alert.alert('Error', 'Please enter your gender');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };
  // Add this function in Auth.jsx, right after the handleLogin function:

const handleTemporaryLogin = () => {
  // Create a temporary user for demo purposes
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
    isTemporary: true // Flag to identify temporary users
  };

  onLogin(tempUser);
  Alert.alert('Demo Mode', 'You are now logged in with a demo account. Some features may be limited.');
};

  const handleLogin = async () => {
    if (!validateStep(0)) return;

    // Simulate API call
    try {
      // Mock authentication
      const userData = {
        id: '1',
        fullName: `${formData.name} ${formData.surname}`.trim(),
        email: formData.email,
        phone: formData.phoneNumber,
        idNumber: formData.idNumber,
        passportNumber: formData.passportNumber,
        fileNumber: formData.fileNumber,
        gender: formData.gender,
        language: formData.language,
        dateOfBirth: formData.dateOfBirth,
        medicalHistory: {
          allergies: 'Penicillin, Peanuts',
          medications: 'Lisinopril 10mg daily',
          conditions: 'Hypertension'
        }
      };

      onLogin(userData);
      Alert.alert('Success', 'Login successful!');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async () => {
    if (!validateStep(1)) return;

    // Simulate registration
    try {
      const userData = {
        id: Date.now().toString(),
        fullName: `${formData.name} ${formData.surname}`.trim(),
        email: formData.email,
        phone: formData.phoneNumber,
        idNumber: formData.idNumber,
        passportNumber: formData.passportNumber,
        fileNumber: formData.fileNumber,
        gender: formData.gender,
        language: formData.language,
        dateOfBirth: formData.dateOfBirth,
        medicalHistory: {
          allergies: '',
          medications: '',
          conditions: ''
        }
      };

      onLogin(userData);
      Alert.alert('Success', 'Registration successful!');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
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
    });
    setCurrentStep(0);
  };

  const LanguageSelectorModal = () => (
    <Modal
      visible={showLanguageSelector}
      transparent
      animationType="slide"
      onRequestClose={() => setShowLanguageSelector(false)}
    >
      <View style={styles.languageSelectorModal}>
        <View style={styles.languageSelectorContent}>
          <View style={styles.languageHeader}>
            <Text style={styles.languageTitle}>Select Language</Text>
            <TouchableOpacity onPress={() => setShowLanguageSelector(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.languageList}>
            {rsaLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  formData.language === language.code && styles.languageOptionSelected
                ]}
                onPress={() => {
                  handleInputChange('language', language.code);
                  setShowLanguageSelector(false);
                }}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageTextContainer}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNativeName}>{language.nativeName}</Text>
                </View>
                {formData.language === language.code && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const IdentificationStep = () => (
    <View>
      <Text style={styles.stepTitle}>Identification</Text>
      
      {!isLogin && (
        <>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />

          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your surname"
            value={formData.surname}
            onChangeText={(text) => handleInputChange('surname', text)}
          />
        </>
      )}

      <Text style={styles.label}>ID Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 13-digit ID number"
        value={formData.idNumber}
        onChangeText={(text) => handleInputChange('idNumber', text)}
        keyboardType="numeric"
        maxLength={13}
      />

      <Text style={styles.label}>OR Passport Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter passport number"
        value={formData.passportNumber}
        onChangeText={(text) => handleInputChange('passportNumber', text)}
      />

      <Text style={styles.label}>OR File Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter hospital file number"
        value={formData.fileNumber}
        onChangeText={(text) => handleInputChange('fileNumber', text)}
      />

      {!isLogin && (
        <>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Male/Female/Other"
            value={formData.gender}
            onChangeText={(text) => handleInputChange('gender', text)}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Preferred Language</Text>
          <TouchableOpacity 
            style={styles.languageInput}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Text style={formData.language ? styles.inputText : styles.placeholderText}>
              {formData.language ? 
                rsaLanguages.find(lang => lang.code === formData.language)?.name 
                : "Select your preferred language"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.dateOfBirth}
            onChangeText={(text) => handleInputChange('dateOfBirth', text)}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </>
      )}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
      />

      {!isLogin && (
        <>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            secureTextEntry
          />
        </>
      )}

      {isLogin ? (
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>Next</Text>
        </TouchableOpacity>
      )}

      <LanguageSelectorModal />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isLogin ? 'Login to VitalAi' : 'Create Account'}
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
            <IdentificationStep />
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  languageInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  languageSelectorModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  languageSelectorContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  languageList: {
    flex: 1,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageOptionSelected: {
    backgroundColor: '#E8F4FF',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 15,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  languageNativeName: {
    fontSize: 12,
    color: '#666',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  temporaryButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F8F9FA',
  borderRadius: 12,
  paddingVertical: 14,
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#E8ECF0',
  gap: 8,
},
temporaryButtonText: {
  color: '#666',
  fontSize: 16,
  fontWeight: '600',
},
demoHint: {
  fontSize: 12,
  color: '#999',
  textAlign: 'center',
  marginTop: 8,
  fontStyle: 'italic',
},
});

export default Auth;