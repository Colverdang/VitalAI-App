// config.js - temporary local backend
export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  // AI Model Endpoint
  AI_PREDICT: 'https://vitalai-chatbot-backend-production.up.railway.app',
  
  // Main Backend Endpoints - UPDATED
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  CHAT: `${API_BASE_URL}/api/chat`,
  APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  HEALTH: `${API_BASE_URL}/health`,
  USERS: `${API_BASE_URL}/api/users`,
};