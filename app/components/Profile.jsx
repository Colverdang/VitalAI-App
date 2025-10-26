import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Profile = ({ patientData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    age: '32',
    gender: 'Male',
    bloodType: 'O+',
    contact: '+27 23 456 7890',
    email: 'john.doe@example.com',
    emergencyContact: '+27 20 456 7890',
    allergies: 'Penicillin, Peanuts',
    medications: 'Lisinopril 10mg daily, Atorvastatin 20mg daily',
    conditions: 'Hypertension, High Cholesterol',
  });

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    dataSharing: false,
    emergencyAlerts: true,
  });

  // Mock medical records data
  const medicalRecords = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Consultation',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension follow-up',
      notes: 'Blood pressure well controlled with current medication.'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'Lab Results',
      doctor: 'Lab Corp',
      diagnosis: 'Blood Test',
      notes: 'Cholesterol levels improved. Continue current treatment.'
    },
    {
      id: '3',
      date: '2023-12-20',
      type: 'Vaccination',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Flu Shot',
      notes: 'Administered seasonal influenza vaccine.'
    }
  ];

  const validateProfileData = () => {
    if (!profileData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!profileData.age || isNaN(profileData.age) || parseInt(profileData.age) <= 0) {
      Alert.alert('Error', 'Please enter a valid age');
      return false;
    }
    if (!profileData.contact.trim()) {
      Alert.alert('Error', 'Please enter your contact number');
      return false;
    }
    return true;
  };

  const handleSaveProfile = () => {
    if (!validateProfileData()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully');
    }, 1000);
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Show confirmation for important settings
    if (setting === 'emergencyAlerts' && !settings[setting]) {
      Alert.alert(
        'Emergency Alerts Enabled',
        'You will now receive critical health alerts and emergency notifications.'
      );
    }
  };

  const handleExportMedicalData = async (format) => {
    setIsLoading(true);
    setShowExportOptions(false);
    
    try {
      // Simulate data export
      const medicalData = {
        patientInfo: profileData,
        settings: settings,
        medicalHistory: medicalRecords,
        exportDate: new Date().toISOString(),
      };
      
      const dataString = JSON.stringify(medicalData, null, 2);
      const fileName = `VitalAi_Medical_Data_${new Date().getTime()}.${format}`;
      
      if (Platform.OS === 'web') {
        // Web export
        const blob = new Blob([dataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Mobile export
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, dataString);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Export Complete', `File saved: ${fileName}`);
        }
      }
      
      Alert.alert('Success', `Medical data exported as ${format.toUpperCase()}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export medical data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Simulate sign out process
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Signed Out', 'You have been successfully signed out.');
              // Here you would typically navigate to login screen
            }, 1500);
          },
        },
      ]
    );
  };

  const MedicalInfoCard = ({ title, value, icon, editable = false, onEdit }) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color="#007AFF" />
        <Text style={styles.cardTitle}>{title}</Text>
        {editable && isEditing && (
          <TouchableOpacity style={styles.editFieldButton} onPress={onEdit}>
            <Ionicons name="pencil" size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
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

  const MedicalRecordItem = ({ record }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordDate}>{record.date}</Text>
        <View style={styles.recordTypeBadge}>
          <Text style={styles.recordTypeText}>{record.type}</Text>
        </View>
      </View>
      <Text style={styles.recordDoctor}>👨‍⚕️ {record.doctor}</Text>
      <Text style={styles.recordDiagnosis}>Diagnosis: {record.diagnosis}</Text>
      <Text style={styles.recordNotes}>{record.notes}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                placeholder="Enter your name"
                placeholderTextColor="#999"
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
          disabled={isLoading}
        >
          <Ionicons 
            name={isEditing ? "checkmark" : "pencil"} 
            size={20} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Personal Information */}
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
                placeholder="Age"
                placeholderTextColor="#999"
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
                placeholder="Gender"
                placeholderTextColor="#999"
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
                placeholder="Blood Type"
                placeholderTextColor="#999"
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
                placeholder="Contact"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.contact}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Medical Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
        <MedicalInfoCard
          title="Allergies"
          value={profileData.allergies}
          icon="warning-outline"
          editable={true}
          onEdit={() => Alert.alert('Edit Allergies', 'Update your allergy information')}
        />
        <MedicalInfoCard
          title="Current Medications"
          value={profileData.medications}
          icon="medical-outline"
          editable={true}
          onEdit={() => Alert.alert('Edit Medications', 'Update your current medications')}
        />
        <MedicalInfoCard
          title="Medical Conditions"
          value={profileData.conditions}
          icon="heart-outline"
          editable={true}
          onEdit={() => Alert.alert('Edit Conditions', 'Update your medical conditions')}
        />
        <MedicalInfoCard
          title="Emergency Contact"
          value={profileData.emergencyContact}
          icon="call-outline"
          editable={true}
          onEdit={() => Alert.alert('Edit Emergency Contact', 'Update emergency contact information')}
        />
      </View>

      {/* Settings */}
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

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowExportOptions(true)}
          disabled={isLoading}
        >
          <Ionicons name="download-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>Export Medical Data</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowMedicalRecords(true)}
          disabled={isLoading}
        >
          <Ionicons name="document-text-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>View Medical Records</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleSignOut}
          disabled={isLoading}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={[styles.actionButtonText, styles.dangerText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Medical Records Modal */}
      <Modal
        visible={showMedicalRecords}
        animationType="slide"
        presentationStyle="pageSheet"
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
          </ScrollView>
        </View>
      </Modal>

      {/* Export Options Modal */}
      <Modal
        visible={showExportOptions}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.exportModal}>
            <Text style={styles.modalTitle}>Export Medical Data</Text>
            <Text style={styles.modalSubtitle}>Choose export format:</Text>
            
            <TouchableOpacity 
              style={styles.exportOption}
              onPress={() => handleExportMedicalData('json')}
            >
              <Ionicons name="code-slash" size={24} color="#007AFF" />
              <View style={styles.exportOptionText}>
                <Text style={styles.exportOptionTitle}>JSON Format</Text>
                <Text style={styles.exportOptionSubtitle}>Structured data for developers</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exportOption}
              onPress={() => handleExportMedicalData('pdf')}
            >
              <Ionicons name="document-text" size={24} color="#FF3B30" />
              <View style={styles.exportOptionText}>
                <Text style={styles.exportOptionTitle}>PDF Document</Text>
                <Text style={styles.exportOptionSubtitle}>Printable format for doctors</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.exportOption}
              onPress={() => handleExportMedicalData('csv')}
            >
              <Ionicons name="table" size={24} color="#34C759" />
              <View style={styles.exportOptionText}>
                <Text style={styles.exportOptionTitle}>CSV Spreadsheet</Text>
                <Text style={styles.exportOptionSubtitle}>For data analysis</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  memberId: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  editInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  editInputSmall: {
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 8,
    padding: 8,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  cardValue: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  editFieldButton: {
    padding: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingTexts: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  dangerButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  dangerText: {
    color: '#FF3B30',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  recordsList: {
    flex: 1,
    padding: 16,
  },
  recordItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  recordTypeBadge: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  recordTypeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  recordDoctor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  recordDiagnosis: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recordNotes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  // Export Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exportModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  exportOptionText: {
    flex: 1,
  },
  exportOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  exportOptionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cancelExportButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelExportText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default Profile;