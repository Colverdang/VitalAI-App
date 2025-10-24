// frontend/src/services/api.js - FIXED VERSION
import axios from 'axios';
import config from '../utils/config';

// Create axios instance with config from environment variables
const api = axios.create({
  baseURL: config.api.url,
  timeout: config.timeouts.api,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development - FIXED CONFIG ACCESS
    if (config.development?.debug || process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors - FIXED CONFIG ACCESS
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (config.development?.debug || process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // FIXED: Safe config access
    const debugMode = config.development?.debug || process.env.NODE_ENV === 'development';
    if (debugMode) {
      console.error(`API Error: ${error.response?.status}`, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls - UPDATED FOR IDENTIFIER LOGIN
export const authAPI = {
  login: (identifier, password) => 
    api.post('/auth/login', { identifier, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  getProfile: () => 
    api.get('/auth/me'),
  
  debugToken: () => 
    api.get('/auth/debug/me'),
  
  listUsers: () => 
    api.get('/auth/users'),
};

// Chat API calls
export const chatAPI = {
  sendMessage: (prompt) => 
    api.post('/chat', { prompt }, { timeout: config.timeouts.chat }),
};

// Appointments API calls
export const appointmentsAPI = {
  getAppointments: (params = {}) => 
    api.get('/appointments', { params }),
  
  createAppointment: (appointmentData) => 
    api.post('/appointments', appointmentData),
  
  updateAppointment: (id, appointmentData) => 
    api.put(`/appointments/id/${id}`, appointmentData),
  
  deleteAppointment: (id) => 
    api.delete(`/appointments/id/${id}`),
  
  getAppointment: (id) => 
    api.get(`/appointments/id/${id}`),
  
  getAvailableSlots: () => 
    api.get('/appointments/slots'),
};

// FAQ API calls
export const faqAPI = {
  getFAQs: (params = {}) => 
    api.get('/faq', { params }),
  
  createFAQ: (faqData) => 
    api.post('/faq', faqData),
  
  updateFAQ: (id, faqData) => 
    api.put(`/faq/id/${id}`, faqData),
  
  deleteFAQ: (id) => 
    api.delete(`/faq/id/${id}`),
  
  getFAQ: (id) => 
    api.get(`/faq/id/${id}`),
};

// Health check
export const healthAPI = {
  checkHealth: () => 
    api.get('/health'),
};

export default api;