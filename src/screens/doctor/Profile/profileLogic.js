import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import DoctorProfileService from '../../../services/DoctorProfileService';
import AuthService from '../../../services/AuthService';

export const useProfileLogic = () => {
  // State management
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profileSubscription, setProfileSubscription] = useState(null);

  // Edit modal state
  const [editModal, setEditModal] = useState({
    visible: false,
    field: '',
    value: '',
    title: '',
    multiline: false,
    keyboardType: 'default'
  });

  // Image picker modal state
  const [imagePickerModal, setImagePickerModal] = useState(false);

  // Load doctor profile on component mount
  useEffect(() => {
    loadDoctorProfile();
    setupProfileSubscription();
    
    return () => {
      // Cleanup subscription
      if (profileSubscription) {
        profileSubscription();
      }
    };
  }, []);

  // Setup real-time profile subscription
  const setupProfileSubscription = () => {
    try {
      const unsubscribe = DoctorProfileService.subscribeToProfile((result) => {
        if (result.success) {
          setDoctorProfile(result.data);
          setLoading(false);
        } else {
          console.error('Profile subscription error:', result.error);
          showError('Failed to sync profile data');
        }
      });
      setProfileSubscription(() => unsubscribe);
    } catch (error) {
      console.error('Setup subscription error:', error);
      showError('Failed to setup real-time updates');
    }
  };

  // Load doctor profile
  const loadDoctorProfile = async () => {
    try {
      setLoading(true);
      const result = await DoctorProfileService.getDoctorProfile();
      
      if (result.success) {
        setDoctorProfile(result.data);
      } else {
        showError('Failed to load profile');
      }
    } catch (error) {
      console.error('Load profile error:', error);
      showError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDoctorProfile();
    setRefreshing(false);
  }, []);

  // Show error alert
  const showError = (message) => {
    Alert.alert('Error', message, [{ text: 'OK' }]);
  };

  // Show success alert
  const showSuccess = (message) => {
    Alert.alert('Success', message, [{ text: 'OK' }]);
  };

  // Handle opening edit modal with proper field configuration
  const openEditModal = (field, currentValue, title) => {
    let value = currentValue;
    let keyboardType = 'default';
    let multiline = false;

    // Handle different field types
    if (Array.isArray(currentValue)) {
      value = currentValue.join(', ');
    } else if (currentValue === null || currentValue === undefined) {
      value = '';
    } else {
      value = currentValue.toString();
    }

    // Set keyboard type based on field
    if (field === 'phone') {
      keyboardType = 'phone-pad';
    } else if (field === 'email') {
      keyboardType = 'email-address';
    } else if (field === 'consultationFee' || field === 'experience') {
      keyboardType = 'numeric';
    }

    // Set multiline for longer text fields
    if (field === 'address' || field === 'education' || field === 'about') {
      multiline = true;
    }

    setEditModal({
      visible: true,
      field,
      value,
      title,
      multiline,
      keyboardType
    });
  };

  // Handle saving edited data
  const handleSaveEdit = async () => {
    if (!editModal.value.trim()) {
      showError('Please enter a valid value');
      return;
    }

    try {
      setUpdating(true);
      
      let valueToSave = editModal.value.trim();
      
      // Handle special field types
      if (editModal.field === 'languagesSpoken') {
        await DoctorProfileService.updateLanguages(valueToSave);
      } else if (editModal.field.includes('.')) {
        // Handle nested fields like availability.weekdays
        await DoctorProfileService.updateProfileField(editModal.field, valueToSave);
      } else {
        // Handle regular fields
        const updateData = { [editModal.field]: valueToSave };
        await DoctorProfileService.updateDoctorProfile(updateData);
      }

      setEditModal({ visible: false, field: '', value: '', title: '', multiline: false, keyboardType: 'default' });
      showSuccess('Profile updated successfully');
      
    } catch (error) {
      console.error('Save edit error:', error);
      showError(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Toggle availability status
  const toggleAvailability = async () => {
    try {
      setUpdating(true);
      const result = await DoctorProfileService.toggleAvailability();
      
      if (result.success) {
        showSuccess(result.message);
      }
    } catch (error) {
      console.error('Toggle availability error:', error);
      showError('Failed to update availability status');
    } finally {
      setUpdating(false);
    }
  };

  // Handle profile picture update
  const handleProfilePictureUpdate = async (useCamera = false) => {
    try {
      setUpdating(true);
      const result = await DoctorProfileService.updateProfilePictureFlow(useCamera);
      
      if (result.success) {
        showSuccess(result.message);
        setImagePickerModal(false);
      }
    } catch (error) {
      console.error('Profile picture update error:', error);
      showError(error.message || 'Failed to update profile picture');
    } finally {
      setUpdating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await AuthService.signOut();
              // Navigation logic here
              // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (error) {
              showError('Failed to logout');
            }
          }
        }
      ]
    );
  };

  // Get profile completion percentage
  const getProfileCompletion = () => {
    if (!doctorProfile) return 0;
    
    const requiredFields = [
      'fullName', 'email', 'phone', 'specialization', 'gender',
      'experience', 'education', 'licenseNumber', 'consultationFee'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = doctorProfile[field];
      return value && value !== '' && value !== null;
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  return {
    // State
    doctorProfile,
    loading,
    refreshing,
    updating,
    editModal,
    imagePickerModal,
    
    // State setters
    setEditModal,
    setImagePickerModal,
    
    // Functions
    loadDoctorProfile,
    onRefresh,
    showError,
    showSuccess,
    openEditModal,
    handleSaveEdit,
    toggleAvailability,
    handleProfilePictureUpdate,
    handleLogout,
    getProfileCompletion
  };
};