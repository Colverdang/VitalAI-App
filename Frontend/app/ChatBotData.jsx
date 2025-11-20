// app/components/ChatBotData.jsx
// Enhanced Demo User Data
export const createDemoUser = () => ({
  id: 'demo-user-12345',
  fullName: 'Thabo Mbeki',
  email: 'thabo.mbeki@example.com',
  phone: '+27 11 555 1234',
  idNumber: '7501015000089',
  fileNumber: 'MED2024001',
  gender: 'Male',
  language: 'en',
  dateOfBirth: '1975-01-01',
  address: '123 Main Street, Johannesburg, Gauteng 2000',
  medicalHistory: 'Hypertension, Seasonal allergies. No known drug allergies.',
  emergencyContact: 'Sarah Mbeki (Spouse) - +27 82 555 5678',
  bloodType: 'O+',
  insuranceProvider: 'Discovery Health',
  primaryDoctor: 'Dr. Ndlovu',
  isTemporary: true,
});

// Enhanced Demo Appointments
export const createDemoAppointments = () => [
  {
    id: 'appt-001',
    patientName: 'Thabo Mbeki',
    department: 'Cardiology',
    doctor: 'Dr. Ndlovu',
    date: '2024-12-15',
    time: '10:00 AM',
    reason: 'Routine heart checkup',
    status: 'Confirmed',
  }
];

// Enhanced Demo Chat History
export const createDemoChatHistory = () => [
  {
    id: 'chat-001',
    text: "I've been experiencing chest discomfort.",
    isUser: true,
    timestamp: new Date('2024-11-20T09:30:00'),
    type: 'medical_advice',
    department: 'Cardiology'
  },
  {
    id: 'chat-002',
    text: "Based on your symptoms, I recommend you schedule an appointment with Cardiology.",
    isUser: false,
    timestamp: new Date('2024-11-20T09:32:00'),
    type: 'medical_advice',
    department: 'Cardiology'
  }
];