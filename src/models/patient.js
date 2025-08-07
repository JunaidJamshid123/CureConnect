const PatientSchema = {
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  gender: { type: String },
  age: { type: Number },
  height: { type: String },
  weight: { type: String },
  bloodGroup: { type: String },
  chronicDiseases: { type: Array, default: [] }, // Array of chronic illnesses (e.g., Diabetes)
  medications: { type: Array, default: [] }, // Current medications
  allergies: { type: Array, default: [] }, // Known allergies
  createdAt: { type: Date, default: Date.now },
  address: { type: String },
  emergencyContact: { type: String },
  medicalHistory: { type: String }, // Summary of past medical conditions
  insuranceProvider: { type: String },
  patientId: { type: String, required: true, unique: true }, // Unique system ID for patient
  profileImage: { type: String }, // Patient's photo
};

export default PatientSchema;