// app/components/Profile.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/Profile'; // Fixed import path

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
    // Save profile logic here
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

      {/* Medical Information */}
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

export default Profile;