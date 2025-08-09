import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  // State for doctor profile data
  const [doctorProfile, setDoctorProfile] = useState({
    fullName: 'Dr. Sarah Wilson',
    email: 'dr.sarah@hospital.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Cardiologist',
    gender: 'Female',
    experience: '8 Years',
    education: 'MBBS, MD Cardiology',
    licenseNumber: 'MED12345678',
    consultationFee: '50',
    languagesSpoken: ['English', 'Spanish', 'Hindi'],
    address: '123 Medical Center, New York, NY 10001',
    ratings: 4.8,
    totalReviews: 124,
    isAvailable: true,
    availability: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed'
    }
  });

  // Edit modal state
  const [editModal, setEditModal] = useState({
    visible: false,
    field: '',
    value: '',
    title: ''
  });

  // Handle opening edit modal
  const openEditModal = (field, currentValue, title) => {
    setEditModal({
      visible: true,
      field,
      value: Array.isArray(currentValue) ? currentValue.join(', ') : currentValue.toString(),
      title
    });
  };

  // Handle saving edited data
  const handleSaveEdit = () => {
    if (editModal.field === 'languagesSpoken') {
      // Convert comma-separated string back to array
      const languages = editModal.value.split(',').map(lang => lang.trim()).filter(lang => lang);
      setDoctorProfile(prev => ({
        ...prev,
        [editModal.field]: languages
      }));
    } else {
      setDoctorProfile(prev => ({
        ...prev,
        [editModal.field]: editModal.value
      }));
    }
    setEditModal({ visible: false, field: '', value: '', title: '' });
    
    // Here you can add Firebase update logic
    // updateDoctorProfileInFirebase(doctorProfile);
  };

  // Toggle availability status
  const toggleAvailability = () => {
    setDoctorProfile(prev => ({
      ...prev,
      isAvailable: !prev.isAvailable
    }));
    // Here you can add Firebase update logic
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0BAB7D" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          bounces={Platform.OS === 'ios'}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.curvedHeader}>
              <View style={styles.topSection}>
                <View style={styles.headerNav}>
                  <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
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
                
                {/* Profile Image Section */}
                <View style={styles.profileImageSection}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={require('../../../assets/icons/demo_doctor.jpg')}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
                      <Ionicons name="camera" size={normalize(16)} color="#0BAB7D" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.doctorName}>{doctorProfile.fullName}</Text>
                  <Text style={styles.doctorSpecialty}>{doctorProfile.specialization}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={normalize(14)} color="#FFD700" />
                    <Text style={styles.ratingText}>{doctorProfile.ratings} ({doctorProfile.totalReviews} reviews)</Text>
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
                  <TouchableOpacity onPress={toggleAvailability} activeOpacity={0.8}>
                    <Text style={[styles.statusValue, { color: doctorProfile.isAvailable ? '#0BAB7D' : '#FF6B6B' }]}>
                      {doctorProfile.isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
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
                    <Text style={styles.statusValue}>{doctorProfile.experience}</Text>
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
                    <Text style={styles.statusValue}>${doctorProfile.consultationFee}</Text>
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
                    <Text style={styles.infoValue}>{doctorProfile.gender}</Text>
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
                    <Text style={styles.infoValue}>{doctorProfile.phone}</Text>
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
                    <Text style={styles.infoValue}>{doctorProfile.email}</Text>
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
                    <Text style={styles.infoValue} numberOfLines={2}>{doctorProfile.address}</Text>
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
                    <Text style={styles.infoValue}>{doctorProfile.specialization}</Text>
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
                    <Text style={styles.infoValue}>{doctorProfile.education}</Text>
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
                    <Text style={styles.infoValue}>{doctorProfile.licenseNumber}</Text>
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
                    <Text style={styles.infoValue}>{doctorProfile.languagesSpoken.join(', ')}</Text>
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
                  onPress={() => openEditModal('availability.weekdays', doctorProfile.availability.weekdays, 'Edit Weekdays Schedule')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dayText}>Monday - Friday</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{doctorProfile.availability.weekdays}</Text>
                    <Ionicons name="pencil" size={normalize(12)} color="#999999" style={{ marginLeft: wp(2) }} />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.availabilityDivider} />
                
                <TouchableOpacity 
                  style={styles.availabilityDay}
                  onPress={() => openEditModal('availability.saturday', doctorProfile.availability.saturday, 'Edit Saturday Schedule')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dayText}>Saturday</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{doctorProfile.availability.saturday}</Text>
                    <Ionicons name="pencil" size={normalize(12)} color="#999999" style={{ marginLeft: wp(2) }} />
                  </View>
                </TouchableOpacity>
                
                <View style={styles.availabilityDivider} />
                
                <TouchableOpacity 
                  style={styles.availabilityDay}
                  onPress={() => openEditModal('availability.sunday', doctorProfile.availability.sunday, 'Edit Sunday Schedule')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dayText}>Sunday</Text>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.timeText, { color: doctorProfile.availability.sunday === 'Closed' ? '#FF6B6B' : '#0BAB7D' }]}>
                      {doctorProfile.availability.sunday}
                    </Text>
                    <Ionicons name="pencil" size={normalize(12)} color="#999999" style={{ marginLeft: wp(2) }} />
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
                  onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout pressed') }
                  ])}
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
                style={styles.modalInput}
                value={editModal.value}
                onChangeText={(text) => setEditModal({ ...editModal, value: text })}
                placeholder="Enter value..."
                placeholderTextColor="#999999"
                multiline={editModal.field === 'address'}
                numberOfLines={editModal.field === 'address' ? 3 : 1}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setEditModal({ ...editModal, visible: false })}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
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
  headerContainer: {
    height: Platform.OS === 'ios' ? hp(35) : hp(37),
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
  profileImageSection: {
    alignItems: 'center',
    marginTop: hp(2),
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
});
export default ProfileScreen;