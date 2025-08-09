import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  StatusBar,
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

const HomeScreen = ({ navigation }) => {
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
                <View style={styles.greetingSection}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={require('../../../assets/icons/demo_doctor.jpg')}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                    <View style={styles.greetingText}>
                      <Text style={styles.greeting}>Hi, Smith Jack!</Text>
                      <Text style={styles.subGreeting}>How Are You Today?</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
                    <Ionicons name="notifications-outline" size={normalize(22)} color="#FFFFFF" />
                    <View style={styles.notificationBadge} />
                  </TouchableOpacity>
                </View>
                
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <View style={styles.searchWrapper}>
                    <Ionicons name="search-outline" size={normalize(18)} color="#A0A0A0" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search doctor by name"
                      placeholderTextColor="#A0A0A0"
                    />
                    <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
                      <Ionicons name="options-outline" size={normalize(18)} color="#0BAB7D" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Today Appointments */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today Appointments</Text>
                <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.appointmentsScrollContainer}
                decelerationRate="fast"
                snapToInterval={wp(44) + wp(3)}
                snapToAlignment="start"
              >
                <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.9}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentInfo}>
                      <View style={styles.appointmentTypeContainer}>
                        <View style={styles.videoIconContainer}>
                          <Ionicons name="videocam" size={normalize(14)} color="#0BAB7D" />
                        </View>
                        <Text style={styles.appointmentType}>Video</Text>
                      </View>
                      <Text style={styles.appointmentSubtype}>Consultation</Text>
                      <View style={styles.statusContainer}>
                        <View style={styles.statusDot} />
                        <Text style={styles.appointmentStatus}>Waiting for call</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.doctorInfoContainer}>
                    <View style={styles.doctorImageWrapper}>
                      <Image
                        source={require('../../../assets/icons/demo_doctor.jpg')}
                        style={styles.doctorImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.doctorName} numberOfLines={2}>Dr. Eleanor Shaw</Text>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time" size={normalize(10)} color="#666666" />
                      <Text style={styles.doctorTime}>09:30 AM-10:00 PM</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.9}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentInfo}>
                      <View style={styles.appointmentTypeContainer}>
                        <View style={styles.videoIconContainer}>
                          <Ionicons name="videocam" size={normalize(14)} color="#0BAB7D" />
                        </View>
                        <Text style={styles.appointmentType}>Video</Text>
                      </View>
                      <Text style={styles.appointmentSubtype}>Consultation</Text>
                      <View style={styles.statusContainer}>
                        <View style={styles.statusDot} />
                        <Text style={styles.appointmentStatus}>Waiting for call</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.doctorInfoContainer}>
                    <View style={styles.doctorImageWrapper}>
                      <Image
                        source={require('../../../assets/icons/demo_doctor2.jpeg')}
                        style={styles.doctorImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.doctorName} numberOfLines={2}>Dr. Randy</Text>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time" size={normalize(10)} color="#666666" />
                      <Text style={styles.doctorTime}>09:30 AM</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.appointmentCard} activeOpacity={0.9}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentInfo}>
                      <View style={styles.appointmentTypeContainer}>
                        <View style={[styles.videoIconContainer, { backgroundColor: '#FFF4E6' }]}>
                          <Ionicons name="videocam" size={normalize(14)} color="#FF9500" />
                        </View>
                        <Text style={styles.appointmentType}>Video</Text>
                      </View>
                      <Text style={styles.appointmentSubtype}>Consultation</Text>
                      <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: '#FF9500' }]} />
                        <Text style={styles.appointmentStatus}>Scheduled</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.doctorInfoContainer}>
                    <View style={styles.doctorImageWrapper}>
                      <Image
                        source={require('../../../assets/icons/demo_doctor.jpg')}
                        style={styles.doctorImage}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={styles.doctorName} numberOfLines={2}>Dr. Sarah Wilson</Text>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time" size={normalize(10)} color="#666666" />
                      <Text style={styles.doctorTime}>02:00 PM</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Doctor Specialty */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Doctor Specialty</Text>
                <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.specialtyScrollContainer}
              >
                <TouchableOpacity style={styles.specialtyItem} activeOpacity={0.8}>
                  <View style={[styles.specialtyIcon, { backgroundColor: '#E8F5F3' }]}>
                    <Ionicons name="medical" size={normalize(20)} color="#0BAB7D" />
                  </View>
                  <Text style={styles.specialtyText}>Dental</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.specialtyItem} activeOpacity={0.8}>
                  <View style={[styles.specialtyIcon, { backgroundColor: '#FFF0F0' }]}>
                    <Ionicons name="heart" size={normalize(20)} color="#FF6B6B" />
                  </View>
                  <Text style={styles.specialtyText}>Cardiology</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.specialtyItem} activeOpacity={0.8}>
                  <View style={[styles.specialtyIcon, { backgroundColor: '#F0F0FF' }]}>
                    <Ionicons name="pulse" size={normalize(20)} color="#6B73FF" />
                  </View>
                  <Text style={styles.specialtyText}>Neurology</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.specialtyItem} activeOpacity={0.8}>
                  <View style={[styles.specialtyIcon, { backgroundColor: '#FFF8E8' }]}>
                    <Ionicons name="body" size={normalize(20)} color="#FFB800" />
                  </View>
                  <Text style={styles.specialtyText}>Orthopedic</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.specialtyItem} activeOpacity={0.8}>
                  <View style={[styles.specialtyIcon, { backgroundColor: '#F0FFF0' }]}>
                    <Ionicons name="water" size={normalize(20)} color="#4CAF50" />
                  </View>
                  <Text style={styles.specialtyText}>Kidney</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.specialtyItem} activeOpacity={0.8}>
                  <View style={[styles.specialtyIcon, { backgroundColor: '#FFF0F8' }]}>
                    <Ionicons name="eye" size={normalize(20)} color="#E91E63" />
                  </View>
                  <Text style={styles.specialtyText}>Eye Care</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.specialtyItem} activeOpacity={0.8}>
                  <View style={[styles.specialtyIcon, { backgroundColor: '#F8F0FF' }]}>
                    <Ionicons name="fitness" size={normalize(20)} color="#9C27B0" />
                  </View>
                  <Text style={styles.specialtyText}>Pulmonary</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Popular Doctors */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Doctors</Text>
                <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.7}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.doctorsScrollContainer}
                decelerationRate="fast"
                snapToInterval={wp(44) + wp(3)}
                snapToAlignment="start"
              >
                <TouchableOpacity style={styles.doctorCard} activeOpacity={0.9}>
                  <View style={styles.doctorCardContent}>
                    <View style={styles.doctorCardHeader}>
                      <View style={styles.doctorImageContainer}>
                        <Image
                          source={require('../../../assets/icons/demo_doctor.jpg')}
                          style={styles.popularDoctorImage}
                          resizeMode="cover"
                        />
                        <View style={styles.onlineIndicator}>
                          <View style={styles.onlineDot} />
                        </View>
                      </View>
                      <View style={styles.doctorRating}>
                        <Ionicons name="star" size={normalize(10)} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8</Text>
                      </View>
                    </View>
                    
                    <View style={styles.doctorInfo}>
                      <Text style={styles.popularDoctorName} numberOfLines={2}>Dr. Sunaki Sinha</Text>
                      <Text style={styles.popularDoctorSpecialty}>Cardiologist</Text>
                      <View style={styles.availabilityContainer}>
                        <Ionicons name="time" size={normalize(10)} color="#666666" />
                        <Text style={styles.availabilityText} numberOfLines={1}>9:30 AM - 2:00 PM</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.appointmentButton} activeOpacity={0.8}>
                    <Text style={styles.appointmentButtonText}>Book Appointment</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.doctorCard} activeOpacity={0.9}>
                  <View style={styles.doctorCardContent}>
                    <View style={styles.doctorCardHeader}>
                      <View style={styles.doctorImageContainer}>
                        <Image
                          source={require('../../../assets/icons/demo_doctor2.jpeg')}
                          style={styles.popularDoctorImage}
                          resizeMode="cover"
                        />
                        <View style={styles.onlineIndicator}>
                          <View style={styles.onlineDot} />
                        </View>
                      </View>
                      <View style={styles.doctorRating}>
                        <Ionicons name="star" size={normalize(10)} color="#FFD700" />
                        <Text style={styles.ratingText}>4.8</Text>
                      </View>
                    </View>
                    
                    <View style={styles.doctorInfo}>
                      <Text style={styles.popularDoctorName} numberOfLines={2}>Dr. Kamala Ragimova</Text>
                      <Text style={styles.popularDoctorSpecialty}>Orthopedics</Text>
                      <View style={styles.availabilityContainer}>
                        <Ionicons name="time" size={normalize(10)} color="#666666" />
                        <Text style={styles.availabilityText} numberOfLines={1}>9:30 AM - 2:00 PM</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.appointmentButton} activeOpacity={0.8}>
                    <Text style={styles.appointmentButtonText}>Book Appointment</Text>
                  </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity style={styles.doctorCard} activeOpacity={0.9}>
                  <View style={styles.doctorCardContent}>
                    <View style={styles.doctorCardHeader}>
                      <View style={styles.doctorImageContainer}>
                        <Image
                          source={require('../../../assets/icons/demo_doctor.jpg')}
                          style={styles.popularDoctorImage}
                          resizeMode="cover"
                        />
                        <View style={styles.onlineIndicator}>
                          <View style={styles.onlineDot} />
                        </View>
                      </View>
                      <View style={styles.doctorRating}>
                        <Ionicons name="star" size={normalize(10)} color="#FFD700" />
                        <Text style={styles.ratingText}>4.9</Text>
                      </View>
                    </View>
                    
                    <View style={styles.doctorInfo}>
                      <Text style={styles.popularDoctorName} numberOfLines={2}>Dr. Michael Chen</Text>
                      <Text style={styles.popularDoctorSpecialty}>Neurology</Text>
                      <View style={styles.availabilityContainer}>
                        <Ionicons name="time" size={normalize(10)} color="#666666" />
                        <Text style={styles.availabilityText} numberOfLines={1}>10:00 AM - 4:00 PM</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.appointmentButton} activeOpacity={0.8}>
                    <Text style={styles.appointmentButtonText}>Book Appointment</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(2),
  },
  headerContainer: {
    height: Platform.OS === 'ios' ? hp(30) : hp(32),
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
    paddingBottom: hp(2.5),
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? hp(1) : hp(0.5),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: wp(2),
  },
  profileImage: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    marginRight: wp(3),
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#FFFFFF',
    lineHeight: normalize(20),
  },
  subGreeting: {
    fontSize: normalize(12),
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
    lineHeight: normalize(16),
  },
  notificationButton: {
    padding: wp(2.5),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp(10),
    minHeight: wp(10),
  },
  notificationBadge: {
    position: 'absolute',
    top: wp(1.5),
    right: wp(1.5),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#FF4444',
  },
  searchContainer: {
    marginTop: hp(1.5),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    paddingHorizontal: wp(4),
    paddingVertical: Platform.OS === 'ios' ? hp(1.8) : hp(1.5),
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
  searchIcon: {
    marginRight: wp(2.5),
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(12),
    color: '#333333',
    paddingVertical: Platform.OS === 'android' ? 0 : 2,
    lineHeight: normalize(16),
  },
  filterButton: {
    padding: wp(1.5),
    backgroundColor: '#F0F9F7',
    borderRadius: normalize(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
  },
  sectionContainer: {
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    lineHeight: normalize(20),
  },
  seeAllButton: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
  },
  seeAllText: {
    fontSize: normalize(12),
    color: '#0BAB7D',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  appointmentsScrollContainer: {
    paddingRight: wp(5),
  },
  appointmentCard: {
    width: wp(44),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: wp(3.5),
    marginRight: wp(3),
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
  appointmentHeader: {
    marginBottom: hp(1.2),
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.3),
  },
  videoIconContainer: {
    backgroundColor: '#E8F5F3',
    padding: wp(1),
    borderRadius: wp(1),
    marginRight: wp(1.5),
  },
  appointmentType: {
    fontSize: normalize(12),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
  },
  appointmentSubtype: {
    fontSize: normalize(12),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
    marginBottom: hp(0.5),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    backgroundColor: '#0BAB7D',
    marginRight: wp(1.5),
  },
  appointmentStatus: {
    fontSize: normalize(10),
    color: '#666666',
  },
  doctorInfoContainer: {
    alignItems: 'center',
  },
  doctorImageWrapper: {
    marginBottom: hp(0.8),
  },
  doctorImage: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  doctorName: {
    fontSize: normalize(11),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
    textAlign: 'center',
    lineHeight: normalize(14),
    marginBottom: hp(0.3),
    minHeight: normalize(28),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorTime: {
    fontSize: normalize(9),
    color: '#666666',
    marginLeft: wp(1),
    textAlign: 'center',
  },
  specialtyScrollContainer: {
    paddingRight: wp(5),
  },
  specialtyItem: {
    alignItems: 'center',
    marginRight: wp(4.5),
    minWidth: wp(16),
  },
  specialtyIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.8),
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
  specialtyText: {
    fontSize: normalize(10),
    color: '#333333',
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
    lineHeight: normalize(12),
  },
  doctorsScrollContainer: {
    paddingRight: wp(5),
  },
  doctorCard: {
    width: wp(44),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: wp(3.5),
    marginRight: wp(3),
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
    justifyContent: 'space-between',
    minHeight: hp(26),
  },
  doctorCardContent: {
    flex: 1,
  },
  doctorCardHeader: {
    alignItems: 'center',
    marginBottom: hp(1),
  },
  doctorImageContainer: {
    position: 'relative',
    marginBottom: hp(0.5),
  },
  popularDoctorImage: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(0.2),
    borderRadius: normalize(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: wp(0.5),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(1.5),
    padding: wp(0.3),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  onlineDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#0BAB7D',
  },
  ratingText: {
    fontSize: normalize(9),
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#333333',
    marginLeft: wp(0.5),
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  popularDoctorName: {
    fontSize: normalize(12),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333333',
    textAlign: 'center',
    lineHeight: normalize(15),
    marginBottom: hp(0.3),
    minHeight: normalize(30),
  },
  popularDoctorSpecialty: {
    fontSize: normalize(10),
    color: '#0BAB7D',
    textAlign: 'center',
    marginBottom: hp(0.8),
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
  },
  availabilityText: {
    fontSize: normalize(9),
    color: '#666666',
    marginLeft: wp(1),
    flex: 1,
    textAlign: 'center',
  },
  appointmentButton: {
    backgroundColor: '#0BAB7D',
    borderRadius: normalize(8),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    alignItems: 'center',
    marginTop: 'auto',
  },
  appointmentButtonText: {
    fontSize: normalize(10),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
    lineHeight: normalize(12),
  },
});
export default HomeScreen;