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
      console.log('🔐 Attempting login with identifier:', identifier);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!identifier || !password) {
        throw new Error('Please enter both identifier and password');
      }

      // Find user by identifier (ID number, file number, or passport)
      let user = null;
      
      // Check all possible identifier fields
      for (const userId in demoUsers) {
        const demoUser = demoUsers[userId];
        if (demoUser.idNumber === identifier || 
            demoUser.fileNumber === identifier || 
            demoUser.passportNumber === identifier) {
          user = demoUser;
          break;
        }
      }

      if (!user) {
        throw new Error('Invalid identifier. Please check your ID number, file number, or passport number.');
      }

      // Check password (in real app, this would be hashed)
      if (user.password !== password) {
        throw new Error('Invalid password. Please try again.');
      }

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        success: true,
        user: userWithoutPassword,
        token: `demo-token-${user.id}`
      };

    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  async register(userData) {
    try {
      console.log('📝 Simulating registration for:', userData.fullName);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields
      if (!userData.idNumber && !userData.passportNumber) {
        throw new Error('Please provide either ID number or passport number');
      }

      if (!userData.fullName || !userData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Check if user already exists
      const existingUser = demoUsers[userData.idNumber || userData.passportNumber];
      if (existingUser) {
        throw new Error('User with this identifier already exists');
      }

      // Create new user (in real app, this would save to database)
      const newUser = {
        id: 'new-user-' + Date.now(),
        ...userData,
        fileNumber: `MED${new Date().getFullYear()}${String(Object.keys(demoUsers).length + 1).padStart(3, '0')}`,
        role: userData.role || 'patient',
        language: userData.language || 'en'
      };

      // In a real app, you would save to database here
      // For demo, we'll just return the user without saving

      const { password: _, ...userWithoutPassword } = newUser;

      return {
        success: true,
        user: userWithoutPassword,
        token: `demo-token-${newUser.id}`
      };

    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
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