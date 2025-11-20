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
  Alert,
  Linking,
} from 'react-native';
import { styles } from './styles/ChatBot';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

// ChatBot Component - Pure chat functionality only
const ChatBot = ({ user, isDemoMode, onLogout, onLoginRequired }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize chat with welcome message
  useEffect(() => {
    const initializeChat = () => {
      setMessages([
        {
          id: '1',
          text: isDemoMode 
            ? "🔬 **Demo Mode Activated**\n\nYou are now viewing VitalAi in demonstration mode with sample patient data. All information shown is fictional and for demonstration purposes only."
            : "👋 Hello! I'm VitalAi, your medical assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
          type: 'welcome'
        },
      ]);
    };

    initializeChat();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [isDemoMode]);

  // AI Response System
  const getAIResponse = async (userMessage) => {
    try {
      setIsTyping(true);

      const response = await axios.post('https://vitalai-chatbot-backend-production.up.railway.app/predict', {
        text: userMessage.trim()
      });

      const aiText = response.data.predicted_severity;
      
      // Basic department/severity detection
      let department = 'General Medicine';
      let severity = 'routine';
      const msg = userMessage.toLowerCase();

      if (msg.includes('heart') || msg.includes('chest')) department = 'Cardiology';
      if (msg.includes('head') || msg.includes('migraine')) department = 'Neurology';
      if (msg.includes('stomach') || msg.includes('abdominal')) department = 'Gastroenterology';
      if (msg.includes('child') || msg.includes('baby')) department = 'Pediatrics';
      if (msg.includes('severe') || msg.includes('unconscious')) severity = 'critical';

      if (severity === 'critical') handleEmergency();

      let replyText = "";
      switch (aiText) {
        case "LOW":
          replyText = "🟢 Your condition appears to be LOW severity. It's likely mild — monitor your symptoms and rest. Consult a doctor if it persists or you're unsure.";
          break;
        case "MEDIUM":
          replyText = "🟡 This condition may be of MODERATE concern. You should monitor symptoms and consult a doctor.";
          break;
        case "HIGH":
          replyText = "🟠⚠️ Your symptoms suggest a HIGH severity condition. Please seek medical advice as soon as possible.";
          break;
        case "CRITICAL":
          replyText = "🔴⚠️ CRITICAL severity detected. Please seek IMMEDIATE medical attention.";
          break;
        default:
          replyText = "I couldn't determine severity confidently. Please contact a medical professional.";
      }

      // Add demo mode indicator if applicable
      if (isDemoMode) {
        replyText += "\n\n*💡 Demo Mode: This is a sample AI response*";
      }

      return {
        id: Date.now().toString(),
        text: replyText,
        isUser: false,
        timestamp: new Date(),
        type: severity === 'critical' ? 'emergency' : 'medical_advice',
        department,
        severity
      };

    } catch (error) {
      console.error('AI Response Error:', error);

      return {
        id: Date.now().toString(),
        text: `Thinking...\n\nI couldn't process your request. Please try again.${isDemoMode ? '\n\n*💡 Demo Mode: Simulating AI service error*' : ''}`,
        isUser: false,
        timestamp: new Date(),
        type: 'general',
        department: 'General Medicine',
        severity: 'routine'
      };
    } finally {
      setIsTyping(false);
    }
  };

  // Send Message Function
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

    const botResponse = await getAIResponse(inputText);
    if (botResponse) {
      setMessages(prev => [...prev, botResponse]);
    }
  };

  // Handle Emergency Function
  const handleEmergency = () => {
    Alert.alert(
      'Medical Emergency',
      'Please seek immediate medical attention. Call emergency services if this is a life-threatening situation.',
      [
        {
          text: 'Call Emergency',
          onPress: () => Linking.openURL('tel:10111'),
          style: 'destructive'
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]
    );
  };

  // Start Symptom Triage Function
  const startSymptomTriage = () => {
    if (!user && !isDemoMode) {
      onLoginRequired?.();
      return;
    }
    setShowTriageModal(true);
    setCurrentStep(0);
    setSymptoms([]);
    setCurrentSymptom('');
  };

  // Handle Triage Step Function
  const handleTriageStep = async (symptom) => {
    const newSymptoms = [...symptoms, symptom];
    setSymptoms(newSymptoms);
    
    if (currentStep === 0) {
      const userMessage = {
        id: Date.now().toString(),
        text: `Symptom: ${symptom}`,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      const botResponse = await getAIResponse(`I have this symptom: ${symptom}`);
      if (botResponse) {
        setMessages(prev => [...prev, botResponse]);
      }
    }
    
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      const finalSymptom = `Duration: ${symptoms[1]}, Severity: ${symptom}`;
      const userMessage = {
        id: Date.now().toString(),
        text: `Complete symptoms: ${symptoms[0]}, ${finalSymptom}`,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      const botResponse = await getAIResponse(
        `Complete symptom assessment: Main symptom: ${symptoms[0]}, Duration: ${symptoms[1]}, Severity: ${symptom}`,
        symptoms
      );
      if (botResponse) {
        setMessages(prev => [...prev, botResponse]);
      }
      
      setShowTriageModal(false);
      setCurrentStep(0);
      setSymptoms([]);
    }
  };

  // Enhanced Message Renderer
  const renderMessage = ({ item }) => {
    const timestamp = item.timestamp ? new Date(item.timestamp) : new Date();
    
    return (
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
            {item.isUser ? (user?.fullName || 'You') : 'VitalAi'}
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
        {isDemoMode && !item.isUser && (
          <View style={styles.demoTag}>
            <Ionicons name="beaker" size={12} color="#FF9500" />
            <Text style={styles.demoTagText}>Demo Response</Text>
          </View>
        )}
        <Text style={styles.timestamp}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Animated.View>
    );
  };

  // Quick Actions Component
  const QuickActions = () => {
    return (
      <Animated.View style={[styles.quickActions, { opacity: fadeAnim }]}>
        <View style={styles.quickActionsHeader}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          {isDemoMode && (
            <View style={styles.demoBadge}>
              <Ionicons name="beaker" size={12} color="#FFF" />
              <Text style={styles.demoBadgeText}>DEMO MODE</Text>
            </View>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
          <TouchableOpacity style={styles.quickAction} onPress={startSymptomTriage}>
            <Ionicons name="heart-outline" size={20} color="#007AFF" />
            <Text style={styles.quickActionText}>Symptom Check</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('Info', 'Appointment booking would open here')}>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.quickActionText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('Info', 'Language selector would open here')}>
            <Ionicons name="language-outline" size={20} color="#007AFF" />
            <Text style={styles.quickActionText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickAction, styles.emergencyQuickAction]} 
            onPress={handleEmergency}
          >
            <Ionicons name="warning-outline" size={20} color="#FF3B30" />
            <Text style={[styles.quickActionText, styles.emergencyQuickActionText]}>
              Emergency
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      

      {/* Main Chat Content */}
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
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
                <Text style={styles.typingText}>
                  Thinking...{isDemoMode ? ' (Demo Mode)' : ''}
                </Text>
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
            placeholder={isDemoMode ? "Try: 'I have chest pain' or 'Headache for 2 days'..." : "Describe your symptoms or ask a question..."}
            placeholderTextColor="#999"
            multiline
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Triage Modal */}
      <Modal 
        visible={showTriageModal} 
        animationType="slide" 
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent, 
            width > 768 && styles.modalContentLarge
          ]}>
            <Text style={styles.modalTitle}>Symptom Checker</Text>
            
            {currentStep === 0 && (
              <View>
                <Text style={styles.modalText}>What is your main symptom?</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., headache, fever, cough..."
                  value={currentSymptom}
                  onChangeText={(text) => setCurrentSymptom(text)}
                />
                <TouchableOpacity 
                  style={[styles.modalButton, !currentSymptom && styles.modalButtonDisabled]} 
                  onPress={() => handleTriageStep(currentSymptom)}
                  disabled={!currentSymptom}
                >
                  <Text style={styles.modalButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {currentStep === 1 && (
              <View>
                <Text style={styles.modalText}>How long have you had this symptom?</Text>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep('Less than 24 hours')}>
                  <Text style={styles.optionButtonText}>Less than 24 hours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep('1-3 days')}>
                  <Text style={styles.optionButtonText}>1-3 days</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep('More than 3 days')}>
                  <Text style={styles.optionButtonText}>More than 3 days</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {currentStep === 2 && (
              <View>
                <Text style={styles.modalText}>How severe is your symptom?</Text>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep('Mild')}>
                  <Text style={styles.optionButtonText}>Mild</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep('Moderate')}>
                  <Text style={styles.optionButtonText}>Moderate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => handleTriageStep('Severe')}>
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
    </SafeAreaView>
  );
};

export default ChatBot;