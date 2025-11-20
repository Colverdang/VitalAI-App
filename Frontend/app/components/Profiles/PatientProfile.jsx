import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  StyleSheet,
  Modal,
  Platform,
  RefreshControl,
  Animated,
  KeyboardAvoidingView,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { styles } from '../styles/Profile';

const API_BASE = 'http://localhost:8000';

// Configure layout animation for smoother transitions
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const Profile = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    medical: true,
    settings: true,
    actions: true,
  });

  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    gender: '',
    bloodType: '',
    contact: '',
    email: '',
    emergencyContactName: '',
    emergencyContactSurname: '',
    emergencyContactNumber: '',
    allergies: '',
    medications: '',
    conditions: '',
  });

  const [originalProfileData, setOriginalProfileData] = useState({});

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    dataSharing: false,
    emergencyAlerts: true,
    biometricAuth: false,
  });

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: '1',
      date: '2024-01-15',
      type: 'Checkup',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Routine physical examination',
      notes: 'Patient in good health. Recommended annual follow-up.',
    },
    {
      id: '2',
      date: '2023-11-20',
      type: 'Consultation',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Seasonal allergies',
      notes: 'Prescribed antihistamines. Follow up if symptoms persist.',
    },
  ]);

  // Animation values for each section
  const rotateAnim = {
    personal: useRef(new Animated.Value(0)).current,
    medical: useRef(new Animated.Value(0)).current,
    settings: useRef(new Animated.Value(0)).current,
    actions: useRef(new Animated.Value(0)).current,
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Initialize profile data
  useEffect(() => {
    if (user) {
      // Parse existing emergency contact if it's in a combined format
      const emergencyContact = user.emergencyContact || '';
      let emergencyContactName = '';
      let emergencyContactSurname = '';
      let emergencyContactNumber = '';

      if (emergencyContact) {
        // Try to parse "Name Surname - Number" format
        const parts = emergencyContact.split(' - ');
        if (parts.length === 2) {
          const nameParts = parts[0].split(' ');
          if (nameParts.length >= 2) {
            emergencyContactName = nameParts[0];
            emergencyContactSurname = nameParts.slice(1).join(' ');
          } else {
            emergencyContactName = parts[0];
          }
          emergencyContactNumber = parts[1];
        } else {
          // If no clear format, put everything in name
          emergencyContactName = emergencyContact;
        }
      }

      const initialData = {
        name: user.fullName || '',
        age: calculateAge(user.dateOfBirth),
        gender: user.gender || '',
        bloodType: user.bloodType || 'Not specified',
        contact: user.phone || '',
        email: user.email || '',
        emergencyContactName: emergencyContactName,
        emergencyContactSurname: emergencyContactSurname,
        emergencyContactNumber: emergencyContactNumber,
        allergies: user.allergies || user.medicalHistory?.allergies || 'None reported',
        medications: user.medications || user.medicalHistory?.medications || 'None reported',
        conditions: user.conditions || user.medicalHistory?.conditions || 'None reported',
      };
      
      setProfileData(initialData);
      setOriginalProfileData(initialData);
    }
  }, [user]);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));

    // Animate the chevron icon
    Animated.timing(rotateAnim[section], {
      toValue: expandedSections[section] ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const getRotateStyle = (section) => {
    return {
      transform: [{
        rotate: rotateAnim[section].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      }],
    };
  };

  const hasChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalProfileData);
  };

  const validateProfileData = () => {
    const errors = [];

    if (!profileData.name.trim()) {
      errors.push('Please enter your name');
    }
    
    if (profileData.age && (isNaN(profileData.age) || parseInt(profileData.age) <= 0 || parseInt(profileData.age) > 120)) {
      errors.push('Please enter a valid age (1-120)');
    }

    if (profileData.contact && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.contact.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }

    // Emergency contact validation
    if (profileData.emergencyContactName && !profileData.emergencyContactNumber) {
      errors.push('Please enter emergency contact number if name is provided');
    }

    if (profileData.emergencyContactNumber && !profileData.emergencyContactName) {
      errors.push('Please enter emergency contact name if number is provided');
    }

    if (profileData.emergencyContactNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.emergencyContactNumber.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid emergency contact number');
    }

    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return false;
    }
    
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileData()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update original data and user
      setOriginalProfileData(profileData);
      if (onUpdateUser) {
        const updatedUser = {
          ...user,
          fullName: profileData.name,
          phone: profileData.contact,
          emergencyContact: profileData.emergencyContactName && profileData.emergencyContactNumber 
            ? `${profileData.emergencyContactName} ${profileData.emergencyContactSurname || ''} - ${profileData.emergencyContactNumber}`.trim()
            : '',
        };
        onUpdateUser(updatedUser);
      }
      
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (hasChanges()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setProfileData(originalProfileData);
              setIsEditing(false);
            }
          },
        ]
      );
    } else {
      setIsEditing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    if (setting === 'emergencyAlerts' && !settings[setting]) {
      Alert.alert(
        'Emergency Alerts Enabled',
        'You will now receive critical health alerts and emergency notifications.'
      );
    }
  };

  const handleRemoveMedicalInfo = (field, title) => {
    Alert.alert(
      `Remove ${title}`,
      `Are you sure you want to clear your ${title.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileData(prev => ({
              ...prev,
              [field]: 'None reported'
            }));
          },
        },
      ]
    );
  };

  const handleRemoveEmergencyContact = () => {
    Alert.alert(
      'Remove Emergency Contact',
      'Are you sure you want to remove the emergency contact information?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileData(prev => ({
              ...prev,
              emergencyContactName: '',
              emergencyContactSurname: '',
              emergencyContactNumber: ''
            }));
          },
        },
      ]
    );
  };

  const handleExportMedicalData = async (format) => {
    setIsLoading(true);
    setShowExportOptions(false);
    
    try {
      const medicalData = {
        patientInfo: {
          ...profileData,
          emergencyContact: profileData.emergencyContactName && profileData.emergencyContactNumber 
            ? `${profileData.emergencyContactName} ${profileData.emergencyContactSurname || ''} - ${profileData.emergencyContactNumber}`.trim()
            : 'Not specified',
          exportDate: new Date().toLocaleDateString(),
        },
        settings: settings,
        medicalHistory: medicalRecords,
        generatedAt: new Date().toISOString(),
      };
      
      let dataString, fileName, mimeType;

      if (format === 'json') {
        dataString = JSON.stringify(medicalData, null, 2);
        fileName = `VitalAi_Medical_Data_${new Date().getTime()}.json`;
        mimeType = 'application/json';
      } else if (format === 'pdf') {
        // Simple text representation for PDF simulation
        dataString = `VitalAi Medical Report\nGenerated: ${new Date().toLocaleDateString()}\n\n` +
          `Patient: ${profileData.name}\nAge: ${profileData.age}\nGender: ${profileData.gender}\n\n` +
          `Allergies: ${profileData.allergies}\nMedications: ${profileData.medications}\nConditions: ${profileData.conditions}\n\n` +
          `Emergency Contact: ${medicalData.patientInfo.emergencyContact}`;
        fileName = `VitalAi_Medical_Report_${new Date().getTime()}.txt`;
        mimeType = 'text/plain';
      }
      
      if (Platform.OS === 'web') {
        const blob = new Blob([dataString], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, dataString);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType,
            dialogTitle: 'Share Medical Data',
          });
        } else {
          Alert.alert('Export Complete', `File saved: ${fileName}`);
        }
      }
      
      Alert.alert('Success', `Medical data exported as ${format.toUpperCase()}`);
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export medical data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Ensure any pending changes are cleared
            setIsLoading(false);
            setIsEditing(false);
            // Call the logout function passed from parent
            if (onLogout) {
              onLogout();
            }
          },
        },
      ]
    );
  };

  const MedicalInfoCard = ({ title, value, icon, field, showRemoveButton = false }) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name={icon} size={20} color="#007AFF" />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {showRemoveButton && isEditing && value && value !== 'None reported' && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveMedicalInfo(field, title)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>
      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={value}
          onChangeText={(text) => setProfileData(prev => ({...prev, [field]: text}))}
          placeholder={`Enter ${title.toLowerCase()}...`}
          multiline
          numberOfLines={2}
        />
      ) : (
        <Text style={styles.cardValue}>{value}</Text>
      )}
    </View>
  );

  const EmergencyContactCard = () => {
    const hasEmergencyContact = profileData.emergencyContactName || profileData.emergencyContactNumber;
    
    return (
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={styles.cardTitle}>Emergency Contact</Text>
          </View>
          {isEditing && hasEmergencyContact && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemoveEmergencyContact}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
        
        {isEditing ? (
          <View style={styles.emergencyContactForm}>
            <View style={styles.emergencyContactRow}>
              <TextInput
                style={[styles.editInputSmall, styles.emergencyContactInput]}
                value={profileData.emergencyContactName}
                onChangeText={(text) => setProfileData(prev => ({...prev, emergencyContactName: text}))}
                placeholder="First Name"
              />
              <TextInput
                style={[styles.editInputSmall, styles.emergencyContactInput]}
                value={profileData.emergencyContactSurname}
                onChangeText={(text) => setProfileData(prev => ({...prev, emergencyContactSurname: text}))}
                placeholder="Last Name"
              />
            </View>
            <TextInput
              style={styles.editInputSmall}
              value={profileData.emergencyContactNumber}
              onChangeText={(text) => setProfileData(prev => ({...prev, emergencyContactNumber: text}))}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>
        ) : (
          <View>
            {hasEmergencyContact ? (
              <View>
                <Text style={styles.cardValue}>
                  {profileData.emergencyContactName} {profileData.emergencyContactSurname}
                </Text>
                <Text style={styles.emergencyContactNumber}>
                  {profileData.emergencyContactNumber}
                </Text>
              </View>
            ) : (
              <Text style={styles.cardValue}>No emergency contact specified</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const SettingItem = ({ title, subtitle, value, onValueChange, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color="#666" style={styles.settingIcon} />
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

  const MedicalRecordItem = ({ record }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>
          {new Date(record.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <View style={[
          styles.recordTypeBadge,
          record.type === 'Emergency' && styles.emergencyBadge
        ]}>
          <Text style={styles.recordTypeText}>{record.type}</Text>
        </View>
      </View>
      <Text style={styles.recordDoctor}>👨‍⚕️ {record.doctor}</Text>
      <Text style={styles.recordDiagnosis}>{record.diagnosis}</Text>
      {record.notes && (
        <Text style={styles.recordNotes}>{record.notes}</Text>
      )}
    </View>
  );

  const SectionHeader = ({ title, icon, section }) => (
    <TouchableOpacity 
      style={[styles.sectionHeader, expandedSections[section] && styles.sectionHeaderActive]}
      onPress={() => toggleSection(section)}
      activeOpacity={0.7}
    >
      <View style={styles.sectionHeaderLeft}>
        <Ionicons name={icon} size={20} color={expandedSections[section] ? "#007AFF" : "#666"} />
        <Text style={[styles.sectionHeaderText, expandedSections[section] && styles.sectionHeaderTextActive]}>
          {title}
        </Text>
      </View>
      <Animated.View style={getRotateStyle(section)}>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <Ionicons name="medical" size={40} color="#007AFF" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.avatarEditButton}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.editInputLarge}
                value={profileData.name}
                onChangeText={(text) => setProfileData(prev => ({...prev, name: text}))}
                placeholder="Enter your name"
                autoFocus
              />
            ) : (
              <Text style={styles.name}>{profileData.name || 'Loading...'}</Text>
            )}
            <Text style={styles.memberId}>
              {user?.idNumber ? `ID: ${user.idNumber}` : 'ID: VAM2024001'}
            </Text>
            <Text style={styles.email}>{profileData.email}</Text>
          </View>
          <View style={styles.headerActions}>
            {isEditing ? (
              <View style={styles.editActions}>
                <TouchableOpacity 
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                  disabled={isLoading}
                >
                  <Ionicons name="close" size={20} color="#FF3B30" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                  disabled={isLoading || !hasChanges()}
                >
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
                disabled={isLoading}
              >
                <Ionicons name="pencil" size={20} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Personal Information"
            icon="person-outline"
            section="personal"
          />
          {expandedSections.personal && (
            <View style={styles.sectionContent}>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Age</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInputSmall}
                      value={profileData.age}
                      keyboardType="numeric"
                      onChangeText={(text) => setProfileData(prev => ({...prev, age: text}))}
                      placeholder="Age"
                    />
                  ) : (
                    <Text style={styles.infoValue}>
                      {profileData.age ? `${profileData.age} years` : 'Not specified'}
                    </Text>
                  )}
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInputSmall}
                      value={profileData.gender}
                      onChangeText={(text) => setProfileData(prev => ({...prev, gender: text}))}
                      placeholder="Gender"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{profileData.gender || 'Not specified'}</Text>
                  )}
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Blood Type</Text>
                  <Text style={styles.infoValue}>{profileData.bloodType}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Contact</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInputSmall}
                      value={profileData.contact}
                      onChangeText={(text) => setProfileData(prev => ({...prev, contact: text}))}
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{profileData.contact || 'Not specified'}</Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Medical Information Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Medical Information"
            icon="medical-outline"
            section="medical"
          />
          {expandedSections.medical && (
            <View style={styles.sectionContent}>
              <MedicalInfoCard
                title="Allergies"
                value={profileData.allergies}
                icon="warning-outline"
                field="allergies"
                showRemoveButton={true}
              />
              <MedicalInfoCard
                title="Current Medications"
                value={profileData.medications}
                icon="medical-outline"
                field="medications"
                showRemoveButton={true}
              />
              <MedicalInfoCard
                title="Medical Conditions"
                value={profileData.conditions}
                icon="heart-outline"
                field="conditions"
                showRemoveButton={true}
              />
              <EmergencyContactCard />
            </View>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Preferences"
            icon="settings-outline"
            section="settings"
          />
          {expandedSections.settings && (
            <View style={styles.sectionContent}>
              <SettingItem
                title="Push Notifications"
                subtitle="Receive appointment reminders and health updates"
                value={settings.notifications}
                onValueChange={() => toggleSetting('notifications')}
                icon="notifications-outline"
              />
              <SettingItem
                title="Emergency Alerts"
                subtitle="Critical health alerts and emergency notifications"
                value={settings.emergencyAlerts}
                onValueChange={() => toggleSetting('emergencyAlerts')}
                icon="warning-outline"
              />
              <SettingItem
                title="Data Sharing"
                subtitle="Help improve VitalAi (anonymous data only)"
                value={settings.dataSharing}
                onValueChange={() => toggleSetting('dataSharing')}
                icon="share-social-outline"
              />
              <SettingItem
                title="Biometric Authentication"
                subtitle="Use fingerprint or face ID to access your data"
                value={settings.biometricAuth}
                onValueChange={() => toggleSetting('biometricAuth')}
                icon="finger-print-outline"
              />
            </View>
          )}
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Actions"
            icon="flash-outline"
            section="actions"
          />
          {expandedSections.actions && (
            <View style={styles.sectionContent}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowExportOptions(true)}
                disabled={isLoading}
              >
                <View style={styles.actionButtonContent}>
                  <Ionicons name="download-outline" size={22} color="#666" />
                  <Text style={styles.actionButtonText}>Export Medical Data</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowMedicalRecords(true)}
                disabled={isLoading}
              >
                <View style={styles.actionButtonContent}>
                  <Ionicons name="document-text-outline" size={22} color="#666" />
                  <Text style={styles.actionButtonText}>View Medical Records</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.dangerButton]}
                onPress={handleSignOut}
                disabled={isLoading}
              >
                <View style={styles.actionButtonContent}>
                  <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                  <Text style={[styles.actionButtonText, styles.dangerText]}>Sign Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Export Options Modal */}
        <Modal
          visible={showExportOptions}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowExportOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.exportModal}>
              <Text style={styles.modalTitle}>Export Medical Data</Text>
              <Text style={styles.modalSubtitle}>Choose your preferred format:</Text>
              
              <TouchableOpacity 
                style={styles.exportOption}
                onPress={() => handleExportMedicalData('json')}
              >
                <View style={[styles.exportOptionIcon, { backgroundColor: '#E8F4FF' }]}>
                  <Ionicons name="code-slash" size={24} color="#007AFF" />
                </View>
                <View style={styles.exportOptionText}>
                  <Text style={styles.exportOptionTitle}>JSON Format</Text>
                  <Text style={styles.exportOptionSubtitle}>Structured data for developers and applications</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.exportOption}
                onPress={() => handleExportMedicalData('pdf')}
              >
                <View style={[styles.exportOptionIcon, { backgroundColor: '#FFE8E6' }]}>
                  <Ionicons name="document-text" size={24} color="#FF3B30" />
                </View>
                <View style={styles.exportOptionText}>
                  <Text style={styles.exportOptionTitle}>Text Document</Text>
                  <Text style={styles.exportOptionSubtitle}>Readable format for healthcare providers</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelExportButton}
                onPress={() => setShowExportOptions(false)}
              >
                <Text style={styles.cancelExportText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Medical Records Modal */}
        <Modal
          visible={showMedicalRecords}
          animationType="slide"
          onRequestClose={() => setShowMedicalRecords(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medical Records</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowMedicalRecords(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.recordsList}>
              {medicalRecords.map(record => (
                <MedicalRecordItem key={record.id} record={record} />
              ))}
              {medicalRecords.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyStateText}>No medical records found</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Your medical visits and records will appear here
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;