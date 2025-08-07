const DoctorSchema = {
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  specialization: { type: String },
  gender: { type: String },
  experience: { type: Number },
  education: { type: String },
  availability: { type: Array, default: [] }, // Array of available days and time slots
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  licenseNumber: { type: String, unique: true },
  profileImage: { type: String }, // URL or path to doctor's photo
  ratings: { type: Number, default: 0 }, // Patient ratings (1-5 stars)
  isAvailable: { type: Boolean, default: true }, // Boolean indicating if doctor is currently accepting appointments
  consultationFee: { type: Number },
  languagesSpoken: { type: Array, default: [] }, // Array of spoken languages (e.g., Urdu, English)
  doctorId: { type: String, required: true, unique: true }, // Unique system ID for doctor
};

export default DoctorSchema;