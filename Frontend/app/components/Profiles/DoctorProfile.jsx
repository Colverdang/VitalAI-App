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
  Platform,
  RefreshControl,
  KeyboardAvoidingView,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/Profile'; // can reuse shared styles

LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const DoctorProfile = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    professional: true,
    settings: true,
    actions: true,
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    yearsExperience: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.doctorProfile?.specialization || '',
        licenseNumber: user.doctorProfile?.licenseNumber || '',
        yearsExperience: user.doctorProfile?.yearsExperience?.toString() || '',
      });
    }
  }, [user]);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSaveProfile = () => {
    // Validate required fields
    if (!profileData.name.trim()) return Alert.alert('Error', 'Name is required');
    
    if (onUpdateUser) onUpdateUser({
      ...user,
      fullName: profileData.name,
      doctorProfile: {
        specialization: profileData.specialization,
        licenseNumber: profileData.licenseNumber,
        yearsExperience: profileData.yearsExperience,
      },
    });
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />
        }
      >
        {/* Header */}
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
                onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
              />
            ) : (
              <Text style={styles.name}>{profileData.name}</Text>
            )}
            <Text style={styles.email}>{profileData.email}</Text>
          </View>
          <View style={styles.headerActions}>
            {isEditing ? (
              <TouchableOpacity style={styles.editButton} onPress={handleSaveProfile}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Ionicons name="pencil" size={20} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Personal Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('personal')}>
            <Text style={styles.sectionHeaderText}>Personal Info</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          {expandedSections.personal && (
            <View style={styles.sectionContent}>
              <Text>Email: {profileData.email}</Text>
              <Text>Phone: {profileData.phone}</Text>
            </View>
          )}
        </View>

        {/* Professional Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection('professional')}>
            <Text style={styles.sectionHeaderText}>Professional Info</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          {expandedSections.professional && (
            <View style={styles.sectionContent}>
              <Text>Specialization: {profileData.specialization}</Text>
              <Text>License #: {profileData.licenseNumber}</Text>
              <Text>Years Experience: {profileData.yearsExperience}</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DoctorProfile;
