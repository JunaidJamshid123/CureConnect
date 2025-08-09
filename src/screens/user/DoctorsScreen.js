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
  FlatList,
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

const DoctorsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Sample doctors data - updated according to schema
  const doctors = [
    {
      id: 1,
      fullName: 'Dr. Sarah Wilson',
      specialization: 'Cardiologist',
      experience: '8 Years',
      ratings: 4.8,
      totalReviews: 124,
      consultationFee: '50',
      profileImage: require('../../../assets/icons/demo_doctor.jpg'),
      isAvailable: true,
      languagesSpoken: ['English', 'Spanish'],
      address: '123 Medical Center, New York, NY 10001',
      nextAvailable: 'Today, 2:30 PM',
      email: 'dr.sarah@hospital.com',
      phone: '+1 (555) 123-4567',
      gender: 'Female',
      education: 'MBBS, MD Cardiology',
      licenseNumber: 'MED12345678',
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
        { day: 'Friday', startTime: '09:00', endTime: '17:00' },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00' }
      ],
      userId: 'user123',
      role: 'doctor',
      createdAt: new Date()
    },
    {
      id: 2,
      fullName: 'Dr. Michael Chen',
      specialization: 'Dermatologist',
      experience: '12 Years',
      ratings: 4.9,
      totalReviews: 89,
      consultationFee: '65',
      profileImage: require('../../../assets/icons/demo_doctor.jpg'),
      isAvailable: true,
      languagesSpoken: ['English', 'Mandarin'],
      address: '456 Downtown Skin Clinic, NYC',
      nextAvailable: 'Tomorrow, 10:00 AM',
      email: 'dr.chen@skincare.com',
      phone: '+1 (555) 987-6543',
      gender: 'Male',
      education: 'MBBS, MD Dermatology',
      licenseNumber: 'MED87654321',
      availability: [
        { day: 'Monday', startTime: '10:00', endTime: '18:00' },
        { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
        { day: 'Wednesday', startTime: '10:00', endTime: '18:00' },
        { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
        { day: 'Friday', startTime: '10:00', endTime: '18:00' }
      ],
      userId: 'user456',
      role: 'doctor',
      createdAt: new Date()
    },
    {
      id: 3,
      fullName: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrician',
      experience: '6 Years',
      ratings: 4.7,
      totalReviews: 156,
      consultationFee: '45',
      profileImage: require('../../../assets/icons/demo_doctor.jpg'),
      isAvailable: false,
      languagesSpoken: ['English', 'Spanish'],
      address: '789 Children\'s Health Center, NYC',
      nextAvailable: 'Monday, 9:00 AM',
      email: 'dr.rodriguez@childcare.com',
      phone: '+1 (555) 456-7890',
      gender: 'Female',
      education: 'MBBS, MD Pediatrics',
      licenseNumber: 'MED13579246',
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
        { day: 'Friday', startTime: '09:00', endTime: '15:00' }
      ],
      userId: 'user789',
      role: 'doctor',
      createdAt: new Date()
    },
    {
      id: 4,
      fullName: 'Dr. James Thompson',
      specialization: 'Orthopedist',
      experience: '15 Years',
      ratings: 4.9,
      totalReviews: 203,
      consultationFee: '80',
      profileImage: require('../../../assets/icons/demo_doctor.jpg'),
      isAvailable: true,
      languagesSpoken: ['English'],
      address: '321 Orthopedic Center, NYC',
      nextAvailable: 'Today, 4:00 PM',
      email: 'dr.thompson@orthocenter.com',
      phone: '+1 (555) 321-7890',
      gender: 'Male',
      education: 'MBBS, MS Orthopedics',
      licenseNumber: 'MED98765432',
      availability: [
        { day: 'Monday', startTime: '08:00', endTime: '16:00' },
        { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
        { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
        { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
        { day: 'Friday', startTime: '08:00', endTime: '14:00' }
      ],
      userId: 'user321',
      role: 'doctor',
      createdAt: new Date()
    }
  ];

  const quickFilters = [
    { id: 'All', label: 'All', icon: 'medical' },
    { id: 'Available', label: 'Available', icon: 'checkmark-circle' },
    { id: 'Top Rated', label: 'Top Rated', icon: 'star' },
    { id: 'Nearby', label: 'Nearby', icon: 'location' }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === '' ||
                          doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' ||
                         (activeFilter === 'Available' && doctor.isAvailable) ||
                         (activeFilter === 'Top Rated' && doctor.ratings >= 4.8) ||
                         (activeFilter === 'Nearby');
    
    return matchesSearch && matchesFilter;
  });

  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.doctorCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
    >
      <View style={styles.doctorCardContent}>
        <View style={styles.doctorHeader}>
          <View style={styles.doctorImageContainer}>
            <Image source={item.profileImage} style={styles.doctorImage} />
            <View style={[
              styles.availabilityDot,
              { backgroundColor: item.isAvailable ? '#0BAB7D' : '#FF6B6B' }
            ]} />
          </View>
          
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{item.fullName}</Text>
            <Text style={styles.doctorSpecialty}>{item.specialization}</Text>
            <View style={styles.experienceContainer}>
              <Ionicons name="time-outline" size={normalize(10)} color="#666666" />
              <Text style={styles.experienceText}>{item.experience} Experience</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={normalize(10)} color="#666666" />
              <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>
            </View>
          </View>
          <View style={styles.doctorActions}>
            <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.8}>
              <Ionicons name="heart-outline" size={normalize(16)} color="#666666" />
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={normalize(12)} color="#FFD700" />
              <Text style={styles.ratingText}>{item.ratings}</Text>
              <Text style={styles.reviewsText}>({item.totalReviews})</Text>
            </View>
          </View>
        </View>
        <View style={styles.doctorFooter}>
          <View style={styles.availabilitySection}>
            <View style={styles.languageContainer}>
              <Ionicons name="language-outline" size={normalize(10)} color="#666666" />
              <Text style={styles.languageText}>{item.languagesSpoken.join(', ')}</Text>
            </View>
            <View style={styles.nextAvailableContainer}>
              <Text style={styles.nextAvailableLabel}>Next Available:</Text>
              <Text style={[
                styles.nextAvailableTime,
                { color: item.isAvailable ? '#0BAB7D' : '#FF6B6B' }
              ]}>
                {item.nextAvailable}
              </Text>
            </View>
          </View>
          <View style={styles.bookingSection}>
            <View style={styles.feeContainer}>
              <Text style={styles.feeLabel}>Fee</Text>
              <Text style={styles.feeAmount}>${item.consultationFee}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.bookButton,
                !item.isAvailable && styles.disabledBookButton
              ]}
              activeOpacity={0.8}
              disabled={!item.isAvailable}
            >
              <Text style={[
                styles.bookButtonText,
                !item.isAvailable && styles.disabledBookButtonText
              ]}>
                {item.isAvailable ? 'Book Now' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0BAB7D" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
          
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Find Doctors</Text>
                <Text style={styles.headerSubtitle}>{filteredDoctors.length} doctors found</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={normalize(20)} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
          {/* Enhanced Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={normalize(18)} color="#0BAB7D" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search doctors, specialties, location..."
                placeholderTextColor="#A0A0A0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.8}>
                  <Ionicons name="close-circle" size={normalize(18)} color="#666666" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          bounces={Platform.OS === 'ios'}
        >
          {/* Quick Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}
            >
              {quickFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    activeFilter === filter.id && styles.activeFilterChip
                  ]}
                  onPress={() => setActiveFilter(filter.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={filter.icon}
                    size={normalize(14)}
                    color={activeFilter === filter.id ? '#FFFFFF' : '#0BAB7D'}
                  />
                  <Text style={[
                    styles.filterChipText,
                    activeFilter === filter.id && styles.activeFilterChipText
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="people" size={normalize(18)} color="#0BAB7D" />
              </View>
              <View>
                <Text style={styles.statNumber}>{doctors.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="checkmark-circle" size={normalize(18)} color="#0BAB7D" />
              </View>
              <View>
                <Text style={styles.statNumber}>{doctors.filter(d => d.isAvailable).length}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="star" size={normalize(18)} color="#FFD700" />
              </View>
              <View>
                <Text style={styles.statNumber}>{doctors.filter(d => d.ratings >= 4.8).length}</Text>
                <Text style={styles.statLabel}>Top Rated</Text>
              </View>
            </View>
          </View>

          {/* Doctors List Header */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {activeFilter === 'All' ? 'All Doctors' : `${activeFilter} Doctors`}
            </Text>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.sortButton}>
                <Ionicons name="swap-vertical" size={normalize(14)} color="#0BAB7D" />
                <Text style={styles.sortText}>Sort</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Doctors List */}
          <FlatList
            data={filteredDoctors}
            renderItem={renderDoctorCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: hp(1.5) }} />}
            contentContainerStyle={styles.doctorsList}
          />

          {filteredDoctors.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="medical-outline" size={normalize(50)} color="#CCCCCC" />
              </View>
              <Text style={styles.emptyStateTitle}>No Doctors Found</Text>
              <Text style={styles.emptyStateText}>
                Try searching with different keywords or adjust your filters
              </Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.clearFiltersText}>Clear Search & Filters</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: hp(2) }} />
        </ScrollView>
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
  header: {
    backgroundColor: '#0BAB7D',
    paddingHorizontal: wp(5),
    paddingTop: Platform.OS === 'ios' ? hp(1) : getStatusBarHeight(),
    paddingBottom: hp(2.5),
    borderBottomLeftRadius: normalize(25),
    borderBottomRightRadius: normalize(25),
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
    marginTop: Platform.OS === 'ios' ? hp(1) : hp(0.5),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: wp(2.5),
    marginRight: wp(3),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#FFFFFF',
    lineHeight: normalize(24),
  },
  headerSubtitle: {
    fontSize: normalize(12),
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
    lineHeight: normalize(16),
  },
  notificationButton: {
    position: 'relative',
    padding: wp(2.5),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: wp(1.5),
    right: wp(1.5),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#FF4444',
  },
  searchContainer: {
    marginTop: hp(1),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    paddingHorizontal: wp(4),
    paddingVertical: Platform.OS === 'ios' ? hp(1.8) : hp(1.5),
    gap: wp(2.5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(12),
    color: '#333333',
    paddingVertical: Platform.OS === 'android' ? 0 : 2,
    lineHeight: normalize(16),
  },
  content: {
    flex: 1,
    paddingTop: hp(2),
  },
  filtersContainer: {
    marginBottom: hp(2),
  },
  filtersContent: {
    paddingHorizontal: wp(5),
    gap: wp(2.5),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
    borderRadius: normalize(16),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0BAB7D',
    gap: wp(1.5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeFilterChip: {
    backgroundColor: '#0BAB7D',
    borderColor: '#0BAB7D',
  },
  filterChipText: {
    fontSize: normalize(12),
    color: '#0BAB7D',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: normalize(14),
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
    borderRadius: normalize(12),
    marginBottom: hp(2.5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
  },
  statIcon: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: '#F0F9F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    lineHeight: normalize(20),
  },
  statLabel: {
    fontSize: normalize(10),
    color: '#666666',
    lineHeight: normalize(12),
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
  },
  listTitle: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    lineHeight: normalize(20),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    borderRadius: normalize(6),
    backgroundColor: '#F0F9F7',
  },
  sortText: {
    fontSize: normalize(10),
    color: '#0BAB7D',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: normalize(12),
  },
  doctorsList: {
    paddingHorizontal: wp(5),
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: Platform.OS === 'android' ? 0.5 : 0,
    borderColor: '#F0F0F0',
  },
  doctorCardContent: {
    padding: wp(4),
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  doctorImageContainer: {
    position: 'relative',
    marginRight: wp(3.5),
  },
  doctorImage: {
    width: wp(16),
    height: wp(16),
    borderRadius: normalize(12),
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  availabilityDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorInfo: {
    flex: 1,
    marginRight: wp(2.5),
  },
  doctorName: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginBottom: hp(0.3),
    lineHeight: normalize(18),
  },
  doctorSpecialty: {
    fontSize: normalize(12),
    color: '#0BAB7D',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginBottom: hp(0.6),
    lineHeight: normalize(14),
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    marginBottom: hp(0.4),
  },
  experienceText: {
    fontSize: normalize(10),
    color: '#666666',
    lineHeight: normalize(12),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  locationText: {
    fontSize: normalize(10),
    color: '#666666',
    flex: 1,
    lineHeight: normalize(12),
  },
  doctorActions: {
    alignItems: 'flex-end',
    gap: hp(0.8),
  },
  favoriteButton: {
    padding: wp(1.5),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(0.5),
  },
  ratingText: {
    fontSize: normalize(12),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
    lineHeight: normalize(14),
  },
  reviewsText: {
    fontSize: normalize(10),
    color: '#666666',
    lineHeight: normalize(12),
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: hp(1.2),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  availabilitySection: {
    flex: 1,
    marginRight: wp(3.5),
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    marginBottom: hp(0.6),
  },
  languageText: {
    fontSize: normalize(10),
    color: '#666666',
    lineHeight: normalize(12),
  },
  nextAvailableContainer: {
    gap: hp(0.2),
  },
  nextAvailableLabel: {
    fontSize: normalize(9),
    color: '#999999',
    lineHeight: normalize(11),
  },
  nextAvailableTime: {
    fontSize: normalize(10),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    lineHeight: normalize(12),
  },
  bookingSection: {
    alignItems: 'flex-end',
    gap: hp(0.6),
  },
  feeContainer: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: normalize(9),
    color: '#999999',
    lineHeight: normalize(11),
  },
  feeAmount: {
    fontSize: normalize(14),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    lineHeight: normalize(16),
  },
  bookButton: {
    backgroundColor: '#0BAB7D',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: normalize(8),
    ...Platform.select({
      ios: {
        shadowColor: '#0BAB7D',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  disabledBookButton: {
    backgroundColor: '#CCCCCC',
  },
  bookButtonText: {
    fontSize: normalize(10),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
    lineHeight: normalize(12),
  },
  disabledBookButtonText: {
    color: '#999999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: hp(6),
    paddingHorizontal: wp(8),
  },
  emptyIcon: {
    backgroundColor: '#F5F5F5',
    padding: wp(6),
    borderRadius: wp(8),
    marginBottom: hp(2.5),
  },
  emptyStateTitle: {
    fontSize: normalize(18),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginBottom: hp(0.8),
    textAlign: 'center',
    lineHeight: normalize(22),
  },
  emptyStateText: {
    fontSize: normalize(12),
    color: '#666666',
    textAlign: 'center',
    lineHeight: normalize(16),
    marginBottom: hp(2.5),
  },
  clearFiltersButton: {
    backgroundColor: '#0BAB7D',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: normalize(8),
    ...Platform.select({
      ios: {
        shadowColor: '#0BAB7D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  clearFiltersText: {
    fontSize: normalize(12),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
    lineHeight: normalize(14),
  },
});

export default DoctorsScreen;