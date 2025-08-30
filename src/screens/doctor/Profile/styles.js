import { StyleSheet, Platform, Dimensions, StatusBar } from 'react-native';

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

const styles = StyleSheet.create({
  // Container Styles
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

  // Loading and Error States
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

  // Header Styles
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

  // Profile Completion Indicator
  completionIndicator: {
    alignItems: 'center',
    marginVertical: hp(1),
  },
  completionText: {
    fontSize: normalize(12),
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: hp(0.5),
    textAlign: 'center',
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
  
  // Profile Completion Suggestions
  completionSuggestions: {
    alignItems: 'center',
    marginTop: hp(1),
    paddingHorizontal: wp(5),
  },
  suggestionsTitle: {
    fontSize: normalize(11),
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: hp(0.5),
    textAlign: 'center',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.3),
    borderRadius: normalize(15),
    marginBottom: hp(0.3),
    minWidth: wp(60),
    justifyContent: 'space-between',
  },
  suggestionText: {
    fontSize: normalize(10),
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },

  // Profile Image Section
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

  // Content Container
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },

  // Status Card
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

  // Section Styles
  sectionContainer: {
    marginBottom: hp(2.5),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginBottom: hp(1.5),
  },

  // Info Card Styles
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

  // Availability Card Styles
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

  // Settings Card Styles
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

export default styles;