import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/Appointments';

const { width, height } = Dimensions.get('window');

const Appointments = ({ user, fetchAppointments }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    department: '',
    location: '',
    doctorType: '',
    preferredDate: '',
    preferredTime: '',
    reason: '',
    urgency: '',
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);

  // Example static options (can come from backend too)
  const hospitals = [
    "Johannesburg General Hospital",
    "Pretoria Academic Hospital",
    "Cape Town Medical Center",
    "Durban Regional Hospital",
    "Port Elizabeth City Hospital",
    "Bloemfontein National Hospital",
    "East London Medical Complex"
  ];

  const departments = [
    "Emergency", "General Medicine", "Pediatrics", "Surgery",
    "Orthopedics", "Cardiology", "Neurology", "Dermatology",
    "Gastroenterology", "Respiratory", "Maternity", "Pharmacy"
  ];

  const doctorTypes = [
    "General Practitioner",
    "Specialist Consultant",
    "Senior Specialist",
    "Professor",
    "Any Available Doctor"
  ];

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const urgencyLevels = [
    { label: "Routine Check-up", value: "routine", color: "#34C759" },
    { label: "Follow-up Visit", value: "followup", color: "#FF9500" },
    { label: "Urgent Care", value: "urgent", color: "#FF3B30" },
    { label: "Emergency", value: "emergency", color: "#FF2D55" }
  ];

  // Fetch appointments from backend when component mounts
  useEffect(() => {
    if (user && fetchAppointments) {
      fetchAppointments(user.idNumber)
        .then(({ upcoming, past }) => {
          setUpcomingAppointments(upcoming || []);
          setPastAppointments(past || []);
        })
        .catch(err => {
          console.error('Failed to fetch appointments:', err);
        });
    }
  }, [user]);

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'This will call emergency services (10111). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', style: 'destructive', onPress: () => Linking.openURL('tel:10111') },
      ]
    );
  };

  const handleCancelAppointment = (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No, Keep It', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => {
          // Remove appointment locally
          setUpcomingAppointments(prev => prev.filter(a => a.id !== appointmentId));
          Alert.alert('Cancelled', 'Your appointment has been cancelled');
          // TODO: Call backend to cancel appointment
        }},
      ]
    );
  };

  const handleBookAppointment = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book an appointment');
      return;
    }

    if (!appointmentData.department || !appointmentData.location) {
      Alert.alert('Error', 'Please select a department and hospital location');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      patientName: user.fullName,
      patientId: user.idNumber,
      department: appointmentData.department,
      location: appointmentData.location,
      doctorType: appointmentData.doctorType || 'Any Available Doctor',
      date: appointmentData.preferredDate || 'ASAP',
      time: appointmentData.preferredTime || '09:00 AM',
      reason: appointmentData.reason || 'General consultation',
      urgency: appointmentData.urgency || 'routine',
      status: 'Pending',
    };

    setUpcomingAppointments(prev => [newAppointment, ...prev]);
    setShowBookingModal(false);
    setAppointmentData({
      department: '',
      location: '',
      doctorType: '',
      preferredDate: '',
      preferredTime: '',
      reason: '',
      urgency: '',
    });

    // TODO: Send newAppointment to backend
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
      <Text style={styles.doctor}>👨‍⚕️ {item.doctor || item.doctorType}</Text>
      <Text style={styles.location}>🏥 {item.location}</Text>
      <View style={styles.appointmentDetails}>
        <Text style={styles.detail}>📅 {item.date}</Text>
        <Text style={styles.detail}>⏰ {item.time}</Text>
      </View>
      {item.status === 'Pending' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelAppointment(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.bookButton, !user && styles.disabledButton]}
            onPress={() => setShowBookingModal(true)}
            disabled={!user}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.bookButtonText}>Book New</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
          >
            <Ionicons name="warning" size={20} color="#FFF" />
            <Text style={styles.emergencyButtonText}>Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!user && (
        <View style={styles.loginPrompt}>
          <Ionicons name="log-in" size={32} color="#007AFF" />
          <Text style={styles.loginPromptText}>Please login to book appointments</Text>
        </View>
      )}

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
      
      {/* Enhanced Booking Modal */}
      <Modal visible={showBookingModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Appointment</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              
              {/* Patient Information Section */}
              {user && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="person" size={20} color="#007AFF" />
                    <Text style={styles.sectionTitle}>Patient Information</Text>
                  </View>
                  <View style={styles.patientInfoGrid}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Name:</Text>
                      <Text style={styles.infoValue}>{user.fullName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>ID:</Text>
                      <Text style={styles.infoValue}>{user.idNumber || 'Not provided'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Phone:</Text>
                      <Text style={styles.infoValue}>{user.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Email:</Text>
                      <Text style={styles.infoValue}>{user.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Date of Birth:</Text>
                      <Text style={styles.infoValue}>{user.dateOfBirth || 'Not provided'}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Appointment Details Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={20} color="#007AFF" />
                  <Text style={styles.sectionTitle}>Appointment Details</Text>
                </View>

                {/* Hospital Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Select Hospital</Text>
                  <ScrollView style={styles.optionsContainer} nestedScrollEnabled>
                    {hospitals.map(hospital => (
                      <TouchableOpacity 
                        key={hospital}
                        style={[
                          styles.optionCard,
                          appointmentData.location === hospital && styles.optionCardSelected
                        ]}
                        onPress={() => setAppointmentData(prev => ({...prev, location: hospital}))}
                      >
                        <View style={styles.optionContent}>
                          <Ionicons 
                            name="business" 
                            size={20} 
                            color={appointmentData.location === hospital ? '#007AFF' : '#666'} 
                          />
                          <Text style={[
                            styles.optionText,
                            appointmentData.location === hospital && styles.optionTextSelected
                          ]}>
                            {hospital}
                          </Text>
                        </View>
                        {appointmentData.location === hospital && (
                          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Department Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Select Department</Text>
                  <ScrollView style={styles.optionsContainer} nestedScrollEnabled>
                    {departments.map(dept => (
                      <TouchableOpacity 
                        key={dept}
                        style={[
                          styles.optionCard,
                          appointmentData.department === dept && styles.optionCardSelected
                        ]}
                        onPress={() => setAppointmentData(prev => ({...prev, department: dept}))}
                      >
                        <View style={styles.optionContent}>
                          <Ionicons 
                            name="medical" 
                            size={20} 
                            color={appointmentData.department === dept ? '#007AFF' : '#666'} 
                          />
                          <Text style={[
                            styles.optionText,
                            appointmentData.department === dept && styles.optionTextSelected
                          ]}>
                            {dept}
                          </Text>
                        </View>
                        {appointmentData.department === dept && (
                          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Doctor Type Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Preferred Doctor Type</Text>
                  <ScrollView style={styles.optionsContainer} nestedScrollEnabled>
                    {doctorTypes.map(type => (
                      <TouchableOpacity 
                        key={type}
                        style={[
                          styles.optionCard,
                          appointmentData.doctorType === type && styles.optionCardSelected
                        ]}
                        onPress={() => setAppointmentData(prev => ({...prev, doctorType: type}))}
                      >
                        <View style={styles.optionContent}>
                          <Ionicons 
                            name="person" 
                            size={20} 
                            color={appointmentData.doctorType === type ? '#007AFF' : '#666'} 
                          />
                          <Text style={[
                            styles.optionText,
                            appointmentData.doctorType === type && styles.optionTextSelected
                          ]}>
                            {type}
                          </Text>
                        </View>
                        {appointmentData.doctorType === type && (
                          <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Urgency Level */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Urgency Level</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.urgencyContainer}>
                    {urgencyLevels.map(level => (
                      <TouchableOpacity
                        key={level.value}
                        style={[
                          styles.urgencyOption,
                          { backgroundColor: level.color + '20', borderColor: level.color },
                          appointmentData.urgency === level.value && styles.urgencyOptionSelected
                        ]}
                        onPress={() => setAppointmentData(prev => ({...prev, urgency: level.value}))}
                      >
                        <Ionicons 
                          name={level.value === 'emergency' ? 'warning' : 'time'} 
                          size={16} 
                          color={level.color} 
                        />
                        <Text style={[
                          styles.urgencyText,
                          { color: level.color },
                          appointmentData.urgency === level.value && styles.urgencyTextSelected
                        ]}>
                          {level.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Date and Time */}
                <View style={styles.row}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Preferred Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={appointmentData.preferredDate}
                      onChangeText={(text) => setAppointmentData(prev => ({...prev, preferredDate: text}))}
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Preferred Time</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeContainer}>
                      {timeSlots.map(slot => (
                        <TouchableOpacity
                          key={slot}
                          style={[
                            styles.timeOption,
                            appointmentData.preferredTime === slot && styles.timeOptionSelected
                          ]}
                          onPress={() => setAppointmentData(prev => ({...prev, preferredTime: slot}))}
                        >
                          <Text style={[
                            styles.timeText,
                            appointmentData.preferredTime === slot && styles.timeTextSelected
                          ]}>
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                {/* Reason for Visit */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Reason for Visit</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Please describe your symptoms or reason for visit..."
                    multiline
                    numberOfLines={3}
                    value={appointmentData.reason}
                    onChangeText={(text) => setAppointmentData(prev => ({...prev, reason: text}))}
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={handleBookAppointment}
                >
                  <Ionicons name="calendar" size={20} color="#FFF" />
                  <Text style={styles.bookButtonText}>Book Appointment</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowBookingModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Appointments