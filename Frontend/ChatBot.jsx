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
} from 'react-native';
import { styles } from './ChatBot';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Appointments from '../Appointments';
import History from '../History';
import Profile from '../Profile';
import Auth from '../Auth';
import LanguageSelector from '../LanguageSelector';
// LoginRequired is defined within this component
import axios from 'axios';


const { width, height } = Dimensions.get('window');

// Main ChatBot Component
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeNav, setActiveNav] = useState('chat');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [user, setUser] = useState(null);
  
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

  // Language-specific content
  const languageContent = {
    en: {
      welcome: "👋 Hello! I'm VitalAi, your medical assistant. I can help you with:\n\n• 🤒 Symptom checking and triage\n• 📅 Appointment booking\n• ❓ General hospital information\n• 🏥 Department referrals\n\nHow can I assist you today? Please remember I'm an AI assistant and not a substitute for professional medical advice.",
      quickActions: "Quick Actions",
      symptomCheck: "Symptom Check",
      bookAppointment: "Book Appointment",
      emergency: "Emergency",
      placeholder: "Start chat",
      typing: "VitalAi is analyzing your symptoms...",
    },
    af: {
      welcome: "👋 Hallo! Ek is VitalAi, jou mediese assistent. Ek kan help met:\n\n• 🤒 Simptoom nagaan en triage\n• 📅 Afspraak bespreking\n• ❓ Algemene hospitaal inligting\n• 🏥 Departement verwysings\n\nHoe kan ek jou vandag help? Onthou asseblief ek is 'n AI assistent en nie 'n plaasvervanger vir professionele mediese advies nie.",
      quickActions: "Vinnige Aksies",
      symptomCheck: "Simptoom Nagaan",
      bookAppointment: "Maak Afspraak",
      emergency: "Noodgeval",
      placeholder: "Beskryf jou simptome of vra 'n vraag...",
      typing: "VitalAi ontleed jou simptome...",
    },
    zu: {
      welcome: "👋 Sawubona! Ngingu-VitalAi, umsizi wakho wezempilo. Ngingakusiza nge:\n\n• 🤒 Ukuhlola izimpawu kanye nokuhlela\n• 📅 Ukubhuka izikhathi zokuhlangana\n• ❓ Ulwazi lwesibhedlela jikelele\n• 🏥 Izinkomba zomnyango\n\nNgingakusiza kanjani namuhla? Ngicela ukhumbule ukuthi ngingumsizi we-AI hhayi indlela yokushintsha iseluleko somuntu osemthethweni sezempilo.",
      quickActions: "Izenzo Ezisheshayo",
      symptomCheck: "Hlola Izimpawu",
      bookAppointment: "Bhuka Isikhathi",
      emergency: "Isimo Esiphuthumayo",
      placeholder: "Chaza izimpawu zakho noma buza umbuzo...",
      typing: "U-VitalAi uhlaziya izimpawu zakho...",
    },
    xh: {
      welcome: "👋 Molo! Ndingu-VitalAi, umncedi wakho wezempilo. Ndinokuncedisa nge:\n\n• 🤒 Uvavanyo lweempawu kunye nokulandelelana\n• 📅 Ukucwangcisa ixesha lomhlanganyelo\n• ❓ Ulwazi lweshospitali jikelele\n• 🏥 Iindlela zokudlulisela kwicandelo\n\nNdingakunceda njani namhlanje? Nceda khumbula ukuba ndingumncedi we-AI hayinto etshintsha icebiso legqirha elisemthethweni.",
      quickActions: "Izenzo Ezikhawulezileyo",
      symptomCheck: "Vavanya Iimpawu",
      bookAppointment: "Cwangcisa Ixesha",
      emergency: "Ingxaki Ekhawulezileyo",
      placeholder: "Chaza iimpawu zakho okanye buza umbuzo...",
      typing: "U-VitalAi uhlalutya iimpawu zakho...",
    }
  };

  // Medical knowledge base (same as before)
  const medicalKnowledge = {
    headache: {
      response: {
        en: "For headaches, try resting in a quiet room, staying hydrated, and considering over-the-counter pain relief if appropriate. If severe, persistent, or accompanied by other symptoms like vision changes or fever, consult a doctor immediately.",
        af: "Vir hoofpyn, probeer rus in 'n stil kamer, bly gehidreer, en oorweeg aan-toonbank pynverligting indien toepaslik. As dit ernstig, aanhoudend of vergesel van ander simptome soos visie veranderinge of koors is, raadpleeg onmiddellik 'n dokter.",
        zu: "Ngamakhanda abuhlungu, zama ukuphumula egumbini elithule, ugcine unamanzi, futhi ucabange ngezinto zokunciphisa ubuhlungu ezithengiseka ngaphandle komyalo uma kufanele. Uma kubuhlungu kakhulu, kuqhubekile, noma kuhambisane nezinye izimpawu ezifana nokushintsha kombono noma umkhuhlane, thola usizo lodokotela ngokushesha.",
        xh: "Ngeentloko ezibuhlungu, zama ukuphumla egumbini elithule, hlala unamanzi, kwaye ucinge ngeendlela zokunciphisa intlungu ezithengiswayo ngaphandle kwemiyalelo ukuba kuyafaneleka. Ukuba kubi kakhulu, kuqhubekayo, okanye kuhambisane nezinye iimpawu ezifana nokutshintsha kombono okanye umkhuhlane, bhekisela kugqirha ngokukhawuleza."
      },
      department: "General Medicine",
      severity: "moderate"
    },
    // ... other medical conditions with translations
  };

  const departments = [
    "Emergency", "General Medicine", "Pediatrics", "Surgery", 
    "Orthopedics", "Cardiology", "Neurology", "Dermatology",
    "Gastroenterology", "Respiratory", "Maternity", "Pharmacy"
  ];

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
        text: languageContent[currentLanguage].welcome,
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
  }, [currentLanguage]);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    setPatientData(prev => ({
      ...prev,
      name: userData.fullName,
      contact: userData.phone
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setUser(null);
            setActiveNav('chat');
          },
        },
      ]
    );
  };

  const handleLanguageSelect = (language) => {
    setCurrentLanguage(language.code);
    setShowLanguageModal(false);
    Alert.alert('Language Changed', `Language set to ${language.name}`);
  };

  const getMedicalResponse = async (userMessage) => {
    // setIsTyping(true);
    // await new Promise(resolve => setTimeout(resolve, 1500));
    //
    // const message = userMessage.toLowerCase();
    // let response = '';
    // let department = '';
    // let severity = 'moderate';
    //
    // // Check for emergencies first
    // for (const keyword of emergencyKeywords) {
    //   if (message.includes(keyword)) {
    //     response = languageContent[currentLanguage].emergency + ': 🚨 URGENT: This sounds like a medical emergency! Please call emergency services immediately or go to the nearest hospital. Do not delay seeking professional medical help.';
    //     department = 'Emergency';
    //     severity = 'critical';
    //
    //     const emergencyMessage = {
    //       id: Date.now().toString(),
    //       text: response,
    //       isUser: false,
    //       timestamp: new Date(),
    //       type: 'emergency',
    //       department: department,
    //       severity: severity
    //     };
    //
    //     setIsTyping(false);
    //     return emergencyMessage;
    //   }
    // }
    //
    // // Check for specific conditions
    // let foundCondition = false;
    // for (const [condition, info] of Object.entries(medicalKnowledge)) {
    //   if (message.includes(condition)) {
    //     response = info.response[currentLanguage] || info.response.en;
    //     department = info.department;
    //     severity = info.severity;
    //     foundCondition = true;
    //     break;
    //   }
    // }
    //
    // // Default responses based on language
    // if (!foundCondition) {
    //   if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
    //     response = currentLanguage === 'en' ? "I can help you book an appointment. Let me gather some information to schedule your visit." :
    //               currentLanguage === 'af' ? "Ek kan help om 'n afspraak te maak. Laat ek inligting insamel om jou besoek te beplan." :
    //               currentLanguage === 'zu' ? "Ngingakusiza ukubhuka isikhathi. Ake ngicocele ulwazi ukuhlela ukuvakasha kwakho." :
    //               "Ndinokunceda ukucwangcisa ixesha. Mandicocele ulwazi ukulungiselela ukuvakasha kwakho.";
    //     setShowAppointmentModal(true);
    //   } else {
    //     response = currentLanguage === 'en' ? "Thank you for sharing your health concern. While I can provide general health information, it's important to consult with a healthcare professional for personalized medical advice. Could you tell me more about your specific symptoms or how I can assist you?" :
    //               currentLanguage === 'af' ? "Dankie dat jy jou gesondheidsbesorgdheid gedeel het. Alhoewel ek algemene gesondheidsinligting kan verskaf, is dit belangrik om 'n gesondheidsorg professioneel te raadpleeg vir persoonlike mediese advies. Kan jy my meer vertel oor jou spesifieke simptome of hoe ek jou kan help?" :
    //               currentLanguage === 'zu' ? "Ngiyabonga ngokwabelana ngenkinga yakho yezempilo. Nakuba nginganikeza ulwazi olujwayelekile lwezempilo, kubalulekile ukuthi uthole iseluleko somuntu osemthethweni wezempilo. Ungangitshela kabanzi ngezimpawu zakho noma ukuthi ngingakusiza kanjani?" :
    //               "Enkosi ngokwabelana ngeenkxwaleko zakho zempilo. Nangona ndinokunika ulwazi olusezantsi lwezempilo, kubalulekile ukuba ufumane iseluleko somongikazi wezempilo. Ungandixelela kabanzi ngeempawu zakho okanye ukuba ndinokunceda njani?";
    //   }
    // }
    //
    // const botMessage = {
    //   id: Date.now().toString(),
    //   text: response,
    //   isUser: false,
    //   timestamp: new Date(),
    //   type: foundCondition ? 'medical_advice' : 'general',
    //   department: department,
    //   severity: severity
    // };
    //
    // setIsTyping(false);
    // return botMessage;


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

    try {
      setIsTyping(true);

      const response = await axios.post('https://vitalai-chatbot-backend-production.up.railway.app/predict', {
        text: inputText.trim()
      });

      const severity = response.data.predicted_severity;

      let replyText = "";
      switch (severity) {
        case "LOW":
          replyText =
              "🟢 Your condition appears to be LOW severity. It’s likely mild — monitor your symptoms and rest. Consult a doctor if it persists or you're unsure.";
          break;

        case "MEDIUM":
          replyText =
              "🟡 This condition may be of MODERATE concern. You should monitor symptoms and consult a doctor.";
          break;

        case "HIGH":
          replyText =
              "🟠⚠️ Your symptoms suggest a HIGH severity condition. Please seek medical advice as soon as possible.";
          break;

        case "CRITICAL":
          replyText =
              "🔴⚠️ CRITICAL severity detected. Please seek IMMEDIATE medical attention.";
          break;

        default:
          replyText =
              "I couldn’t determine severity confidently. Please contact a medical professional.";
      }


      // Response from API assumed as: { reply: "text back" }
      const botResponse = {
        id: Date.now().toString(),
        text: replyText,
        isUser: false,
        timestamp: new Date(),
        severity: response.data.severity
      };


      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.log(error);
      const errorResponse = {
        id: Date.now().toString(),
        text: "⚠️ Sorry, I'm having trouble connecting right now.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const startSymptomTriage = () => {
    setShowTriageModal(true);
    setCurrentStep(0);
    setSymptoms([]);
  };

  const startAppointmentBooking = () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login to book an appointment',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => setShowAuthModal(true) }
        ]
      );
      return;
    }
    setShowAppointmentModal(true);
    setCurrentStep(0);
  };

  // ... rest of the existing functions (handleTriageStep, analyzeSymptoms, handleAppointmentStep, etc.)

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
      <Text style={styles.quickActionsTitle}>{languageContent[currentLanguage].quickActions}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
        <TouchableOpacity style={styles.quickAction} onPress={startSymptomTriage}>
          <Ionicons name="heart-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>{languageContent[currentLanguage].symptomCheck}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={startAppointmentBooking}>
          <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>{languageContent[currentLanguage].bookAppointment}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => setShowLanguageModal(true)}>
          <Ionicons name="language-outline" size={20} color="#007AFF" />
          <Text style={styles.quickActionText}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => setInputText("Emergency help")}>
          <Ionicons name="warning-outline" size={20} color="#FF3B30" />
          <Text style={styles.quickActionText}>{languageContent[currentLanguage].emergency}</Text>
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
        onPress={() => user ? setActiveNav('profile') : setShowAuthModal(true)}
      >
        <Ionicons 
          name={user ? "person-outline" : "log-in-outline"} 
          size={24} 
          color={activeNav === 'profile' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeNav === 'profile' && styles.navTextActive]}>
          {user ? 'Profile' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const LoginRequired = ({ title, message, onLogin }) => (
    <View style={styles.loginRequired}>
      <Ionicons name="log-in" size={64} color="#CCC" />
      <Text style={styles.loginRequiredTitle}>{title}</Text>
      <Text style={styles.loginRequiredText}>{message}</Text>
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
        <Text style={styles.loginButtonText}>Login</Text>
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
          <Text style={styles.typingText}>{languageContent[currentLanguage].typing}</Text>
        </View>
      ) 
      : null
    }
  />
          

            <QuickActions />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder={languageContent[currentLanguage].placeholder}
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
        return user ? (
          <Appointments user={user} onLoginRequired={() => setShowAuthModal(true)} />
        ) : (
          <LoginRequired 
            title="Appointments"
            message="Login to view and book appointments"
            onLogin={() => setShowAuthModal(true)}
          />
        );
      case 'history':
        return user ? (
          <History messages={messages} user={user} />
        ) : (
          <LoginRequired 
            title="Chat History"
            message="Login to view your conversation history"
            onLogin={() => setShowAuthModal(true)}
          />
        );
      case 'profile':
        return user ? (
          <Profile user={user} onLogout={handleLogout} />
        ) : (
          <LoginRequired 
            title="Profile"
            message="Login to view and manage your profile"
            onLogin={() => setShowAuthModal(true)}
          />
        );
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
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Ionicons name="language" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={user ? handleLogout : () => setShowAuthModal(true)}
          >
            <Ionicons 
              name={user ? "log-out-outline" : "log-in-outline"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
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

      {/* Auth Modal */}
      <Auth 
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      {/* Language Selector Modal */}
      <LanguageSelector 
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onLanguageSelect={handleLanguageSelect}
        currentLanguage={currentLanguage}
      />

      {/* Existing Triage and Appointment Modals */}
      {/* ... */}

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

// Add these new styles to your existing ChatBot styles
const additionalStyles = {
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  loginRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loginRequiredText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default ChatBot;