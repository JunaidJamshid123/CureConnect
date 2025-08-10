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

  // Create doctor document structure - Updated to match your requirements
  createDoctorDocument = (userData, userId) => {
    return {
      // Basic Information
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      gender: null,
      address: null,
      profileImage: null, // Cloudinary URL will be stored here
      
      // Professional Information
      specialization: null,
      experience: null,
      education: null,
      licenseNumber: null,
      languagesSpoken: [], // Array of languages
      
      // Practice Information
      consultationFee: null, // String/Number for fee amount
      isAvailable: true,
      availability: {
        weekdays: null,    // e.g., "9:00 AM - 6:00 PM"
        saturday: null,    // e.g., "10:00 AM - 2:00 PM"
        sunday: null       // e.g., "Closed"
      },
      
      // Rating and Reviews
      ratings: 0,
      totalReviews: 0,
      
      // System Fields
      doctorId: this.generateUniqueId('doctor'),
      userId: userId, // Link to Firebase Auth user
      role: 'doctor',
      createdAt: new Date(),
      lastUpdated: new Date(),
      isActive: true,
      profileComplete: false,
      
      // Additional Medical Fields
      medicalRegistrationNumber: null,
      hospitalAffiliation: null,
      clinicAddress: null,
      emergencyContact: null,
      about: null, // Doctor's bio/description
      
      // Settings
      notificationSettings: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false
      },
      privacySettings: {
        profileVisibility: 'public',
        contactInfoVisible: true,
        showRatings: true
      }
    };
  };

  // Create patient document structure - Enhanced
  createPatientDocument = (userData, userId) => {
    return {
      // Basic Information
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      gender: null,
      age: null,
      address: null,
      profileImage: null, // Cloudinary URL will be stored here
      
      // Medical Information
      height: null,
      weight: null,
      bloodGroup: null,
      chronicDiseases: [], // Array of chronic conditions
      currentMedications: [], // Array of current medications
      allergies: [], // Array of allergies
      medicalHistory: null,
      insuranceProvider: null,
      emergencyContact: {
        name: null,
        relationship: null,
        phone: null
      },
      
      // System Fields
      patientId: this.generateUniqueId('patient'),
      userId: userId, // Link to Firebase Auth user
      role: 'patient',
      createdAt: new Date(),
      lastUpdated: new Date(),
      isActive: true,
      profileComplete: false,
      
      // Preferences
      preferredLanguage: 'English',
      notificationSettings: {
        appointmentReminders: true,
        healthTips: true,
        promotions: false
      }
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
        fullName: userData.fullName,
        role: userData.role,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isActive: true,
        profileSetup: false // Track if initial profile setup is complete
      });
      
      return {
        success: true,
        user: user,
        userData: documentData,
        message: 'Account created successfully'
      };
      
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  };

  // Sign in user - Enhanced with profile data
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
      
      // Update last login time
      await this.updateLastLogin(user.uid);
      
      // Get complete profile data
      const profileData = await this.getUserProfile(user.uid, userData.role);
      
      return {
        success: true,
        user: user,
        role: userData.role,
        profileData: profileData.data,
        message: 'Login successful'
      };
      
    } catch (error) {
      console.error('Signin error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  };

  // Update last login timestamp
  updateLastLogin = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lastLoginAt: new Date()
      });
    } catch (error) {
      console.error('Update last login error:', error);
      // Don't throw error as this is not critical
    }
  };

  // Sign out user
  signOut = async () => {
    try {
      await signOut(auth);
      return { 
        success: true,
        message: 'Logged out successfully'
      };
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

  // Get current user info
  getCurrentUser = () => {
    return auth.currentUser;
  };

  // Check if user is authenticated
  isAuthenticated = () => {
    return !!auth.currentUser;
  };

  // Get current user role
  getCurrentUserRole = async () => {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      return userDoc.data().role;
    } catch (error) {
      console.error('Get user role error:', error);
      throw new Error('Failed to get user role');
    }
  };

  // Reset password
  resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  };

  // Update user email
  updateUserEmail = async (newEmail) => {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      await updateEmail(user, newEmail);
      
      // Update email in user document
      await updateDoc(doc(db, 'users', user.uid), {
        email: newEmail,
        lastUpdated: new Date()
      });
      
      // Update email in profile document
      const role = await this.getCurrentUserRole();
      const collectionName = role === 'doctor' ? 'doctors' : 'patients';
      await updateDoc(doc(db, collectionName, user.uid), {
        email: newEmail,
        lastUpdated: new Date()
      });
      
      return {
        success: true,
        message: 'Email updated successfully'
      };
    } catch (error) {
      console.error('Update email error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  };

  // Delete user account
  deleteAccount = async () => {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const userId = user.uid;
      const role = await this.getCurrentUserRole();
      
      // Mark user as inactive instead of deleting (for data integrity)
      await updateDoc(doc(db, 'users', userId), {
        isActive: false,
        deletedAt: new Date()
      });
      
      const collectionName = role === 'doctor' ? 'doctors' : 'patients';
      await updateDoc(doc(db, collectionName, userId), {
        isActive: false,
        deletedAt: new Date()
      });
      
      // Sign out user
      await signOut(auth);
      
      return {
        success: true,
        message: 'Account deleted successfully'
      };
    } catch (error) {
      console.error('Delete account error:', error);
      throw new Error('Failed to delete account');
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
      case 'auth/requires-recent-login':
        return 'This action requires recent authentication. Please log in again.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials. Please check your email and password.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  // Validate email format
  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  validatePassword = (password) => {
    return {
      isValid: password.length >= 6,
      hasMinLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };
}

export default new AuthService();