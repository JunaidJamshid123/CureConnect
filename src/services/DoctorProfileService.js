// services/DoctorProfileService.js
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/FirebaeConfig';
import * as ImagePicker from 'expo-image-picker';

// Debug imports
console.log('Firebase imports check:', { doc, updateDoc, getDoc, onSnapshot });
console.log('ImagePicker check:', ImagePicker);

class DoctorProfileService {
  constructor() {
    // Debug imports on service initialization
    console.log('DoctorProfileService initialized');
    console.log('Firebase imports available:', { doc, updateDoc, getDoc, onSnapshot });
    console.log('ImagePicker available:', ImagePicker);
    console.log('ImagePicker methods:', Object.keys(ImagePicker));
  }
  
  // Cloudinary configuration - Replace with your actual credentials
  CLOUDINARY_CONFIG = {
    cloudName: 'db7pfhkag', // Replace with your Cloudinary cloud name
    uploadPreset: 'doctor_profiles', // Replace with your unsigned upload preset
    apiKey: '274134618364264', // Replace with your API key
  };

  // Validate Cloudinary configuration
  validateCloudinaryConfig = () => {
    if (!this.CLOUDINARY_CONFIG.cloudName || !this.CLOUDINARY_CONFIG.uploadPreset) {
      throw new Error('Invalid Cloudinary configuration. Please check cloudName and uploadPreset.');
    }
    
    console.log('Cloudinary config validated:', {
      cloudName: this.CLOUDINARY_CONFIG.cloudName,
      uploadPreset: this.CLOUDINARY_CONFIG.uploadPreset
    });
  };

  // Get current authenticated doctor ID
  getCurrentDoctorId = () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }
    return user.uid;
  };

  // Get doctor profile data
  getDoctorProfile = async () => {
    try {
      console.log('Firebase imports check:', { doc, getDoc, updateDoc, onSnapshot });
      console.log('Firebase config check:', { auth, db });
      
      const doctorId = this.getCurrentDoctorId();
      const doctorRef = doc(db, 'doctors', doctorId);
      const doctorDoc = await getDoc(doctorRef);

      if (!doctorDoc.exists()) {
        throw new Error('Doctor profile not found');
      }

      return {
        success: true,
        data: doctorDoc.data()
      };
    } catch (error) {
      console.error('Get doctor profile error:', error);
      throw new Error(error.message || 'Failed to fetch doctor profile');
    }
  };

  // Real-time listener for doctor profile updates
  subscribeToProfile = (callback) => {
    try {
      const doctorId = this.getCurrentDoctorId();
      const doctorRef = doc(db, 'doctors', doctorId);
      
      return onSnapshot(doctorRef, (doc) => {
        if (doc.exists()) {
          callback({
            success: true,
            data: doc.data()
          });
        } else {
          callback({
            success: false,
            error: 'Doctor profile not found'
          });
        }
      }, (error) => {
        console.error('Profile subscription error:', error);
        callback({
          success: false,
          error: error.message
        });
      });
    } catch (error) {
      console.error('Subscribe to profile error:', error);
      throw new Error('Failed to subscribe to profile updates');
    }
  };

  // Update doctor profile
  updateDoctorProfile = async (updateData) => {
    try {
      const doctorId = this.getCurrentDoctorId();
      const doctorRef = doc(db, 'doctors', doctorId);

      // Add timestamp for last update
      const dataToUpdate = {
        ...updateData,
        lastUpdated: new Date()
      };

      // Try to use updateDoc, fallback to setDoc if needed
      try {
        await updateDoc(doctorRef, dataToUpdate);
      } catch (updateError) {
        console.warn('updateDoc failed, trying alternative method:', updateError);
        // Fallback: import and use setDoc with merge option
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doctorRef, dataToUpdate, { merge: true });
      }

      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update doctor profile error:', error);
      throw new Error('Failed to update profile');
    }
  };

  // Update specific field in doctor profile
  updateProfileField = async (field, value) => {
    try {
      const updateData = {};
      
      // Handle nested fields (like availability.weekdays)
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        
        // Get current data to preserve other nested fields
        const currentProfile = await this.getDoctorProfile();
        const currentNestedData = currentProfile.data[parentField] || {};
        
        updateData[parentField] = {
          ...currentNestedData,
          [childField]: value
        };
      } else {
        updateData[field] = value;
      }

      return await this.updateDoctorProfile(updateData);
    } catch (error) {
      console.error('Update profile field error:', error);
      throw new Error(`Failed to update ${field}`);
    }
  };

  // Upload image to Cloudinary
  uploadImageToCloudinary = async (imageUri) => {
    try {
      // Validate configuration first
      this.validateCloudinaryConfig();
      
      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `doctor_profile_${Date.now()}.jpg`,
      });
      formData.append('upload_preset', this.CLOUDINARY_CONFIG.uploadPreset);
      
      // For unsigned uploads, only these parameters are allowed:
      // upload_preset, callback, public_id, folder, asset_folder, tags, 
      // context, metadata, face_coordinates, custom_coordinates, source, 
      // filename_override, manifest_transformation, manifest_json, template, 
      // template_vars, regions, public_id_prefix
      
      // Add folder for better organization
      formData.append('folder', 'doctor_profiles');
      
      // Add tags for easier management
      formData.append('tags', 'profile,doctor');

      console.log('Uploading to Cloudinary with preset:', this.CLOUDINARY_CONFIG.uploadPreset);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Cloudinary response status:', response.status);

      const result = await response.json();

      if (response.ok && result.secure_url) {
        // If you need transformations, you can apply them to the URL after upload
        // For now, we'll return the original URL
        return {
          success: true,
          url: result.secure_url,
          publicId: result.public_id
        };
      } else {
        console.error('Cloudinary response error:', result);
        throw new Error(result.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to cloud storage');
    }
  };

  // Pick image from device
  pickImage = async (options = {}) => {
    try {
      console.log('ImagePicker check:', ImagePicker);
      console.log('ImagePicker methods:', Object.keys(ImagePicker));
      
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library is required');
      }

      const defaultOptions = {
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile pictures
        quality: 0.8,
        exif: false,
      };
      
      // Try to add mediaTypes if available
      if (ImagePicker.MediaTypeOptions) {
        defaultOptions.mediaTypes = ImagePicker.MediaTypeOptions.Images;
      } else if (ImagePicker.MediaType) {
        defaultOptions.mediaTypes = ImagePicker.MediaType.Images;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        ...defaultOptions,
        ...options
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return {
          success: true,
          imageUri: result.assets[0].uri,
          imageInfo: result.assets[0]
        };
      } else {
        return {
          success: false,
          message: 'Image selection cancelled'
        };
      }
    } catch (error) {
      console.error('Pick image error:', error);
      throw new Error(error.message || 'Failed to pick image');
    }
  };

  // Take photo with camera
  takePhoto = async (options = {}) => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access camera is required');
      }

      const defaultOptions = {
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
        exif: false,
      };

      const result = await ImagePicker.launchCameraAsync({
        ...defaultOptions,
        ...options
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return {
          success: true,
          imageUri: result.assets[0].uri,
          imageInfo: result.assets[0]
        };
      } else {
        return {
          success: false,
          message: 'Photo capture cancelled'
        };
      }
    } catch (error) {
      console.error('Take photo error:', error);
      throw new Error(error.message || 'Failed to capture photo');
    }
  };

  // Update profile picture
  updateProfilePicture = async (imageUri) => {
    try {
      // Upload image to Cloudinary
      const uploadResult = await this.uploadImageToCloudinary(imageUri);
      
      if (!uploadResult.success) {
        throw new Error('Failed to upload image');
      }

      // Update profile with new image URL
      await this.updateProfileField('profileImage', uploadResult.url);

      return {
        success: true,
        imageUrl: uploadResult.url,
        message: 'Profile picture updated successfully'
      };
    } catch (error) {
      console.error('Update profile picture error:', error);
      throw new Error('Failed to update profile picture');
    }
  };

  // Complete profile picture update flow (pick + upload + save)
  updateProfilePictureFlow = async (useCamera = false) => {
    try {
      // Step 1: Pick or capture image
      const imageResult = useCamera 
        ? await this.takePhoto()
        : await this.pickImage();

      if (!imageResult.success) {
        return imageResult;
      }

      // Step 2: Upload and update profile
      const updateResult = await this.updateProfilePicture(imageResult.imageUri);
      
      return updateResult;
    } catch (error) {
      console.error('Profile picture flow error:', error);
      throw new Error(error.message || 'Failed to update profile picture');
    }
  };

  // Update availability status
  toggleAvailability = async () => {
    try {
      const currentProfile = await this.getDoctorProfile();
      const newStatus = !currentProfile.data.isAvailable;
      
      await this.updateProfileField('isAvailable', newStatus);
      
      return {
        success: true,
        isAvailable: newStatus,
        message: `Status updated to ${newStatus ? 'Available' : 'Unavailable'}`
      };
    } catch (error) {
      console.error('Toggle availability error:', error);
      throw new Error('Failed to update availability status');
    }
  };

  // Update languages (from comma-separated string to array)
  updateLanguages = async (languagesString) => {
    try {
      const languagesArray = languagesString
        .split(',')
        .map(lang => lang.trim())
        .filter(lang => lang.length > 0);
      
      await this.updateProfileField('languagesSpoken', languagesArray);
      
      return {
        success: true,
        languages: languagesArray,
        message: 'Languages updated successfully'
      };
    } catch (error) {
      console.error('Update languages error:', error);
      throw new Error('Failed to update languages');
    }
  };

  // Validate profile completeness
  validateProfileCompleteness = (profileData) => {
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'specialization',
      'gender',
      'experience',
      'education',
      'licenseNumber',
      'consultationFee'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = profileData[field];
      return !value || value === '' || value === null;
    });

    const completionPercentage = Math.round(
      ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
    );

    return {
      isComplete: missingFields.length === 0,
      completionPercentage,
      missingFields,
      requiredFields
    };
  };

  // Get profile completion status
  getProfileCompletionStatus = async () => {
    try {
      const profileResult = await this.getDoctorProfile();
      const validation = this.validateProfileCompleteness(profileResult.data);
      
      return {
        success: true,
        ...validation,
        profileData: profileResult.data
      };
    } catch (error) {
      console.error('Get profile completion error:', error);
      throw new Error('Failed to check profile completion');
    }
  };

  // Batch update multiple fields
  batchUpdateProfile = async (updates) => {
    try {
      const processedUpdates = {};
      
      // Process each update
      for (const [key, value] of Object.entries(updates)) {
        if (key === 'languagesSpoken' && typeof value === 'string') {
          // Handle languages specially
          processedUpdates[key] = value
            .split(',')
            .map(lang => lang.trim())
            .filter(lang => lang.length > 0);
        } else if (key.includes('.')) {
          // Handle nested fields
          const [parentField, childField] = key.split('.');
          if (!processedUpdates[parentField]) {
            processedUpdates[parentField] = {};
          }
          processedUpdates[parentField][childField] = value;
        } else {
          processedUpdates[key] = value;
        }
      }

      await this.updateDoctorProfile(processedUpdates);
      
      return {
        success: true,
        message: 'Profile updated successfully',
        updatedFields: Object.keys(updates)
      };
    } catch (error) {
      console.error('Batch update error:', error);
      throw new Error('Failed to update multiple fields');
    }
  };

  // Delete profile picture (set to null)
  removeProfilePicture = async () => {
    try {
      await this.updateProfileField('profileImage', null);
      
      return {
        success: true,
        message: 'Profile picture removed successfully'
      };
    } catch (error) {
      console.error('Remove profile picture error:', error);
      throw new Error('Failed to remove profile picture');
    }
  };

  // Apply transformations to Cloudinary URL (post-upload)
  applyImageTransformations = (originalUrl, transformations = {}) => {
    try {
      if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
        return originalUrl;
      }

      // Default transformations for profile pictures
      const defaultTransformations = {
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      };

      const finalTransformations = { ...defaultTransformations, ...transformations };
      
      // Build transformation string
      const transformationString = Object.entries(finalTransformations)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');

      // Insert transformations into the URL
      const urlParts = originalUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex !== -1) {
        urlParts.splice(uploadIndex + 1, 0, transformationString);
        return urlParts.join('/');
      }

      return originalUrl;
    } catch (error) {
      console.error('Apply transformations error:', error);
      return originalUrl;
    }
  };

  // Get optimized profile image URL with transformations
  getOptimizedProfileImageUrl = (originalUrl, size = 400) => {
    return this.applyImageTransformations(originalUrl, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto'
    });
  };
}

// Create service instance with error handling
let serviceInstance;
try {
  serviceInstance = new DoctorProfileService();
  console.log('DoctorProfileService created successfully');
} catch (error) {
  console.error('Error creating DoctorProfileService:', error);
  // Create a minimal service instance
  serviceInstance = {
    getDoctorProfile: async () => ({ success: false, error: 'Service initialization failed' }),
    updateDoctorProfile: async () => ({ success: false, error: 'Service initialization failed' }),
    // Add other methods as needed
  };
}

export default serviceInstance;