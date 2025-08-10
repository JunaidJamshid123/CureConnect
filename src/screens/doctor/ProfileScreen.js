import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DoctorProfileService from '../../services/DoctorProfileService';
import AuthService from '../../services/AuthService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced responsive functions for better cross-platform support
const wp = (percentage) => (screenWidth * percentage) / 100;
const hp = (percentage) => (screenHeight * percentage) / 100;

// Improved normalize function for better scaling across devices
const normalize = (size) => {
  const scale = screenWidth / 375; // Base width 375 (iPhone X)
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  
  // For Android, slightly adjust for better readability
  return Math.round(newSize * 1.1);
};

// Get status bar height for proper positioning
const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return hp(5); // Default iOS status bar area
  }
  return StatusBar.currentHeight ? StatusBar.currentHeight + hp(1) : hp(3);
};

const ProfileScreen = ({ navigation }) => {
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

  // Render loading state
  if (loading && !doctorProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0BAB7D" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Render error state if no profile data
  if (!doctorProfile) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Ionicons name="alert-circle" size={normalize(50)} color="#FF6B6B" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDoctorProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0BAB7D" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          bounces={Platform.OS === 'ios'}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0BAB7D']}
              tintColor="#0BAB7D"
            />
          }
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.curvedHeader}>
              <View style={styles.topSection}>
                <View style={styles.headerNav}>
                  <TouchableOpacity 
                    style={styles.backButton} 
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={normalize(22)} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>My Profile</Text>
                  <TouchableOpacity 
                    style={styles.editButton} 
                    activeOpacity={0.8}
                    onPress={() => openEditModal('fullName', doctorProfile.fullName, 'Edit Name')}
                  >
                    <Ionicons name="pencil" size={normalize(20)} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                {/* Profile Completion Indicator */}
                <View style={styles.completionIndicator}>
                  <Text style={styles.completionText}>Profile {getProfileCompletion()}% complete</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${getProfileCompletion()}%` }]} />
                  </View>
                </View>
                
                {/* Profile Image Section */}
                <View style={styles.profileImageSection}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={
                        doctorProfile.profileImage 
                          ? { uri: doctorProfile.profileImage }
                          : require('../../../assets/icons/demo_doctor.jpg')
                      }
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.cameraButton} 
                      activeOpacity={0.8}
                      onPress={() => setImagePickerModal(true)}
                      disabled={updating}
                    >
                      {updating ? (
                        <ActivityIndicator size="small" color="#0BAB7D" />
                      ) : (
                        <Ionicons name="camera" size={normalize(16)} color="#0BAB7D" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.doctorName}>{doctorProfile.fullName || 'Doctor Name'}</Text>
                  <Text style={styles.doctorSpecialty}>{doctorProfile.specialization || 'Specialization'}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={normalize(14)} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {doctorProfile.ratings || 0} ({doctorProfile.totalReviews || 0} reviews)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusIcon, { backgroundColor: doctorProfile.isAvailable ? '#E8F5F3' : '#FFF0F0' }]}>
                    <Ionicons 
                      name={doctorProfile.isAvailable ? "checkmark-circle" : "close-circle"} 
                      size={normalize(20)} 
                      color={doctorProfile.isAvailable ? "#0BAB7D" : "#FF6B6B"} 
                    />
                  </View>
                  <Text style={styles.statusLabel}>Status</Text>
                  <TouchableOpacity onPress={toggleAvailability} activeOpacity={0.8} disabled={updating}>
                    {updating ? (
                      <ActivityIndicator size="small" color="#0BAB7D" />
                    ) : (
                      <Text style={[styles.statusValue, { color: doctorProfile.isAvailable ? '#0BAB7D' : '#FF6B6B' }]}>
                        {doctorProfile.isAvailable ? 'Available' : 'Unavailable'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.statusDivider} />
                <View style={styles.statusItem}>
                  <View style={[styles.statusIcon, { backgroundColor: '#F0F0FF' }]}>
                    <Ionicons name="time" size={normalize(20)} color="#6B73FF" />
                  </View>
                  <Text style={styles.statusLabel}>Experience</Text>
                  <TouchableOpacity 
                    onPress={() => openEditModal('experience', doctorProfile.experience, 'Edit Experience')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusValue}>{doctorProfile.experience || 'Not set'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.statusDivider} />
                <View style={styles.statusItem}>
                  <View style={[styles.statusIcon, { backgroundColor: '#FFF8E8' }]}>
                    <Ionicons name="cash" size={normalize(20)} color="#FFB800" />
                  </View>
                  <Text style={styles.statusLabel}>Fee</Text>
                  <TouchableOpacity 
                    onPress={() => openEditModal('consultationFee', doctorProfile.consultationFee, 'Edit Consultation Fee')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusValue}>
                      ${doctorProfile.consultationFee || '0'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Personal Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.infoCard}>
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('gender', doctorProfile.gender, 'Edit Gender')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="person" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Gender</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>{doctorProfile.gender || 'Not set'}</Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('phone', doctorProfile.phone, 'Edit Phone Number')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="call" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Phone</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>{doctorProfile.phone || 'Not set'}</Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('email', doctorProfile.email, 'Edit Email')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="mail" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Email</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>{doctorProfile.email || 'Not set'}</Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('address', doctorProfile.address, 'Edit Address')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="location" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Address</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue} numberOfLines={2}>
                      {doctorProfile.address || 'Not set'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Professional Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Professional Information</Text>
              <View style={styles.infoCard}>
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('specialization', doctorProfile.specialization, 'Edit Specialization')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="medical" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Specialization</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>{doctorProfile.specialization || 'Not set'}</Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('education', doctorProfile.education, 'Edit Education')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="school" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Education</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>{doctorProfile.education || 'Not set'}</Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('licenseNumber', doctorProfile.licenseNumber, 'Edit License Number')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="document-text" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>License Number</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>{doctorProfile.licenseNumber || 'Not set'}</Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('languagesSpoken', doctorProfile.languagesSpoken, 'Edit Languages (comma separated)')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="language" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Languages</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>
                      {doctorProfile.languagesSpoken && doctorProfile.languagesSpoken.length > 0 
                        ? doctorProfile.languagesSpoken.join(', ') 
                        : 'Not set'
                      }
                    </Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>

                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('about', doctorProfile.about, 'Edit About/Bio')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="information-circle" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>About</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue} numberOfLines={2}>
                      {doctorProfile.about || 'Add your bio...'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Availability Schedule */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Availability Schedule</Text>
              <View style={styles.availabilityCard}>
                <TouchableOpacity 
                  style={styles.availabilityDay}
                  onPress={() => openEditModal('availability.weekdays', doctorProfile.availability?.weekdays, 'Edit Weekdays Schedule')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dayText}>Monday - Friday</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                      {doctorProfile.availability?.weekdays || 'Not set'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(12)} color="#999999" style={{ marginLeft: wp(2) }} />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.availabilityDivider} />
                
                <TouchableOpacity 
                  style={styles.availabilityDay}
                  onPress={() => openEditModal('availability.saturday', doctorProfile.availability?.saturday, 'Edit Saturday Schedule')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dayText}>Saturday</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                      {doctorProfile.availability?.saturday || 'Not set'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(12)} color="#999999" style={{ marginLeft: wp(2) }} />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.availabilityDivider} />
                
                <TouchableOpacity 
                  style={styles.availabilityDay}
                  onPress={() => openEditModal('availability.sunday', doctorProfile.availability?.sunday, 'Edit Sunday Schedule')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dayText}>Sunday</Text>
                  <View style={styles.timeContainer}>
                    <Text style={[
                      styles.timeText, 
                      { color: doctorProfile.availability?.sunday === 'Closed' ? '#FF6B6B' : '#0BAB7D' }
                    ]}>
                      {doctorProfile.availability?.sunday || 'Not set'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(12)} color="#999999" style={{ marginLeft: wp(2) }} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Additional Medical Information */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.infoCard}>
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('medicalRegistrationNumber', doctorProfile.medicalRegistrationNumber, 'Edit Medical Registration Number')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="card" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Registration Number</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>
                      {doctorProfile.medicalRegistrationNumber || 'Not set'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>

                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('hospitalAffiliation', doctorProfile.hospitalAffiliation, 'Edit Hospital Affiliation')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="business" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Hospital/Clinic</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>
                      {doctorProfile.hospitalAffiliation || 'Not set'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>

                <View style={styles.infoDivider} />
                
                <TouchableOpacity 
                  style={styles.infoItem}
                  onPress={() => openEditModal('emergencyContact', doctorProfile.emergencyContact, 'Edit Emergency Contact')}
                  activeOpacity={0.8}
                >
                  <View style={styles.infoLeft}>
                    <Ionicons name="call-outline" size={normalize(18)} color="#666666" />
                    <Text style={styles.infoLabel}>Emergency Contact</Text>
                  </View>
                  <View style={styles.infoRight}>
                    <Text style={styles.infoValue}>
                      {doctorProfile.emergencyContact || 'Not set'}
                    </Text>
                    <Ionicons name="pencil" size={normalize(14)} color="#999999" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Settings */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <View style={styles.settingsCard}>
                <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="notifications-outline" size={normalize(20)} color="#666666" />
                    <Text style={styles.settingLabel}>Notifications</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={normalize(16)} color="#666666" />
                </TouchableOpacity>
                
                <View style={styles.settingDivider} />
                
                <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="shield-checkmark-outline" size={normalize(20)} color="#666666" />
                    <Text style={styles.settingLabel}>Privacy & Security</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={normalize(16)} color="#666666" />
                </TouchableOpacity>
                
                <View style={styles.settingDivider} />
                
                <TouchableOpacity style={styles.settingItem} activeOpacity={0.8}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="help-circle-outline" size={normalize(20)} color="#666666" />
                    <Text style={styles.settingLabel}>Help & Support</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={normalize(16)} color="#666666" />
                </TouchableOpacity>
                
                <View style={styles.settingDivider} />
                
                <TouchableOpacity 
                  style={styles.settingItem} 
                  activeOpacity={0.8}
                  onPress={handleLogout}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons name="log-out-outline" size={normalize(20)} color="#FF6B6B" />
                    <Text style={[styles.settingLabel, { color: '#FF6B6B' }]}>Logout</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={normalize(16)} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Edit Modal */}
        <Modal
          visible={editModal.visible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setEditModal({ ...editModal, visible: false })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{editModal.title}</Text>
              <TextInput
                style={[styles.modalInput, editModal.multiline && styles.multilineInput]}
                value={editModal.value}
                onChangeText={(text) => setEditModal({ ...editModal, value: text })}
                placeholder="Enter value..."
                placeholderTextColor="#999999"
                multiline={editModal.multiline}
                numberOfLines={editModal.multiline ? 4 : 1}
                keyboardType={editModal.keyboardType}
                autoCapitalize={editModal.keyboardType === 'email-address' ? 'none' : 'sentences'}
                autoCorrect={editModal.keyboardType !== 'email-address'}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setEditModal({ 
                    visible: false, 
                    field: '', 
                    value: '', 
                    title: '', 
                    multiline: false, 
                    keyboardType: 'default' 
                  })}
                  disabled={updating}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={handleSaveEdit}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Image Picker Modal */}
        <Modal
          visible={imagePickerModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setImagePickerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.imagePickerContainer}>
              <Text style={styles.imagePickerTitle}>Update Profile Picture</Text>
              
              <TouchableOpacity 
                style={styles.imagePickerOption}
                onPress={() => handleProfilePictureUpdate(true)}
                disabled={updating}
              >
                <Ionicons name="camera" size={normalize(24)} color="#0BAB7D" />
                <Text style={styles.imagePickerText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imagePickerOption}
                onPress={() => handleProfilePictureUpdate(false)}
                disabled={updating}
              >
                <Ionicons name="images" size={normalize(24)} color="#0BAB7D" />
                <Text style={styles.imagePickerText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              {doctorProfile.profileImage && (
                <TouchableOpacity 
                  style={styles.imagePickerOption}
                  onPress={async () => {
                    try {
                      setUpdating(true);
                      const result = await DoctorProfileService.removeProfilePicture();
                      if (result.success) {
                        showSuccess(result.message);
                        setImagePickerModal(false);
                      }
                    } catch (error) {
                      showError('Failed to remove profile picture');
                    } finally {
                      setUpdating(false);
                    }
                  }}
                  disabled={updating}
                >
                  <Ionicons name="trash" size={normalize(24)} color="#FF6B6B" />
                  <Text style={[styles.imagePickerText, { color: '#FF6B6B' }]}>Remove Photo</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.imagePickerCancel}
                onPress={() => setImagePickerModal(false)}
                disabled={updating}
              >
                <Text style={styles.imagePickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              {updating && (
                <View style={styles.imagePickerLoading}>
                  <ActivityIndicator size="small" color="#0BAB7D" />
                  <Text style={styles.imagePickerLoadingText}>Processing...</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(2),
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: normalize(16),
    color: '#666666',
    marginTop: hp(2),
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  errorText: {
    fontSize: normalize(16),
    color: '#666666',
    textAlign: 'center',
    marginVertical: hp(2),
  },
  retryButton: {
    backgroundColor: '#0BAB7D',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: normalize(10),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  headerContainer: {
    height: Platform.OS === 'ios' ? hp(40) : hp(42),
    position: 'relative',
  },
  curvedHeader: {
    backgroundColor: '#0BAB7D',
    height: '100%',
    borderBottomLeftRadius: normalize(25),
    borderBottomRightRadius: normalize(25),
    paddingHorizontal: wp(5),
    paddingTop: Platform.OS === 'ios' ? hp(1) : getStatusBarHeight(),
    ...Platform.select({
      ios: {
        shadowColor: '#0BAB7D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  topSection: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: hp(2),
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? hp(1) : hp(0.5),
  },
  backButton: {
    padding: wp(2),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    padding: wp(2),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionIndicator: {
    alignItems: 'center',
    marginVertical: hp(1),
  },
  completionText: {
    fontSize: normalize(12),
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: hp(0.5),
  },
  progressBar: {
    width: wp(60),
    height: hp(0.5),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: normalize(5),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(5),
  },
  profileImageSection: {
    alignItems: 'center',
    marginTop: hp(1),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: hp(1),
  },
  profileImage: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: wp(4),
    padding: wp(1.5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  doctorName: {
    fontSize: normalize(20),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.3),
  },
  doctorSpecialty: {
    fontSize: normalize(14),
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: hp(0.5),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: normalize(12),
    color: '#FFFFFF',
    marginLeft: wp(1),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(15),
    padding: wp(4),
    marginBottom: hp(2.5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  statusLabel: {
    fontSize: normalize(11),
    color: '#666666',
    marginBottom: hp(0.3),
  },
  statusValue: {
    fontSize: normalize(13),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
  },
  statusDivider: {
    width: 1,
    height: wp(10),
    backgroundColor: '#F0F0F0',
    marginHorizontal: wp(2),
  },
  sectionContainer: {
    marginBottom: hp(2.5),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginBottom: hp(1.5),
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: wp(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: normalize(12),
    color: '#666666',
    marginLeft: wp(3),
    flex: 1,
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  infoValue: {
    fontSize: normalize(12),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
    textAlign: 'right',
    marginRight: wp(2),
    maxWidth: wp(40),
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: hp(0.5),
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: wp(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  availabilityDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },
  dayText: {
    fontSize: normalize(12),
    color: '#333333',
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: normalize(12),
    color: '#0BAB7D',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  availabilityDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: hp(0.5),
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: wp(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: normalize(12),
    color: '#333333',
    marginLeft: wp(3),
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: hp(0.5),
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(15),
    padding: wp(6),
    width: wp(85),
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalTitle: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: normalize(10),
    padding: wp(4),
    fontSize: normalize(14),
    color: '#333333',
    marginBottom: hp(2.5),
    backgroundColor: '#F8F9FA',
    textAlignVertical: 'top',
  },
  multilineInput: {
    minHeight: hp(10),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  modalButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5),
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#0BAB7D',
  },
  cancelButtonText: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#666666',
  },
  saveButtonText: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
  },
  // Image Picker Modal Styles
  imagePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(15),
    padding: wp(6),
    width: wp(85),
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  imagePickerTitle: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: normalize(10),
    backgroundColor: '#F8F9FA',
    marginBottom: hp(1),
  },
  imagePickerText: {
    fontSize: normalize(14),
    color: '#333333',
    marginLeft: wp(3),
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  imagePickerCancel: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginTop: hp(1),
  },
  imagePickerCancelText: {
    fontSize: normalize(14),
    color: '#666666',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  imagePickerLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  imagePickerLoadingText: {
    fontSize: normalize(12),
    color: '#666666',
    marginLeft: wp(2),
  },
});

export default ProfileScreen;