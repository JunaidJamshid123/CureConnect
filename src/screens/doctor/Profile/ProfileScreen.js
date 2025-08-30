import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfileLogic } from './profileLogic';
import styles from './styles';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced responsive functions for better cross-platform support
const wp = (percentage) => (screenWidth * percentage) / 100;

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

const ProfileScreen = ({ navigation }) => {
  const {
    // State
    doctorProfile,
    loading,
    refreshing,
    updating,
    editModal,
    imagePickerModal,
    
    // State setters
    setImagePickerModal,
    
    // Functions
    loadDoctorProfile,
    onRefresh,
    openEditModal,
    handleSaveEdit,
    toggleAvailability,
    handleProfilePictureUpdate,
    handleRemoveProfilePicture,
    handleLogout,
    getProfileCompletion,
    getProfileCompletionSuggestions,
    closeEditModal,
    closeImagePickerModal,
    updateEditModalValue,
    validateProfileData,
    handleSaveEditWithValidation
  } = useProfileLogic(navigation);

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
                
                {/* Profile Completion Suggestions */}
                {getProfileCompletion() < 100 && (
                  <View style={styles.completionSuggestions}>
                    <Text style={styles.suggestionsTitle}>Complete your profile:</Text>
                    {getProfileCompletionSuggestions().slice(0, 3).map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => openEditModal(suggestion.field, doctorProfile[suggestion.field], `Edit ${suggestion.label}`)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.suggestionText}>
                          • {suggestion.label}
                        </Text>
                        <Ionicons name="pencil" size={normalize(12)} color="#FFFFFF" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {/* Profile Image Section */}
                <View style={styles.profileImageSection}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={
                        doctorProfile.profileImage 
                          ? { uri: doctorProfile.profileImage }
                          : require('../../../../assets/icons/demo_doctor.jpg')
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
          onRequestClose={closeEditModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{editModal.title}</Text>
              <TextInput
                style={[styles.modalInput, editModal.multiline && styles.multilineInput]}
                value={editModal.value}
                onChangeText={updateEditModalValue}
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
                  onPress={closeEditModal}
                  disabled={updating}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={handleSaveEditWithValidation}
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
          onRequestClose={closeImagePickerModal}
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
                  onPress={handleRemoveProfilePicture}
                  disabled={updating}
                >
                  <Ionicons name="trash" size={normalize(24)} color="#FF6B6B" />
                  <Text style={[styles.imagePickerText, { color: '#FF6B6B' }]}>Remove Photo</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.imagePickerCancel}
                onPress={closeImagePickerModal}
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

export default ProfileScreen;