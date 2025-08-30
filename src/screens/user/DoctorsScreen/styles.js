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
  },

  // Header Styles
  headerContainer: {
    backgroundColor: '#0BAB7D',
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : hp(2),
    paddingBottom: hp(2),
    paddingHorizontal: wp(5),
    borderBottomLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? hp(1) : hp(0.5),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: normalize(12),
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: hp(0.3),
  },

  // Search Section
  searchSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp(5),
    marginTop: hp(-2),
    borderRadius: normalize(15),
    padding: wp(4),
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: normalize(12),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(14),
    color: '#333333',
    marginLeft: wp(2),
  },
  searchIcon: {
    color: '#666666',
  },

  // Filter Section
  filterSection: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  filterTitle: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
    marginBottom: hp(1),
  },
  filterScrollView: {
    flexDirection: 'row',
    paddingHorizontal: wp(1),
  },
  filterChip: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: normalize(20),
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#0BAB7D',
    borderColor: '#0BAB7D',
  },
  filterChipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  filterChipText: {
    fontSize: normalize(12),
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextInactive: {
    color: '#666666',
  },

  // Content Section
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  loadingText: {
    fontSize: normalize(16),
    color: '#666666',
    marginTop: hp(2),
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
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

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyIcon: {
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: normalize(18),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: normalize(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: normalize(20),
  },

  // Doctor Card Styles
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(15),
    marginBottom: hp(2),
    overflow: 'hidden',
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
  doctorCardHeader: {
    flexDirection: 'row',
    padding: wp(4),
  },
  doctorImageContainer: {
    marginRight: wp(4),
  },
  doctorImage: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  doctorInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  doctorName: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginBottom: hp(0.3),
  },
  doctorSpecialization: {
    fontSize: normalize(12),
    color: '#0BAB7D',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginBottom: hp(0.3),
  },
  doctorExperience: {
    fontSize: normalize(11),
    color: '#666666',
    marginBottom: hp(0.5),
  },
  doctorRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorRating: {
    fontSize: normalize(11),
    color: '#666666',
    marginLeft: wp(0.5),
  },
  doctorStatusContainer: {
    alignItems: 'flex-end',
  },
  doctorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: normalize(12),
    marginBottom: hp(0.5),
  },
  doctorStatusAvailable: {
    backgroundColor: '#E8F5F3',
  },
  doctorStatusUnavailable: {
    backgroundColor: '#FFF0F0',
  },
  doctorStatusText: {
    fontSize: normalize(10),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginLeft: wp(0.5),
  },
  doctorStatusTextAvailable: {
    color: '#0BAB7D',
  },
  doctorStatusTextUnavailable: {
    color: '#FF6B6B',
  },
  doctorFee: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
  },

  // Doctor Card Footer
  doctorCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  doctorLanguages: {
    flex: 1,
  },
  doctorLanguagesText: {
    fontSize: normalize(10),
    color: '#666666',
  },
  doctorNextAvailable: {
    alignItems: 'flex-end',
  },
  doctorNextAvailableText: {
    fontSize: normalize(10),
    color: '#0BAB7D',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  doctorActionButton: {
    backgroundColor: '#0BAB7D',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: normalize(8),
    marginLeft: wp(2),
  },
  doctorActionButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(11),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },

  // Doctor Details Section
  doctorDetailsSection: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
  },
  doctorAddress: {
    fontSize: normalize(11),
    color: '#666666',
    marginBottom: hp(0.5),
  },
  doctorLanguagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(0.5),
  },
  doctorLanguageTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: normalize(8),
    marginRight: wp(1),
    marginBottom: hp(0.2),
  },
  doctorLanguageTagText: {
    fontSize: normalize(9),
    color: '#666666',
  },

  // Results Count
  resultsCount: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
  },
  resultsCountText: {
    fontSize: normalize(12),
    color: '#666666',
  },
});

export default styles; 