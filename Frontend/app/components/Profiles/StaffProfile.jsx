import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/Profile';

LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const StaffProfile = ({ user, onLogout, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.staffProfile?.department || '',
        position: user.staffProfile?.position || '',
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!profileData.name.trim()) return Alert.alert('Error', 'Name is required');

    if (onUpdateUser) onUpdateUser({
      ...user,
      fullName: profileData.name,
      staffProfile: {
        department: profileData.department,
        position: profileData.position,
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
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
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

        {/* Staff Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeaderText}>Staff Info</Text>
          <View style={styles.sectionContent}>
            <Text>Department: {profileData.department}</Text>
            <Text>Position: {profileData.position}</Text>
            <Text>Phone: {profileData.phone}</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StaffProfile;
