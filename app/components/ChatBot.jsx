// app/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Keyboard,
  ActivityIndicator,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Switch,
  Alert,
} from 'react-native';
import { styles } from './styles/ChatBot';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Appointments Component
const Appointments = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    contact: '',
  });
  const [appointmentData, setAppointmentData] = useState({
    department: '',
    date: '',
    time: '',
    reason: '',
  });

  const departments = [
    "Emergency", "General Medicine", "Pediatrics", "Surgery", 
    "Orthopedics", "Cardiology", "Neurology", "Dermatology",
    "Gastroenterology", "Respiratory", "Maternity", "Pharmacy"
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const upcomingAppointments = [
    {
      id: '1',
      department: 'General Medicine',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'Confirmed',
    },
    {
      id: '2',
      department: 'Cardiology',
      doctor: 'Dr. Michael Chen',
      date: '2024-01-20',
      time: '02:30 PM',
      status: 'Pending',
    },
  ];

  const pastAppointments = [
    {
      id: '3',
      department: 'Dermatology',
      doctor: 'Dr. Emily Davis',
      date: '2024-01-05',
      time: '11:00 AM',
      status: 'Completed',
    },
  ];

  const handleBookAppointment = () => {
    const newAppointment = {
      id: Date.now().toString(),
      department: appointmentData.department,
      doctor: 'Dr. To be assigned',
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'Pending',
    };
    
    setShowBookingModal(false);
    setCurrentStep(0);
    Alert.alert('Success', 'Appointment booked successfully!');
  };

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.department}>{item.department}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'Confirmed' && styles.statusConfirmed,
          item.status === 'Pending' && styles.statusPending,
          item.status === 'Completed' && styles.statusCompleted,
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.doctor}>👨‍⚕️ {item.doctor}</Text>
      <View style={styles.appointmentDetails}>
        <Text style={styles.detail}>📅 {item.date}</Text>
        <Text style={styles.detail}>⏰ {item.time}</Text>
      </View>
      {item.status === 'Pending' && (
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => setShowBookingModal(true)}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.bookButtonText}>Book New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        {upcomingAppointments.length > 0 ? (
          <FlatList
            data={upcomingAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#CCC" />
            <Text style={styles.emptyStateText}>No upcoming appointments</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Past Appointments</Text>
        {pastAppointments.length > 0 ? (
          <FlatList
            data={pastAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#CCC" />
            <Text style={styles.emptyStateText}>No past appointments</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showBookingModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book Appointment</Text>
            
            {currentStep === 0 && (
              <View>
                <Text style={styles.modalText}>Your Information</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={patientData.name}
                  onChangeText={(text) => setPatientData(prev => ({...prev, name: text}))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={patientData.age}
                  onChangeText={(text) => setPatientData(prev => ({...prev, age: text}))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  keyboardType="phone-pad"
                  value={patientData.contact}
                  onChangeText={(text) => setPatientData(prev => ({...prev, contact: text}))}
                />
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => setCurrentStep(1)}
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {currentStep === 1 && (
              <View>
                <Text style={styles.modalText}>Appointment Details</Text>
                <Text style={styles.label}>Select Department:</Text>
                <ScrollView style={styles.departmentList}>
                  {departments.map(dept => (
                    <TouchableOpacity 
                      key={dept}
                      style={[
                        styles.optionButton,
                        appointmentData.department === dept && styles.optionButtonSelected
                      ]}
                      onPress={() => setAppointmentData(prev => ({...prev, department: dept}))}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        appointmentData.department === dept && styles.optionButtonTextSelected
                      ]}>
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <Text style={styles.label}>Preferred Time:</Text>
                <ScrollView horizontal style={styles.timeSlots}>
                  {timeSlots.map(slot => (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.timeSlot,
                        appointmentData.time === slot && styles.timeSlotSelected
                      ]}
                      onPress={() => setAppointmentData(prev => ({...prev, time: slot}))}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        appointmentData.time === slot && styles.timeSlotTextSelected
                      ]}>
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Reason for visit"
                  multiline
                  numberOfLines={3}
                  value={appointmentData.reason}
                  onChangeText={(text) => setAppointmentData(prev => ({...prev, reason: text}))}
                />
                
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleBookAppointment}
                >
                  <Text style={styles.primaryButtonText}>Confirm Booking</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setShowBookingModal(false)}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// History Component
const History = ({ messages }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const chatHistory = messages.filter(msg => msg.id !== '1');
  
  const categories = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'symptoms', label: 'Symptoms', icon: 'heart' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'emergency', label: 'Emergency', icon: 'warning' },
  ];

  const filterHistory = (category) => {
    switch (category) {
      case 'symptoms':
        return chatHistory.filter(msg => 
          msg.type === 'medical_advice' || msg.type === 'triage_result'
        );
      case 'appointments':
        return chatHistory.filter(msg => 
          msg.type === 'appointment_confirmation'
        );
      case 'emergency':
        return chatHistory.filter(msg => 
          msg.type === 'emergency'
        );
      default:
        return chatHistory;
    }
  };

  const filteredHistory = filterHistory(selectedCategory);

  const formatDate = (timestamp) => {
    return timestamp.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'emergency':
        return { icon: 'warning', color: '#FF3B30' };
      case 'appointment_confirmation':
        return { icon: 'calendar', color: '#007AFF' };
      case 'medical_advice':
        return { icon: 'medical', color: '#34C759' };
      case 'triage_result':
        return { icon: 'analytics', color: '#FF9500' };
      default:
        return { icon: 'chatbubble', color: '#666' };
    }
  };

  const renderHistoryItem = ({ item }) => {
    const { icon, color } = getMessageIcon(item.type);
    
    return (
      <View style={styles.historyItem}>
        <View style={styles.historyHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <Text style={styles.date}>
            {formatDate(item.timestamp)}
          </Text>
          <Text style={styles.time}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <Text style={styles.messagePreview} numberOfLines={2}>
          {item.isUser ? 'You: ' : 'VitalAi: '}
          {item.text}
        </Text>
        
        {item.department && (
          <View style={styles.departmentBadge}>
            <Ionicons name="medical-outline" size={12} color="#666" />
            <Text style={styles.departmentText}>{item.department}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat History</Text>
        <Text style={styles.subtitle}>
          {chatHistory.length} conversations
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.id ? '#007AFF' : '#666'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        style={styles.historyList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>No history yet</Text>
            <Text style={styles.emptyStateText}>
              Your chat history will appear here once you start conversations with VitalAi
            </Text>
          </View>
        }
      />
    </View>
  );
};

// Profile Component
const Profile = ({ patientData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    age: '32',
    gender: 'Male',
    bloodType: 'O+',
    contact: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    emergencyContact: '+1 (555) 987-6543',
    allergies: 'Penicillin, Peanuts',
    medications: 'None',
    conditions: 'None',
  });

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    dataSharing: false,
    emergencyAlerts: true,
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const MedicalInfoCard = ({ title, value, icon }) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color="#007AFF" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value || 'Not specified'}</Text>
    </View>
  );

  const SettingItem = ({ title, subtitle, value, onValueChange, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color="#666" />
        <View style={styles.settingTexts}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#FFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={profileData.name}
                onChangeText={(text) => setProfileData(prev => ({...prev, name: text}))}
              />
            ) : (
              profileData.name
            )}
          </Text>
          <Text style={styles.memberId}>ID: VAM2024001</Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
        >
          <Ionicons 
            name={isEditing ? "checkmark" : "pencil"} 
            size={20} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInputSmall}
                value={profileData.age}
                keyboardType="numeric"
                onChangeText={(text) => setProfileData(prev => ({...prev, age: text}))}
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.age} years</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gender</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInputSmall}
                value={profileData.gender}
                onChangeText={(text) => setProfileData(prev => ({...prev, gender: text}))}
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.gender}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Blood Type</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInputSmall}
                value={profileData.bloodType}
                onChangeText={(text) => setProfileData(prev => ({...prev, bloodType: text}))}
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.bloodType}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Contact</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInputSmall}
                value={profileData.contact}
                onChangeText={(text) => setProfileData(prev => ({...prev, contact: text}))}
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.contact}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
        <MedicalInfoCard
          title="Allergies"
          value={profileData.allergies}
          icon="warning-outline"
        />
        <MedicalInfoCard
          title="Current Medications"
          value={profileData.medications}
          icon="medical-outline"
        />
        <MedicalInfoCard
          title="Medical Conditions"
          value={profileData.conditions}
          icon="heart-outline"
        />
        <MedicalInfoCard
          title="Emergency Contact"
          value={profileData.emergencyContact}
          icon="call-outline"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          title="Push Notifications"
          subtitle="Receive appointment reminders"
          value={settings.notifications}
          onValueChange={() => toggleSetting('notifications')}
          icon="notifications-outline"
        />
        <SettingItem
          title="Emergency Alerts"
          subtitle="Important health alerts"
          value={settings.emergencyAlerts}
          onValueChange={() => toggleSetting('emergencyAlerts')}
          icon="warning-outline"
        />
        <SettingItem
          title="Data Sharing"
          subtitle="Help improve VitalAi (anonymous)"
          value={settings.dataSharing}
          onValueChange={() => toggleSetting('dataSharing')}
          icon="share-social-outline"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>Export Medical Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>View Medical Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={[styles.actionButtonText, styles.dangerText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Main ChatBot Component
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeNav, setActiveNav] = useState('chat');
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    language: 'English',
  });
  const [symptoms, setSymptoms] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    department: '',
    preferredDate: '',
    preferredTime: '',
  });
  
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Medical knowledge base
  const medicalKnowledge = {
    headache: {
      response: "For headaches, try resting in a quiet room, staying hydrated, and considering over-the-counter pain relief if appropriate. If severe, persistent, or accompanied by other symptoms like vision changes or fever, consult a doctor immediately.",
      department: "General Medicine",
      severity: "moderate"
    },
    fever: {
      response: "For fever, ensure proper hydration, rest, and monitor temperature. If fever is high (above 102°F/39°C), lasts more than 3 days, or is accompanied by rash or difficulty breathing, seek medical attention.",
      department: "General Medicine",
      severity: "moderate"
    },
    cough: {
      response: "For cough, stay hydrated, use a humidifier, and consider honey (for adults). If accompanied by breathing difficulties, chest pain, bloody mucus, or lasts more than 3 weeks, see a doctor.",
      department: "Respiratory",
      severity: "moderate"
    },
    pain: {
      response: "For general pain, rest the affected area and consider appropriate pain relief. If pain is severe, sudden, or accompanied by other symptoms like swelling or redness, seek medical care.",
      department: "General Medicine",
      severity: "moderate"
    },
    covid: {
      response: "COVID-19 symptoms vary. Common ones include fever, cough, fatigue, loss of taste/smell. If you have severe symptoms like difficulty breathing, persistent chest pain, or confusion, seek emergency care immediately.",
      department: "Emergency",
      severity: "high"
    },
    allergy: {
      response: "For allergies, avoid triggers when possible. Antihistamines may help. For severe allergic reactions (anaphylaxis) with swelling, difficulty breathing, or dizziness, use epinephrine and seek emergency care.",
      department: "Emergency",
      severity: "high"
    },
    dizziness: {
      response: "For dizziness, sit or lie down immediately to prevent falls. Stay hydrated. If accompanied by chest pain, palpitations, numbness, or vision changes, seek emergency care.",
      department: "General Medicine",
      severity: "moderate"
    },
    nausea: {
      response: "For nausea, try small sips of clear fluids, bland foods, and rest. If accompanied by severe abdominal pain, vomiting blood, or dehydration signs, seek medical care.",
      department: "Gastroenterology",
      severity: "moderate"
    },
    chest: {
      response: "🚨 CHEST PAIN: This could be a medical emergency! Please seek immediate medical attention or call emergency services. Do not delay.",
      department: "Emergency",
      severity: "critical"
    },
    breathing: {
      response: "🚨 DIFFICULTY BREATHING: This is a medical emergency! Please go to the nearest emergency department or call emergency services immediately.",
      department: "Emergency",
      severity: "critical"
    }
  };

  const departments = [
    "Emergency", "General Medicine", "Pediatrics", "Surgery", 
    "Orthopedics", "Cardiology", "Neurology", "Dermatology",
    "Gastroenterology", "Respiratory", "Maternity", "Pharmacy"
  ];

  const faqData = {
    english: [
      { question: "What are the visiting hours?", answer: "Visiting hours are from 10:00 AM to 4:00 PM daily." },
      { question: "Do I need an appointment?", answer: "Appointments are recommended but not required for emergency cases." },
      { question: "What should I bring to my appointment?", answer: "Please bring your ID, medical aid card, and any relevant medical records." },
      { question: "Is parking available?", answer: "Yes, free parking is available for patients and visitors." }
    ]
  };

  const emergencyKeywords = [
    'chest pain', 'heart attack', 'stroke', 'difficulty breathing', 
    'severe bleeding', 'suicide', 'emergency', 'can\'t breathe', 
    'choking', 'unconscious', 'severe pain', 'broken bone', 'burn',
    'chest', 'breathing'
  ];

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: "👋 Hello! I'm VitalAi, your medical assistant. I can help you with:\n\n• 🤒 Symptom checking and triage\n• 📅 Appointment booking\n• ❓ General hospital information\n• 🏥 Department referrals\n\nHow can I assist you today? Please remember I'm an AI assistant and not a substitute for professional medical advice.",
        isUser: false,
        timestamp: new Date(),
        type: 'welcome'
      },
    ]);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getMedicalResponse = async (userMessage) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const message = userMessage.toLowerCase();
    let response = '';
    let department = '';
    let severity = 'moderate';

    // Check for emergencies first
    for (const keyword of emergencyKeywords) {
      if (message.includes(keyword)) {
        response = '🚨 URGENT: This sounds like a medical emergency! Please call emergency services immediately or go to the nearest hospital. Do not delay seeking professional medical help.';
        department = 'Emergency';
        severity = 'critical';
        
        const emergencyMessage = {
          id: Date.now().toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
          type: 'emergency',
          department: department,
          severity: severity
        };
        
        setIsTyping(false);
        return emergencyMessage;
      }
    }
    

    // Check for specific conditions
    let foundCondition = false;
    for (const [condition, info] of Object.entries(medicalKnowledge)) {
      if (message.includes(condition)) {
        response = info.response;
        department = info.department;
        severity = info.severity;
        foundCondition = true;
        break;
      }
    }

    // Check for appointment-related keywords
    if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
      response = "I can help you book an appointment. Let me gather some information to schedule your visit.";
      setShowAppointmentModal(true);
    }
    // Check for symptom-related keywords
    else if (message.includes('symptom') || message.includes('pain') || message.includes('feel') || !foundCondition) {
      response = "I'd like to understand your symptoms better to direct you to the right department. Let me ask you a few questions.";
      setShowTriageModal(true);
    }
    // Check for FAQ questions
    else if (message.includes('?') || message.includes('what') || message.includes('how') || message.includes('when')) {
      const faqResponse = searchFAQ(message);
      if (faqResponse) {
        response = faqResponse;
      } else if (!foundCondition) {
        response = "Thank you for your question. While I can provide general health information, it's important to consult with a healthcare professional for personalized medical advice. Would you like me to help you with symptom checking or appointment booking?";
      }
    }
    // Default response if no specific condition found
    else if (!foundCondition) {
      response = "Thank you for sharing your health concern. While I can provide general health information, it's important to consult with a healthcare professional for personalized medical advice. Could you tell me more about your specific symptoms or how I can assist you?";
    }

    const botMessage = {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
      type: foundCondition ? 'medical_advice' : 'general',
      department: department,
      severity: severity
    };

    setIsTyping(false);
    return botMessage;
  };

  const searchFAQ = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    for (const faq of faqData.english) {
      if (lowerQuestion.includes(faq.question.toLowerCase().split(' ')[0]) || 
          faq.question.toLowerCase().includes(lowerQuestion.split(' ')[0])) {
        return `🤔 ${faq.question}\n\n💡 ${faq.answer}`;
      }
    }
    
    return null;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    Keyboard.dismiss();

    const botResponse = await getMedicalResponse(inputText);
    setMessages(prev => [...prev, botResponse]);
  };

  const startSymptomTriage = () => {
    setShowTriageModal(true);
    setCurrentStep(0);
    setSymptoms([]);
  };

  const startAppointmentBooking = () => {
    setShowAppointmentModal(true);
    setCurrentStep(0);
  };

  const handleTriageStep = (symptom) => {
    setSymptoms(prev => [...prev, symptom]);
    
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      const triageResult = analyzeSymptoms([...symptoms, symptom]);
      const triageMessage = {
        id: Date.now().toString(),
        text: `Based on your symptoms, I recommend:\n\n🏥 Department: ${triageResult.department}\n⚠️ Priority: ${triageResult.priority}\n\n${triageResult.advice}\n\nWould you like me to help you book an appointment?`,
        isUser: false,
        timestamp: new Date(),
        type: 'triage_result',
        department: triageResult.department
      };
      
      setMessages(prev => [...prev, triageMessage]);
      setShowTriageModal(false);
      setCurrentStep(0);
      setSymptoms([]);
    }
  };

  const analyzeSymptoms = (symptomsList) => {
    let highSeverityCount = 0;
    let departments = new Set();
    
    symptomsList.forEach(symptom => {
      for (const [condition, info] of Object.entries(medicalKnowledge)) {
        if (symptom.toLowerCase().includes(condition)) {
          departments.add(info.department);
          if (info.severity === 'high' || info.severity === 'critical') {
            highSeverityCount++;
          }
        }
      }
    });

    let priority = 'Standard';
    let advice = 'Please schedule an appointment at your convenience.';
    
    if (highSeverityCount > 0) {
      priority = 'Urgent';
      advice = 'Please seek medical attention within 24 hours.';
    }
    
    if (highSeverityCount > 1) {
      priority = 'Emergency';
      advice = 'Please go to the emergency department immediately.';
    }

    return {
      department: Array.from(departments).join(', ') || 'General Medicine',
      priority: priority,
      advice: advice
    };
  };

  const handleAppointmentStep = (data) => {
    if (currentStep === 0) {
      setPatientData(data);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setAppointmentData(data);
      
      const appointmentMessage = {
        id: Date.now().toString(),
        text: `✅ Appointment Booked Successfully!\n\n📋 Details:\n• Patient: ${patientData.name}\n• Department: ${data.department}\n• Date: ${data.preferredDate}\n• Time: ${data.preferredTime}\n\nYou will receive a confirmation SMS. Please arrive 15 minutes early.`,
        isUser: false,
        timestamp: new Date(),
        type: 'appointment_confirmation'
      };
      
      setMessages(prev => [...prev, appointmentMessage]);
      setShowAppointmentModal(false);
      setCurrentStep(0);
    }
  };

  const renderMessage = ({ item }) => (
    <Animated.View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage,
      item.type === 'emergency' && styles.emergencyMessage,
      item.type === 'welcome' && styles.welcomeMessage,
      { opacity: fadeAnim }
    ]}>
      <View style={styles.messageHeader}>
        {!item.isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="medical" size={16} color="#fff" />
          </View>
        )}
        <Text style={styles.senderName}>
          {item.isUser ? 'You' : 'VitalAi'}
        </Text>
        {item.isUser && (
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={16} color="#fff" />
          </View>
        )}
      </View>
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.botMessageText,
        item.type === 'emergency' && styles.emergencyText
      ]}>
        {item.text}
      </Text>
      {item.department && (
        <View style={styles.departmentTag}>
          <Ionicons name="medical-outline" size={14} color="#666" />
          <Text style={styles.departmentTagText}>
            Recommended: {item.department}
          </Text>
        </View>
      )}
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Animated.View>
  );

  const QuickActions = () => (
    <Animated.View style={[styles.quickActions, { opacity: fadeAnim }]}>
      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
        <TouchableOpacity style={styles.quickAction} onPress={startSymptomTriage}>
          <Ionicons name="heart-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>Symptom Check</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={startAppointmentBooking}>
          <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>Book Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => setInputText("What are the visiting hours?")}>
          <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => setInputText("Emergency help")}>
          <Ionicons name="warning-outline" size={20} color="#FF3B30" />
          <Text style={styles.quickActionText}>Emergency</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  const NavBar = () => (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={[styles.navItem, activeNav === 'chat' && styles.navItemActive]}
        onPress={() => setActiveNav('chat')}
      >
        <Ionicons 
          name="chatbubble-ellipses-outline" 
          size={24} 
          color={activeNav === 'chat' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeNav === 'chat' && styles.navTextActive]}>
          Chat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeNav === 'appointments' && styles.navItemActive]}
        onPress={() => setActiveNav('appointments')}
      >
        <Ionicons 
          name="calendar-outline" 
          size={24} 
          color={activeNav === 'appointments' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeNav === 'appointments' && styles.navTextActive]}>
          Appointments
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeNav === 'history' && styles.navItemActive]}
        onPress={() => setActiveNav('history')}
      >
        <Ionicons 
          name="time-outline" 
          size={24} 
          color={activeNav === 'history' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeNav === 'history' && styles.navTextActive]}>
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeNav === 'profile' && styles.navItemActive]}
        onPress={() => setActiveNav('profile')}
      >
        <Ionicons 
          name="person-outline" 
          size={24} 
          color={activeNav === 'profile' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeNav === 'profile' && styles.navTextActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderActiveTab = () => {
    switch (activeNav) {
      case 'chat':
        return (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContainer}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              ListFooterComponent={
                isTyping ? (
                  <View style={[styles.messageContainer, styles.botMessage, styles.typingContainer]}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.typingText}>VitalAi is analyzing your symptoms...</Text>
                  </View>
                ) : null
              }
            />

            <QuickActions />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Describe your symptoms or ask a question..."
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        );
      case 'appointments':
        return <Appointments />;
      case 'history':
        return <History messages={messages} />;
      case 'profile':
        return <Profile patientData={patientData} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Ionicons name="medical" size={28} color="#007AFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>VitalAi</Text>
            <Text style={styles.headerSubtitle}>Medical Assistant</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderActiveTab()}
      </KeyboardAvoidingView>

      {/* Navigation Bar */}
      <NavBar />

      {/* Triage Modal */}
      <Modal visible={showTriageModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Symptom Checker</Text>
            
            {currentStep === 0 && (
              <View>
                <Text style={styles.modalText}>What is your main symptom today?</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., headache, fever, cough..."
                  onChangeText={(text) => setSymptoms([text])}
                />
                <TouchableOpacity style={styles.modalButton} onPress={() => handleTriageStep(symptoms[0])}>
                  <Text style={styles.modalButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {currentStep === 1 && (
              <View>
                <Text style={styles.modalText}>How long have you had these symptoms?</Text>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep("Less than 24 hours")}>
                  <Text style={styles.optionButtonText}>Less than 24 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep("1-3 days")}>
                  <Text style={styles.optionButtonText}>1-3 days</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep("More than 3 days")}>
                  <Text style={styles.optionButtonText}>More than 3 days</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {currentStep === 2 && (
              <View>
                <Text style={styles.modalText}>How severe is your discomfort?</Text>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep("Mild - can do normal activities")}>
                  <Text style={styles.optionButtonText}>Mild</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep("Moderate - interferes with activities")}>
                  <Text style={styles.optionButtonText}>Moderate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep("Severe - cannot do normal activities")}>
                  <Text style={styles.optionButtonText}>Severe</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTriageModal(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Appointment Modal */}
      <Modal visible={showAppointmentModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book Appointment</Text>
            
            {currentStep === 0 && (
              <View>
                <Text style={styles.modalText}>Your Information</Text>
                <TextInput style={styles.modalInput} placeholder="Full Name" onChangeText={(text) => setPatientData(prev => ({...prev, name: text}))} />
                <TextInput style={styles.modalInput} placeholder="Age" keyboardType="numeric" onChangeText={(text) => setPatientData(prev => ({...prev, age: text}))} />
                <TextInput style={styles.modalInput} placeholder="Contact Number" keyboardType="phone-pad" onChangeText={(text) => setPatientData(prev => ({...prev, contact: text}))} />
                <TouchableOpacity style={styles.modalButton} onPress={() => handleAppointmentStep(patientData)}>
                  <Text style={styles.modalButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {currentStep === 1 && (
              <View>
                <Text style={styles.modalText}>Appointment Details</Text>
                <Text style={styles.modalLabel}>Select Department:</Text>
                <ScrollView style={styles.departmentList}>
                  {departments.map(dept => (
                    <TouchableOpacity key={dept} style={styles.optionButton} onPress={() => setAppointmentData(prev => ({...prev, department: dept}))}>
                      <Text style={styles.optionButtonText}>{dept}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.modalButton} onPress={() => handleAppointmentStep({...appointmentData, preferredDate: 'Tomorrow', preferredTime: '10:00 AM'})}>
                  <Text style={styles.modalButtonText}>Book Appointment</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowAppointmentModal(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="warning-outline" size={14} color="#666" />
        <Text style={styles.disclaimerText}>
          For informational purposes only. Always consult a healthcare professional for medical advice.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ChatBot;