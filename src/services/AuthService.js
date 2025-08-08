// services/AuthService.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/FirebaeConfig'; // ✅ correct


class AuthService {
  // Generate unique ID for doctor/patient
  generateUniqueId = (role) => {
    const prefix = role === 'doctor' ? 'DOC' : 'PAT';
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Create doctor document structure
  createDoctorDocument = (userData, userId) => {
    return {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      specialization: null,
      gender: null,
      experience: null,
      education: null,
      availability: [],
      address: null,
      createdAt: new Date(),
      licenseNumber: null,
      profileImage: null,
      ratings: 0,
      isAvailable: true,
      consultationFee: null,
      languagesSpoken: [],
      doctorId: this.generateUniqueId('doctor'),
      userId: userId, // Link to Firebase Auth user
      role: 'doctor'
    };
  };

  // Create patient document structure
  createPatientDocument = (userData, userId) => {
    return {
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      gender: null,
      age: null,
      height: null,
      weight: null,
      bloodGroup: null,
      chronicDiseases: [],
      medications: [],
      allergies: [],
      createdAt: new Date(),
      address: null,
      emergencyContact: null,
      medicalHistory: null,
      insuranceProvider: null,
      patientId: this.generateUniqueId('patient'),
      profileImage: null,
      userId: userId, // Link to Firebase Auth user
      role: 'patient'
    };
  };

  // Sign up user
  signUp = async (userData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Prepare document data based on role
      let documentData;
      let collectionName;
      
      if (userData.role === 'doctor') {
        documentData = this.createDoctorDocument(userData, user.uid);
        collectionName = 'doctors';
      } else {
        documentData = this.createPatientDocument(userData, user.uid);
        collectionName = 'patients';
      }
      
      // Save user data to Firestore
      await setDoc(doc(db, collectionName, user.uid), documentData);
      
      // Also create a general users document for role identification
      await setDoc(doc(db, 'users', user.uid), {
        email: userData.email,
        role: userData.role,
        createdAt: new Date(),
        isActive: true
      });
      
      return {
        success: true,
        user: user,
        userData: documentData
      };
      
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  };

  // Sign in user
  signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user role from users collection
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      const userData = userDoc.data();
      
      return {
        success: true,
        user: user,
        role: userData.role
      };
      
    } catch (error) {
      console.error('Signin error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  };

  // Sign out user
  signOut = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      throw new Error('Failed to sign out');
    }
  };

  // Get user profile data
  getUserProfile = async (userId, role) => {
    try {
      const collectionName = role === 'doctor' ? 'doctors' : 'patients';
      const userDoc = await getDoc(doc(db, collectionName, userId));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }
      
      return {
        success: true,
        data: userDoc.data()
      };
      
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error('Failed to fetch user profile');
    }
  };

  // Helper function to get user-friendly error messages
  getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email address is already registered. Please use a different email or try signing in.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  };
}

export default new AuthService();