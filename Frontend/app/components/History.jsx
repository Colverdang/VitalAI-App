// app/components/History.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/History';

const History = ({ messages, user, isDemoMode = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Enhanced message filtering with demo data
  const chatHistory = isDemoMode ? messages : messages.filter(msg => msg.id !== '1');
  
  const categories = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'symptoms', label: 'Symptoms', icon: 'heart' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'emergency', label: 'Emergency', icon: 'warning' },
    { id: 'medical_advice', label: 'Advice', icon: 'medical' },
  ];

  const filterHistory = (category) => {
    switch (category) {
      case 'symptoms':
        return chatHistory.filter(msg => 
          msg.type === 'medical_advice' || msg.type === 'triage_result'
        );
      case 'appointments':
        return chatHistory.filter(msg => 
          msg.type === 'appointment_confirmation'
        );
      case 'emergency':
        return chatHistory.filter(msg => 
          msg.type === 'emergency'
        );
      case 'medical_advice':
        return chatHistory.filter(msg => 
          msg.type === 'medical_advice'
        );
      default:
        return chatHistory;
    }
  };

  const filteredHistory = filterHistory(selectedCategory);

  const formatDate = (timestamp) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return 'Recent';
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'emergency':
        return { icon: 'warning', color: '#FF3B30' };
      case 'appointment_confirmation':
        return { icon: 'calendar', color: '#007AFF' };
      case 'medical_advice':
        return { icon: 'medical', color: '#34C759' };
      case 'triage_result':
        return { icon: 'analytics', color: '#FF9500' };
      case 'welcome':
        return { icon: 'chatbubble', color: '#5856D6' };
      default:
        return { icon: 'chatbubble', color: '#666' };
    }
  };

  const renderHistoryItem = ({ item }) => {
    const { icon, color } = getMessageIcon(item.type);
    const timestamp = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
    
    return (
      <View style={[
        styles.historyItem,
        isDemoMode && styles.demoHistoryItem
      ]}>
        <View style={styles.historyHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <Text style={styles.date}>
            {formatDate(timestamp)}
          </Text>
          <Text style={styles.time}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isDemoMode && (
            <View style={styles.demoTag}>
              <Ionicons name="beaker" size={12} color="#FF9500" />
            </View>
          )}
        </View>
        
        <Text style={styles.messagePreview} numberOfLines={3}>
          {item.isUser ? `${user?.fullName || 'You'}: ` : 'VitalAi: '}
          {item.text}
        </Text>
        
        {item.department && (
          <View style={styles.departmentBadge}>
            <Ionicons name="medical-outline" size={12} color="#666" />
            <Text style={styles.departmentText}>{item.department}</Text>
          </View>
        )}

        {item.severity && (
          <View style={[
            styles.severityBadge,
            item.severity === 'critical' && styles.severityCritical,
            item.severity === 'moderate' && styles.severityModerate,
            item.severity === 'routine' && styles.severityRoutine,
          ]}>
            <Text style={styles.severityText}>
              {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>
            Chat History {isDemoMode && '(Demo)'}
          </Text>
          {isDemoMode && (
            <View style={styles.demoBadge}>
              <Ionicons name="beaker" size={14} color="#FFF" />
              <Text style={styles.demoBadgeText}>DEMO</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>
          {user ? `${user.fullName}'s conversations` : 'Your conversations'}
        </Text>
        <Text style={styles.conversationCount}>
          {chatHistory.length} conversations {isDemoMode && '(Sample Data)'}
        </Text>
      </View>

      {/* Compact Category Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={14} 
                color={selectedCategory === category.id ? '#007AFF' : '#666'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        style={styles.historyList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateTitle}>
              {isDemoMode ? 'No demo history available' : 'No history yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {isDemoMode 
                ? 'Sample chat history is not available in this demo'
                : user 
                  ? `${user.fullName} has no chat history yet`
                  : 'Your chat history will appear here once you start conversations with VitalAi'
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default History;