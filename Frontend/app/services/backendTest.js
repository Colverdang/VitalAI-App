// app/services/backendTest.js
import axios from 'axios';

const BACKEND_URL = 'https://vitalai-chatbot-backend-production.up.railway.app';
const MAIN_BACKEND_URL = 'http://localhost:8000'; // Adjust this to your main backend URL

export const BackendTester = {
  // Test AI Backend
  async testAIBackend() {
    try {
      console.log('🧪 Testing AI Backend...');
      const response = await axios.post(`${BACKEND_URL}/predict`, {
        text: "test message for connection check"
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ AI Backend Response:', response.data);
      return {
        ok: true,
        status: response.status,
        data: response.data,
        url: BACKEND_URL
      };
    } catch (error) {
      console.log('❌ AI Backend Error:', error.message);
      return {
        ok: false,
        error: error.message,
        url: BACKEND_URL
      };
    }
  },

  // Test Main Backend
  async testMainBackend() {
    try {
      console.log('🧪 Testing Main Backend...');
      const response = await axios.get(`${MAIN_BACKEND_URL}/health`, {
        timeout: 10000
      });
      
      console.log('✅ Main Backend Response:', response.data);
      return {
        ok: true,
        status: response.status,
        data: response.data,
        url: MAIN_BACKEND_URL
      };
    } catch (error) {
      console.log('❌ Main Backend Error:', error.message);
      
      // Try alternative health check endpoint
      try {
        console.log('🔄 Trying alternative health check...');
        const altResponse = await axios.get(`${MAIN_BACKEND_URL}/api/health`, {
          timeout: 5000
        });
        return {
          ok: true,
          status: altResponse.status,
          data: altResponse.data,
          url: MAIN_BACKEND_URL
        };
      } catch (altError) {
        return {
          ok: false,
          error: error.message,
          url: MAIN_BACKEND_URL
        };
      }
    }
  },

  // Test all endpoints
  async testAllEndpoints() {
    console.log('🚀 Starting comprehensive backend tests...');
    
    const [aiBackend, mainBackend] = await Promise.allSettled([
      this.testAIBackend(),
      this.testMainBackend()
    ]);

    const results = {
      aiBackend: aiBackend.status === 'fulfilled' ? aiBackend.value : { ok: false, error: 'Promise rejected' },
      mainBackend: mainBackend.status === 'fulfilled' ? mainBackend.value : { ok: false, error: 'Promise rejected' },
      timestamp: new Date().toISOString()
    };

    console.log('📊 Test Results:', results);
    return results;
  },

  // Quick health check
  async quickHealthCheck() {
    try {
      const response = await axios.post(`${BACKEND_URL}/predict`, {
        text: "health check"
      }, {
        timeout: 5000
      });
      return { ok: true, status: response.status };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
};