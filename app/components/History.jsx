import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/History';

const History = ({ messages }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter messages for history (excluding welcome message)
  const chatHistory = messages.filter(msg => msg.id !== '1');
  
  const categories = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'symptoms', label: 'Symptoms', icon: 'heart' },
    { id: 'appointments', label: 'Appointments', icon: 'calendar' },
    { id: 'emergency', label: 'Emergency', icon: 'warning' },
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
      default:
        return chatHistory;
    }
  };

  const filteredHistory = filterHistory(selectedCategory);

  const formatDate = (timestamp) => {
    return timestamp.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
      default:
        return { icon: 'chatbubble', color: '#666' };
    }
  };

  const renderHistoryItem = ({ item }) => {
    const { icon, color } = getMessageIcon(item.type);
    
    return (
      <View style={styles.historyItem}>
        <View style={styles.historyHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <Text style={styles.date}>
            {formatDate(item.timestamp)}
          </Text>
          <Text style={styles.time}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <Text style={styles.messagePreview} numberOfLines={2}>
          {item.isUser ? 'You: ' : 'VitalAi: '}
          {item.text}
        </Text>
        
        {item.department && (
          <View style={styles.departmentBadge}>
            <Ionicons name="medical-outline" size={12} color="#666" />
            <Text style={styles.departmentText}>{item.department}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat History</Text>
        <Text style={styles.subtitle}>
          {chatHistory.length} conversations
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
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
              size={16} 
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
            <Text style={styles.emptyStateTitle}>No history yet</Text>
            <Text style={styles.emptyStateText}>
              Your chat history will appear here once you start conversations with VitalAi
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default History;