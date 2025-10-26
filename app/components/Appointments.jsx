import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/Appointments';

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
    // Handle appointment booking logic
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
    // Here you would typically update state or send to backend
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
        <Text style={styles.detail}>

📅 {item.date}</Text>
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

      {/* Booking Modal */}
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

export default Appointments;