// app/services/api.js
import axios from 'axios';

const BASE_URL = 'https://vitalai-chatbot-backend-production.up.railway.app';
const MAIN_BASE_URL = 'http://localhost:8000';

// Create axios instances with better configuration
const aiApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const mainApi = axios.create({
  baseURL: MAIN_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptors for better error handling
aiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AI API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

mainApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Main API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Demo users database for simulation
const demoUsers = {
  // Patient with ID Number
  '7501015000089': {
    id: 'patient-1',
    fullName: 'Thabo Mbeki',
    idNumber: '7501015000089',
    fileNumber: 'MED2024001',
    passportNumber: 'A12345678',
    email: 'thabo.mbeki@example.com',
    phone: '+27 11 555 1234',
    role: 'patient',
    language: 'en',
    dateOfBirth: '1975-01-01',
    address: '123 Main Street, Johannesburg, Gauteng 2000',
    bloodType: 'O+',
    insuranceProvider: 'Discovery Health',
    primaryDoctor: 'Dr. Ndlovu',
    medicalHistory: 'Hypertension, Seasonal allergies. No known drug allergies.',
    emergencyContact: 'Sarah Mbeki (Spouse) - +27 82 555 5678',
    allergies: ['Penicillin', 'Peanuts'],
    currentMedications: ['Lisinopril 10mg daily', 'Atorvastatin 20mg daily'],
    chronicConditions: ['Hypertension', 'High Cholesterol'],
    password: 'password123'
  },
  // Patient with File Number
  'MED2024002': {
    id: 'patient-2',
    fullName: 'Sarah Mbeki',
    idNumber: '8002154000087',
    fileNumber: 'MED2024002',
    passportNumber: 'B98765432',
    email: 'sarah.mbeki@example.com',
    phone: '+27 82 555 5678',
    role: 'patient',
    language: 'en',
    dateOfBirth: '1980-02-15',
    address: '123 Main Street, Johannesburg, Gauteng 2000',
    bloodType: 'A+',
    insuranceProvider: 'Momentum Health',
    primaryDoctor: 'Dr. van der Merwe',
    medicalHistory: 'No significant medical history',
    emergencyContact: 'Thabo Mbeki (Spouse) - +27 11 555 1234',
    allergies: ['None'],
    currentMedications: ['None'],
    chronicConditions: ['None'],
    password: 'password123'
  },
  // Patient with Passport
  'C55556666': {
    id: 'patient-3',
    fullName: 'John Smith',
    idNumber: '',
    fileNumber: 'MED2024003',
    passportNumber: 'C55556666',
    email: 'john.smith@example.com',
    phone: '+27 83 555 9999',
    role: 'patient',
    language: 'en',
    dateOfBirth: '1988-06-20',
    address: '456 Oak Avenue, Cape Town, Western Cape 8001',
    bloodType: 'B+',
    insuranceProvider: 'Bonitas',
    primaryDoctor: 'Dr. Patel',
    medicalHistory: 'Asthma, previous knee surgery (2019)',
    emergencyContact: 'Mary Smith (Sister) - +27 82 555 8888',
    allergies: ['Dust mites', 'Shellfish'],
    currentMedications: ['Ventolin inhaler as needed'],
    chronicConditions: ['Asthma'],
    password: 'password123'
  },
  // Doctor account
  'DOC001': {
    id: 'doctor-1',
    fullName: 'Dr. Ndlovu',
    idNumber: '7003055000085',
    fileNumber: 'DOC001',
    email: 'dr.ndlovu@hospital.co.za',
    phone: '+27 11 555 1000',
    role: 'doctor',
    language: 'en',
    dateOfBirth: '1970-03-05',
    specialization: 'Cardiology',
    licenseNumber: 'MED123456',
    yearsExperience: 25,
    password: 'doctor123'
  },
  // Staff account
  'STAFF001': {
    id: 'staff-1',
    fullName: 'Nomsa Khumalo',
    idNumber: '8506104000083',
    fileNumber: 'STAFF001',
    email: 'nomsa.khumalo@hospital.co.za',
    phone: '+27 11 555 2000',
    role: 'staff',
    language: 'en',
    dateOfBirth: '1985-06-10',
    department: 'Administration',
    position: 'Reception Manager',
    password: 'staff123'
  }
};

export const apiService = {
  // Authentication endpoints - using ID/Passport/File Number
  async login(identifier, password) {
    try {
      console.log('🔐 Attempting login with identifier:', identifier.identifier);



      // Call your FastAPI login endpoint
      const response = await mainApi.post("/api/auth/login", {
        identifier: identifier.identifier,  // explicitly matches backend field
        password: identifier.password
      });

      if (!identifier || !password) {
        throw new Error('Please enter both identifier and password');
      }

      console.log("✅ Login successful, response:", response.data);

      return {
        success: true,
        user: response.data,  // the backend returns user info + token
        token: response.data.token
      };

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      // Provide better error feedback
      let message = "Login failed. Please try again.";
      if (error.response?.status === 401) {
        message = "Invalid identifier or password.";
      }

      throw new Error(message);
    }
  },

  async register(userData) {
    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", {
        full_name: userData.name,  // <- changed from 'name' to 'full_name'
        email: userData.email,
        password: userData.password,
        phone_number: userData.phone_number, // optional
        role: userData.role || "patient"     // optional
      });

      return response.data;

    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // AI Backend endpoints
  async predictSymptoms(text) {
    try {
      const response = await aiApi.post('/predict', { text });
      return response.data;
    } catch (error) {
      throw new Error(`AI Prediction failed: ${error.message}`);
    }
  },

  async healthCheck() {
    try {
      const response = await aiApi.get('/health');
      return response.data;
    } catch (error) {
      // Try POST endpoint if GET fails
      try {
        const response = await aiApi.post('/predict', { text: "health check" });
        return { status: 'healthy', message: 'AI backend responding' };
      } catch (postError) {
        throw new Error(`Health check failed: ${error.message}`);
      }
    }
  },

  // Main Backend endpoints
  async getUserProfile(userId) {
    try {
      const response = await mainApi.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  },

  async getAppointments(userId) {
    try {
      const response = await mainApi.get(`/appointments/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error.message}`);
    }
  },

  async updateUserProfile(userId, data) {
    try {
      const response = await mainApi.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  },

  // Test connection to both backends
  async testConnections() {
    const results = {
      aiBackend: { ok: false },
      mainBackend: { ok: false },
      timestamp: new Date().toISOString()
    };

    try {
      // Test AI Backend
      const aiTest = await aiApi.post('/predict', { text: "connection test" });
      results.aiBackend = { 
        ok: true, 
        status: aiTest.status,
        data: aiTest.data 
      };
    } catch (error) {
      results.aiBackend.error = error.message;
    }

    try {
      // Test Main Backend
      const mainTest = await mainApi.get('/health');
      results.mainBackend = { 
        ok: true, 
        status: mainTest.status,
        data: mainTest.data 
      };
    } catch (error) {
      results.mainBackend.error = error.message;
    }

    return results;
  },

  // Helper method to get demo login suggestions
  getDemoLoginSuggestions() {
    return [
      {
        identifier: '7501015000089',
        password: 'password123',
        description: 'Patient (ID Number) - Thabo Mbeki'
      },
      {
        identifier: 'MED2024002',
        password: 'password123',
        description: 'Patient (File Number) - Sarah Mbeki'
      },
      {
        identifier: 'C55556666',
        password: 'password123',
        description: 'Patient (Passport) - John Smith'
      },
      {
        identifier: 'DOC001',
        password: 'doctor123',
        description: 'Doctor - Dr. Ndlovu'
      },
      {
        identifier: 'STAFF001',
        password: 'staff123',
        description: 'Staff - Nomsa Khumalo'
      }
    ];
  }
};