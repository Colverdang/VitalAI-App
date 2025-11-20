// app/index.jsx
import React, { useEffect, useState } from 'react';
import { Alert, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import Main from './Main';
import { apiService } from './services/api';
import { BackendTester } from './services/backendTest';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [connectionResults, setConnectionResults] = useState(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  // Test backend connection on app start
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        setBackendStatus('checking');
        console.log('🔍 Starting backend connection tests...');
        
        // Test all endpoints
        const results = await BackendTester.testAllEndpoints();
        setConnectionResults(results);
        
        const isAIBackendOk = results.aiBackend.ok;
        const isMainBackendOk = results.mainBackend.ok;

        if (isAIBackendOk || isMainBackendOk) {
          setBackendStatus('connected');
          console.log('✅ Backend connection successful');
          
          // Show detailed connection status
          const statusMessage = 
            `Connection Status:\n\n` +
            `🤖 AI Backend: ${isAIBackendOk ? '✅ Connected' : '❌ Failed'}\n` +
            `🏥 Main Backend: ${isMainBackendOk ? '✅ Connected' : '❌ Failed'}\n\n` +
            `${!isAIBackendOk ? '• AI features will use demo mode\n' : ''}` +
            `${!isMainBackendOk ? '• Patient data will use demo mode' : ''}`;

          Alert.alert(
            'Backend Status', 
            statusMessage,
            [{ text: 'Continue', style: 'default' }]
          );
        } else {
          setBackendStatus('failed');
          console.log('❌ All backend connections failed');
          Alert.alert(
            'Demo Mode Activated', 
            'All backend services are unavailable. The app will run in demo mode with sample data.\n\nYou can still test all features with fictional patient data.',
            [{ text: 'Continue in Demo Mode', style: 'default' }]
          );
        }
      } catch (error) {
        setBackendStatus('failed');
        console.log('❌ Backend testing error:', error);
        Alert.alert(
          'Connection Issue', 
          'Unable to test backend services. Running in demo mode with sample data.',
          [{ text: 'Continue', style: 'default' }]
        );
      }
    };

    // Add a small delay to show loading state
    setTimeout(() => {
      testBackendConnection();
    }, 1000);
  }, []);

  // Show detailed connection results
  const renderDetailedResults = () => {
    if (!connectionResults) return null;

    return (
      <ScrollView style={{ marginTop: 20, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Connection Details:</Text>
        
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600', color: connectionResults.aiBackend.ok ? 'green' : 'red' }}>
            AI Backend: {connectionResults.aiBackend.ok ? '✅ Connected' : '❌ Failed'}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            URL: {connectionResults.aiBackend.url}
          </Text>
          {connectionResults.aiBackend.error && (
            <Text style={{ fontSize: 12, color: 'red' }}>
              Error: {connectionResults.aiBackend.error}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600', color: connectionResults.mainBackend.ok ? 'green' : 'red' }}>
            Main Backend: {connectionResults.mainBackend.ok ? '✅ Connected' : '❌ Failed'}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            URL: {connectionResults.mainBackend.url}
          </Text>
          {connectionResults.mainBackend.error && (
            <Text style={{ fontSize: 12, color: 'red' }}>
              Error: {connectionResults.mainBackend.error}
            </Text>
          )}
        </View>

        <Text style={{ fontSize: 10, color: '#999', marginTop: 8 }}>
          Tested at: {new Date(connectionResults.timestamp).toLocaleString()}
        </Text>
      </ScrollView>
    );
  };

  // Show loading while checking connection
  if (backendStatus === 'checking') {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fff',
        padding: 20 
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 18, color: '#1A1A1A', fontWeight: '600' }}>
          Testing Backend Connections
        </Text>
        <Text style={{ marginTop: 8, fontSize: 14, color: '#666', textAlign: 'center' }}>
          Checking AI backend and main server availability...
        </Text>
        
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
            Testing endpoints:
          </Text>
          <Text style={{ fontSize: 11, color: '#666' }}>
            • AI Prediction Service
          </Text>
          <Text style={{ fontSize: 11, color: '#666' }}>
            • Main Backend API
          </Text>
        </View>

        {connectionResults && renderDetailedResults()}
      </View>
    );
  }

  // Pass backend status to Main component
  return (
    <Main 
      backendStatus={backendStatus} 
      connectionResults={connectionResults}
    />
  );
}