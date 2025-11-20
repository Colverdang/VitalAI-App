// app/components/AdminStaff.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/Admin';

const AdminStaff = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeAppointments: 23,
    pendingApprovals: 8,
    emergencyCases: 2,
  });

  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+27 11 234 5678',
      status: 'active',
      role: 'patient',
      lastActive: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+27 11 234 5679',
      status: 'active',
      role: 'patient',
      lastActive: '2024-01-14',
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      email: 'mchen@hospital.org',
      phone: '+27 11 234 5680',
      status: 'active',
      role: 'doctor',
      lastActive: '2024-01-15',
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: '1',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'confirmed',
      type: 'Follow-up',
    },
    {
      id: '2',
      patientName: 'Sarah Smith',
      doctorName: 'Dr. Michael Chen',
      department: 'General Medicine',
      date: '2024-01-20',
      time: '11:30 AM',
      status: 'pending',
      type: 'Consultation',
    },
    {
      id: '3',
      patientName: 'James Wilson',
      doctorName: 'Dr. Lisa Brown',
      department: 'Orthopedics',
      date: '2024-01-21',
      time: '2:15 PM',
      status: 'cancelled',
      type: 'Surgery Follow-up',
    },
  ]);

  const [staff, setStaff] = useState([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      department: 'Cardiology',
      status: 'active',
      email: 'sjohnson@hospital.org',
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      role: 'General Practitioner',
      department: 'General Medicine',
      status: 'active',
      email: 'mchen@hospital.org',
    },
    {
      id: '3',
      name: 'Nurse Jane Williams',
      role: 'Registered Nurse',
      department: 'Emergency',
      status: 'on-leave',
      email: 'jwilliams@hospital.org',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Data has been updated');
    }, 1000);
  };

  const handleUserAction = (userId, action) => {
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => {
            // Implement user action logic
            Alert.alert('Success', `User ${action}ed successfully`);
          },
        },
      ]
    );
  };

  const handleAppointmentAction = (appointmentId, action) => {
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Appointment`,
      `Are you sure you want to ${action} this appointment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => {
            // Implement appointment action logic
            Alert.alert('Success', `Appointment ${action}ed successfully`);
          },
        },
      ]
    );
  };

  const StatsCard = ({ title, value, icon, color, subtitle }) => (
    <View style={styles.statsCard}>
      <View style={[styles.statsIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFF" />
      </View>
      <View style={styles.statsContent}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
        {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const UserItem = ({ user }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => {
        setSelectedUser(user);
        setShowUserModal(true);
      }}
    >
      <View style={styles.userAvatar}>
        <Ionicons name="person" size={20} color="#666" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.userMeta}>
          <View style={[styles.statusBadge, user.status === 'active' ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{user.status}</Text>
          </View>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={18} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={18} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const AppointmentItem = ({ appointment }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => {
        setSelectedAppointment(appointment);
        setShowAppointmentModal(true);
      }}
    >
      <View style={[
        styles.appointmentIcon,
        appointment.status === 'confirmed' && styles.appointmentConfirmed,
        appointment.status === 'pending' && styles.appointmentPending,
        appointment.status === 'cancelled' && styles.appointmentCancelled,
      ]}>
        <Ionicons 
          name={appointment.status === 'confirmed' ? 'checkmark' : appointment.status === 'pending' ? 'time' : 'close'} 
          size={16} 
          color="#FFF" 
        />
      </View>
      <View style={styles.appointmentInfo}>
        <Text style={styles.appointmentPatient}>{appointment.patientName}</Text>
        <Text style={styles.appointmentDoctor}>With {appointment.doctorName}</Text>
        <View style={styles.appointmentMeta}>
          <Text style={styles.appointmentDepartment}>{appointment.department}</Text>
          <Text style={styles.appointmentTime}>{appointment.date} at {appointment.time}</Text>
        </View>
      </View>
      <View style={styles.appointmentStatus}>
        <Text style={[
          styles.statusText,
          appointment.status === 'confirmed' && styles.statusConfirmed,
          appointment.status === 'pending' && styles.statusPending,
          appointment.status === 'cancelled' && styles.statusCancelled,
        ]}>
          {appointment.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const StaffItem = ({ staff }) => (
    <View style={styles.listItem}>
      <View style={styles.staffAvatar}>
        <Ionicons name="person" size={20} color="#666" />
      </View>
      <View style={styles.staffInfo}>
        <Text style={styles.staffName}>{staff.name}</Text>
        <Text style={styles.staffRole}>{staff.role}</Text>
        <View style={styles.staffMeta}>
          <Text style={styles.staffDepartment}>{staff.department}</Text>
          <View style={[styles.statusBadge, staff.status === 'active' ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{staff.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.staffActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="mail-outline" size={18} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={18} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDashboard = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.sectionTitle}>Overview</Text>
      
      <View style={styles.statsGrid}>
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon="people"
          color="#007AFF"
          subtitle="+12 this week"
        />
        <StatsCard
          title="Active Appointments"
          value={stats.activeAppointments}
          icon="calendar"
          color="#34C759"
          subtitle="Today"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon="time"
          color="#FF9500"
          subtitle="Require attention"
        />
        <StatsCard
          title="Emergency Cases"
          value={stats.emergencyCases}
          icon="warning"
          color="#FF3B30"
          subtitle="Active"
        />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="person-add" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>Add User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="calendar" size={24} color="#34C759" />
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="document-text" size={24} color="#FF9500" />
            <Text style={styles.quickActionText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="settings" size={24} color="#666" />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <Ionicons name="person-add" size={16} color="#34C759" />
            <Text style={styles.activityText}>New patient registration - John Doe</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="calendar" size={16} color="#007AFF" />
            <Text style={styles.activityText}>Appointment confirmed - Sarah Smith</Text>
            <Text style={styles.activityTime}>4 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="warning" size={16} color="#FF3B30" />
            <Text style={styles.activityText}>Emergency case reported</Text>
            <Text style={styles.activityTime}>6 hours ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderUsers = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#999"
        />
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserItem user={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderAppointments = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabFilters}>
        <TouchableOpacity style={[styles.filterButton, styles.filterActive]}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Confirmed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Cancelled</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={appointments}
        renderItem={({ item }) => <AppointmentItem appointment={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderStaff = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff..."
          placeholderTextColor="#999"
        />
      </View>
      <FlatList
        data={staff}
        renderItem={({ item }) => <StaffItem staff={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderAnalytics = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Analytics & Reports</Text>
      
      <View style={styles.analyticsCards}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsTitle}>User Growth</Text>
          <Text style={styles.analyticsValue}>+24%</Text>
          <Text style={styles.analyticsSubtitle}>This month</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsTitle}>Appointment Rate</Text>
          <Text style={styles.analyticsValue}>87%</Text>
          <Text style={styles.analyticsSubtitle}>Completion rate</Text>
        </View>
      </View>

      <View style={styles.reportSection}>
        <Text style={styles.sectionTitle}>Generate Reports</Text>
        <TouchableOpacity style={styles.reportButton}>
          <Ionicons name="download" size={20} color="#007AFF" />
          <Text style={styles.reportButtonText}>User Activity Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton}>
          <Ionicons name="download" size={20} color="#007AFF" />
          <Text style={styles.reportButtonText}>Appointment Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton}>
          <Ionicons name="download" size={20} color="#007AFF" />
          <Text style={styles.reportButtonText}>Staff Performance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Welcome back, {user?.fullName || 'Admin'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.tabActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons 
            name="grid" 
            size={20} 
            color={activeTab === 'dashboard' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'users' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
            Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'appointments' && styles.tabActive]}
          onPress={() => setActiveTab('appointments')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={activeTab === 'appointments' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'appointments' && styles.tabTextActive]}>
            Appointments
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'staff' && styles.tabActive]}
          onPress={() => setActiveTab('staff')}
        >
          <Ionicons 
            name="medical" 
            size={20} 
            color={activeTab === 'staff' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'staff' && styles.tabTextActive]}>
            Staff
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'analytics' && styles.tabActive]}
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={activeTab === 'analytics' ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.tabTextActive]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Main Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'appointments' && renderAppointments()}
      {activeTab === 'staff' && renderStaff()}
      {activeTab === 'analytics' && renderAnalytics()}

      {/* User Detail Modal */}
      <Modal
        visible={showUserModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>User Details</Text>
            <TouchableOpacity onPress={() => setShowUserModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {selectedUser && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{selectedUser.name}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{selectedUser.email}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{selectedUser.phone}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Role</Text>
                <Text style={styles.detailValue}>{selectedUser.role}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{selectedUser.status}</Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Appointment Detail Modal */}
      <Modal
        visible={showAppointmentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Appointment Details</Text>
            <TouchableOpacity onPress={() => setShowAppointmentModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {selectedAppointment && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Patient</Text>
                <Text style={styles.detailValue}>{selectedAppointment.patientName}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Doctor</Text>
                <Text style={styles.detailValue}>{selectedAppointment.doctorName}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Department</Text>
                <Text style={styles.detailValue}>{selectedAppointment.department}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{selectedAppointment.date} at {selectedAppointment.time}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{selectedAppointment.status}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{selectedAppointment.type}</Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default AdminStaff;