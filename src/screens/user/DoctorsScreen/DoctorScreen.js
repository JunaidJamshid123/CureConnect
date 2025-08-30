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
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDoctorsScreenLogic } from './DoctorsScreenLogic';
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

const DoctorScreen = ({ navigation }) => {
  const {
    // State
    doctors,
    loading,
    refreshing,
    searchQuery,
    activeFilter,
    filteredDoctors,
    
    // Functions
    loadDoctors,
    onRefresh,
    showError,
    updateSearchQuery,
    updateActiveFilter,
    getAvailableSpecializations,
    getDoctorDetails,
    getDoctorRatingDisplay,
    getNextAvailableTime
  } = useDoctorsScreenLogic();

  // Render loading state
  if (loading && doctors.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0BAB7D" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0BAB7D" />
            <Text style={styles.loadingText}>Loading doctors...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Render error state if no doctors data
  if (!loading && doctors.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0BAB7D" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={normalize(50)} color="#FF6B6B" />
            <Text style={styles.errorText}>Failed to load doctors</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadDoctors}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="search" 
        size={normalize(60)} 
        color="#CCCCCC" 
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No doctors found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filter criteria to find available doctors.
      </Text>
    </View>
  );

  // Render filter chips
  const renderFilterChips = () => {
    const specializations = getAvailableSpecializations();
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollView}
      >
        {specializations.map((specialization, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterChip,
              activeFilter === specialization 
                ? styles.filterChipActive 
                : styles.filterChipInactive
            ]}
            onPress={() => updateActiveFilter(specialization)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.filterChipText,
              activeFilter === specialization 
                ? styles.filterChipTextActive 
                : styles.filterChipTextInactive
            ]}>
              {specialization}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Render doctor card
  const renderDoctorCard = ({ item: doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => {
        // Navigate to doctor details screen
        // navigation.navigate('DoctorDetails', { doctorId: doctor.id });
        console.log('Navigate to doctor details:', doctor.id);
      }}
      activeOpacity={0.9}
    >
      {/* Doctor Card Header */}
      <View style={styles.doctorCardHeader}>
        {/* Doctor Image */}
        <View style={styles.doctorImageContainer}>
          <Image
            source={
              doctor.profileImage 
                ? { uri: doctor.profileImage }
                : require('../../../../assets/icons/demo_doctor.jpg')
            }
            style={styles.doctorImage}
            resizeMode="cover"
          />
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorInfoContainer}>
          <View>
            <Text style={styles.doctorName}>{doctor.fullName}</Text>
            <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
            <Text style={styles.doctorExperience}>{doctor.experience} years experience</Text>
            
            <View style={styles.doctorRatingContainer}>
              <Ionicons name="star" size={normalize(12)} color="#FFD700" />
              <Text style={styles.doctorRating}>
                {getDoctorRatingDisplay(doctor)}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor Status and Fee */}
        <View style={styles.doctorStatusContainer}>
          <View style={[
            styles.doctorStatus,
            doctor.isAvailable 
              ? styles.doctorStatusAvailable 
              : styles.doctorStatusUnavailable
          ]}>
            <Ionicons 
              name={doctor.isAvailable ? "checkmark-circle" : "close-circle"} 
              size={normalize(12)} 
              color={doctor.isAvailable ? "#0BAB7D" : "#FF6B6B"} 
            />
            <Text style={[
              styles.doctorStatusText,
              doctor.isAvailable 
                ? styles.doctorStatusTextAvailable 
                : styles.doctorStatusTextUnavailable
            ]}>
              {doctor.isAvailable ? 'Available' : 'Unavailable'}
            </Text>
          </View>
          
          <Text style={styles.doctorFee}>
            ${doctor.consultationFee}
          </Text>
        </View>
      </View>

      {/* Doctor Details Section */}
      <View style={styles.doctorDetailsSection}>
        <Text style={styles.doctorAddress} numberOfLines={1}>
          📍 {doctor.address}
        </Text>
        
        {doctor.languagesSpoken && doctor.languagesSpoken.length > 0 && (
          <View style={styles.doctorLanguagesList}>
            {doctor.languagesSpoken.slice(0, 3).map((language, index) => (
              <View key={index} style={styles.doctorLanguageTag}>
                <Text style={styles.doctorLanguageTagText}>{language}</Text>
              </View>
            ))}
            {doctor.languagesSpoken.length > 3 && (
              <View style={styles.doctorLanguageTag}>
                <Text style={styles.doctorLanguageTagText}>
                  +{doctor.languagesSpoken.length - 3} more
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Doctor Card Footer */}
      <View style={styles.doctorCardFooter}>
        <View style={styles.doctorLanguages}>
          <Text style={styles.doctorLanguagesText}>
            {doctor.languagesSpoken && doctor.languagesSpoken.length > 0 
              ? doctor.languagesSpoken.join(', ')
              : 'Languages not specified'
            }
          </Text>
        </View>
        
        <View style={styles.doctorNextAvailable}>
          <Text style={styles.doctorNextAvailableText}>
            {getNextAvailableTime(doctor)}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.doctorActionButton}
          onPress={() => {
            // Navigate to booking screen
            // navigation.navigate('BookAppointment', { doctorId: doctor.id });
            console.log('Book appointment for doctor:', doctor.id);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.doctorActionButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0BAB7D" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
                            <View>
                  <Text style={styles.headerTitle}>Find Doctors</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.headerSubtitle}>
                      {filteredDoctors.length} doctors available
                    </Text>
                    <View style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: 4, 
                      backgroundColor: '#4CAF50', 
                      marginLeft: 8 
                    }} />
                    <Text style={[styles.headerSubtitle, { marginLeft: 4, fontSize: 10 }]}>
                      Live
                    </Text>
                  </View>
                </View>
            <TouchableOpacity 
              style={{ padding: wp(2) }}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={normalize(24)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={normalize(18)} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors, specializations..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={updateSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => updateSearchQuery('')}>
                <Ionicons name="close-circle" size={normalize(18)} color="#999999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter by Specialization</Text>
          {renderFilterChips()}
        </View>

        {/* Results Count */}
        <View style={styles.resultsCount}>
          <Text style={styles.resultsCountText}>
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </Text>
        </View>

        {/* Doctors List */}
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0BAB7D']}
              tintColor="#0BAB7D"
            />
          }
          ListEmptyComponent={renderEmptyState}
          bounces={Platform.OS === 'ios'}
        />
      </SafeAreaView>
    </View>
  );
};

export default DoctorScreen; 