// app/components/Main.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect import
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import all components
import ChatBot from './components/ChatBot';
import Appointments from './components/Appointments';
import History from './components/History';
import Profile from './components/Profiles/ProfileSelector';
import Auth from './components/Auth';
import LanguageSelector from './components/LanguageSelector';

// Import demo data creators
import { createDemoUser, createDemoAppointments, createDemoChatHistory } from './ChatBotData';

const Main = ({ backendStatus, connectionResults }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [user, setUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Auto-activate demo mode if backend is completely down
  useEffect(() => {
    if (backendStatus === 'failed' && !user && !isDemoMode) {
      console.log('🔄 Auto-activating demo mode due to backend failure');
      activateDemoMode();
    }
  }, [backendStatus, user, isDemoMode]);

  // Demo mode activation
  const activateDemoMode = () => {
    const demoUser = createDemoUser();
    setUser(demoUser);
    setIsDemoMode(true);
    setActiveTab('chat');
    
    Alert.alert(
      'Demo Mode Activated',
      'You are now viewing VitalAi in demonstration mode with sample patient data.',
      [{ text: 'Got It', style: 'default' }]
    );
  };

  // Login handler
  const handleLogin = (userData) => {
    setUser(userData);
    setIsDemoMode(false);
    setShowAuthModal(false);
    Alert.alert('Welcome Back', `Good to see you, ${userData.fullName}!`);
  };

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      isDemoMode ? 'Exit Demo Mode' : 'Logout',
      isDemoMode ? 'Exit demonstration mode?' : 'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isDemoMode ? 'Exit Demo' : 'Logout',
          style: 'destructive',
          onPress: () => {
            setUser(null);
            setIsDemoMode(false);
            setActiveTab('chat');
          },
        },
      ]
    );
  };

  // Navigation Bar
  const NavBar = () => (
    <View style={styles.navBar}>
      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'chat' && styles.navItemActive]}
        onPress={() => setActiveTab('chat')}
      >
        <Ionicons 
          name="chatbubble-ellipses-outline" 
          size={24} 
          color={activeTab === 'chat' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeTab === 'chat' && styles.navTextActive]}>
          Chat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'appointments' && styles.navItemActive]}
        onPress={() => setActiveTab('appointments')}
      >
        <Ionicons 
          name="calendar-outline" 
          size={24} 
          color={activeTab === 'appointments' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeTab === 'appointments' && styles.navTextActive]}>
          Appointments
        </Text>
        {isDemoMode && <View style={styles.demoDot} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'history' && styles.navItemActive]}
        onPress={() => setActiveTab('history')}
      >
        <Ionicons 
          name="time-outline" 
          size={24} 
          color={activeTab === 'history' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeTab === 'history' && styles.navTextActive]}>
          History
        </Text>
        {isDemoMode && <View style={styles.demoDot} />}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]}
        onPress={() => user ? setActiveTab('profile') : setShowAuthModal(true)}
      >
        <Ionicons 
          name={user ? "person-outline" : "log-in-outline"} 
          size={24} 
          color={activeTab === 'profile' ? '#007AFF' : '#666'} 
        />
        <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>
          {user ? 'Profile' : 'Login'}
        </Text>
        {isDemoMode && <View style={styles.demoDot} />}
      </TouchableOpacity>
    </View>
  );

  // Main Header
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logo}>
          <Ionicons name="medical" size={28} color="#007AFF" />
        </View>
        <View>
          <Text style={styles.headerTitle}>
            VitalAi {isDemoMode && '(Demo)'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isDemoMode ? 'Sample Patient Data - Demonstration Only' : 'Medical Assistant'}
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        {isDemoMode && (
          <View style={styles.demoIndicator}>
            <Ionicons name="beaker" size={16} color="#FF9500" />
            <Text style={styles.demoIndicatorText}>Demo</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Ionicons name="language" size={24} color="#666" />
        </TouchableOpacity>
        {(user || isDemoMode) && (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Login Required Component
  const LoginRequired = ({ title, message, onLogin, onDemo }) => (
    <View style={styles.loginRequired}>
      <Ionicons name="log-in" size={64} color="#CCC" />
      <Text style={styles.loginRequiredTitle}>{title}</Text>
      <Text style={styles.loginRequiredText}>{message}</Text>
      
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.demoButton} onPress={onDemo}>
        <Ionicons name="beaker-outline" size={20} color="#FF9500" />
        <Text style={styles.demoButtonText}>Try Demo Mode</Text>
      </TouchableOpacity>
    </View>
  );

  // Render active tab content
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatBot 
            user={user}
            isDemoMode={isDemoMode}
            onLogout={handleLogout}
            onLoginRequired={() => setShowAuthModal(true)}
          />
        );
      case 'appointments':
        return user || isDemoMode ? (
          <Appointments 
            user={isDemoMode ? createDemoUser() : user} 
            isDemoMode={isDemoMode}
            demoAppointments={createDemoAppointments()}
            onLoginRequired={() => setShowAuthModal(true)}
          />
        ) : (
          <LoginRequired 
            title="Appointments"
            message="Please login to view your appointments"
            onLogin={() => setShowAuthModal(true)}
            onDemo={activateDemoMode}
          />
        );
      case 'history':
        return user || isDemoMode ? (
          <History 
            messages={isDemoMode ? createDemoChatHistory() : []} 
            user={isDemoMode ? createDemoUser() : user}
            isDemoMode={isDemoMode}
          />
        ) : (
          <LoginRequired 
            title="Chat History"
            message="Please login to view your chat history"
            onLogin={() => setShowAuthModal(true)}
            onDemo={activateDemoMode}
          />
        );
      case 'profile':
        return user || isDemoMode ? (
          <Profile 
            user={isDemoMode ? createDemoUser() : user} 
            onLogout={handleLogout}
            isDemoMode={isDemoMode}
          />
        ) : (
          <LoginRequired 
            title="Profile"
            message="Please login to view your profile"
            onLogin={() => setShowAuthModal(true)}
            onDemo={activateDemoMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {renderActiveTab()}
      </View>
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
        onLanguageSelect={(lang) => {
          setShowLanguageModal(false);
          Alert.alert('Language Set', `Language changed to ${lang.name}`);
        }}
        currentLanguage="en"
      />
    </View>
  );
};

// Styles for Main component
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  demoIndicatorText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#F8F9FF',
  },
  navText: {
    fontSize: 10,
    marginTop: 2,
    color: '#666',
  },
  navTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  demoDot: {
    position: 'absolute',
    top: 4,
    right: 20,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9500',
  },
  loginRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginRequiredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  loginRequiredText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  demoButtonText: {
    color: '#FF9500',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default Main;