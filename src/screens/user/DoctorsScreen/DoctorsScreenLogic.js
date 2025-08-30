import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { collection, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/FirebaeConfig';

export const useDoctorsScreenLogic = () => {
  // State management
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctorsSubscription, setDoctorsSubscription] = useState(null);

  // Setup real-time subscription to doctors collection
  const setupDoctorsSubscription = () => {
    try {
      console.log('Setting up real-time doctors subscription...');
      
      // Query doctors collection - using only isActive filter to avoid composite index
      const doctorsRef = collection(db, 'doctors');
      const q = query(
        doctorsRef,
        where('isActive', '==', true) // Only active doctors
      );
      
      // Create real-time listener
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          console.log('Real-time update received:', querySnapshot.docs.length, 'doctors');
          
          const doctorsData = [];
          querySnapshot.forEach((doc) => {
            const doctorData = doc.data();
            doctorsData.push({
              id: doc.id,
              ...doctorData,
              // Ensure all required fields have default values
              fullName: doctorData.fullName || 'Dr. Unknown',
              specialization: doctorData.specialization || 'General Medicine',
              experience: doctorData.experience || '0',
              ratings: doctorData.ratings || 0,
              totalReviews: doctorData.totalReviews || 0,
              consultationFee: doctorData.consultationFee || '0',
              isAvailable: doctorData.isAvailable || false,
              languagesSpoken: doctorData.languagesSpoken || [],
              address: doctorData.address || 'Address not available',
              profileImage: doctorData.profileImage || null,
              gender: doctorData.gender || 'Not specified',
              education: doctorData.education || 'Not specified',
              licenseNumber: doctorData.licenseNumber || 'Not specified',
              availability: doctorData.availability || {},
              about: doctorData.about || 'No description available'
            });
          });
          
          // Sort by fullName in code
          doctorsData.sort((a, b) => a.fullName.localeCompare(b.fullName));
          
          setDoctors(doctorsData);
          setFilteredDoctors(doctorsData);
          setLoading(false);
          
          console.log('Doctors data updated in real-time');
        },
        (error) => {
          console.error('Real-time subscription error:', error);
          
          // If the isActive filter fails, try without any filters
          if (error.message.includes('index')) {
            console.log('Falling back to loading all doctors without filters...');
            setupFallbackSubscription();
          } else {
            showError('Failed to setup real-time updates');
            setLoading(false);
          }
        }
      );
      
      setDoctorsSubscription(() => unsubscribe);
      console.log('Real-time subscription setup successful');
      
    } catch (error) {
      console.error('Setup subscription error:', error);
      showError('Failed to setup real-time updates');
      setLoading(false);
    }
  };

  // Fallback subscription without filters
  const setupFallbackSubscription = () => {
    try {
      console.log('Setting up fallback subscription...');
      
      const doctorsRef = collection(db, 'doctors');
      
      const unsubscribe = onSnapshot(doctorsRef, 
        (querySnapshot) => {
          console.log('Fallback update received:', querySnapshot.docs.length, 'doctors');
          
          const doctorsData = [];
          querySnapshot.forEach((doc) => {
            const doctorData = doc.data();
            doctorsData.push({
              id: doc.id,
              ...doctorData,
              // Ensure all required fields have default values
              fullName: doctorData.fullName || 'Dr. Unknown',
              specialization: doctorData.specialization || 'General Medicine',
              experience: doctorData.experience || '0',
              ratings: doctorData.ratings || 0,
              totalReviews: doctorData.totalReviews || 0,
              consultationFee: doctorData.consultationFee || '0',
              isAvailable: doctorData.isAvailable || false,
              languagesSpoken: doctorData.languagesSpoken || [],
              address: doctorData.address || 'Address not available',
              profileImage: doctorData.profileImage || null,
              gender: doctorData.gender || 'Not specified',
              education: doctorData.education || 'Not specified',
              licenseNumber: doctorData.licenseNumber || 'Not specified',
              availability: doctorData.availability || {},
              about: doctorData.about || 'No description available'
            });
          });
          
          // Sort by fullName in code
          doctorsData.sort((a, b) => a.fullName.localeCompare(b.fullName));
          
          setDoctors(doctorsData);
          setFilteredDoctors(doctorsData);
          setLoading(false);
          
          console.log('Fallback subscription working');
        },
        (error) => {
          console.error('Fallback subscription error:', error);
          showError('Failed to load doctors');
          setLoading(false);
        }
      );
      
      setDoctorsSubscription(() => unsubscribe);
      
    } catch (error) {
      console.error('Setup fallback subscription error:', error);
      showError('Failed to setup doctors subscription');
      setLoading(false);
    }
  };

  // Load doctors from Firebase (legacy method - kept for compatibility)
  const loadDoctors = async () => {
    try {
      setLoading(true);
      
      // Query doctors collection - using only isActive filter to avoid composite index
      const doctorsRef = collection(db, 'doctors');
      const q = query(
        doctorsRef,
        where('isActive', '==', true) // Only active doctors
      );
      
      const querySnapshot = await getDocs(q);
      const doctorsData = [];
      
      querySnapshot.forEach((doc) => {
        const doctorData = doc.data();
        doctorsData.push({
          id: doc.id,
          ...doctorData,
          // Ensure all required fields have default values
          fullName: doctorData.fullName || 'Dr. Unknown',
          specialization: doctorData.specialization || 'General Medicine',
          experience: doctorData.experience || '0',
          ratings: doctorData.ratings || 0,
          totalReviews: doctorData.totalReviews || 0,
          consultationFee: doctorData.consultationFee || '0',
          isAvailable: doctorData.isAvailable || false,
          languagesSpoken: doctorData.languagesSpoken || [],
          address: doctorData.address || 'Address not available',
          profileImage: doctorData.profileImage || null,
          gender: doctorData.gender || 'Not specified',
          education: doctorData.education || 'Not specified',
          licenseNumber: doctorData.licenseNumber || 'Not specified',
          availability: doctorData.availability || {},
          about: doctorData.about || 'No description available'
        });
      });
      
      // Sort by fullName in code (this is more efficient than server-side sorting for small datasets)
      doctorsData.sort((a, b) => a.fullName.localeCompare(b.fullName));
      
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      
    } catch (error) {
      console.error('Load doctors error:', error);
      
      // If the isActive filter fails, try without any filters
      if (error.message.includes('index')) {
        console.log('Falling back to loading all doctors...');
        await loadAllDoctors();
      } else {
        showError('Failed to load doctors');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback method to load all doctors without filters
  const loadAllDoctors = async () => {
    try {
      const doctorsRef = collection(db, 'doctors');
      const querySnapshot = await getDocs(doctorsRef);
      const doctorsData = [];
      
      querySnapshot.forEach((doc) => {
        const doctorData = doc.data();
        doctorsData.push({
          id: doc.id,
          ...doctorData,
          // Ensure all required fields have default values
          fullName: doctorData.fullName || 'Dr. Unknown',
          specialization: doctorData.specialization || 'General Medicine',
          experience: doctorData.experience || '0',
          ratings: doctorData.ratings || 0,
          totalReviews: doctorData.totalReviews || 0,
          consultationFee: doctorData.consultationFee || '0',
          isAvailable: doctorData.isAvailable || false,
          languagesSpoken: doctorData.languagesSpoken || [],
          address: doctorData.address || 'Address not available',
          profileImage: doctorData.profileImage || null,
          gender: doctorData.gender || 'Not specified',
          education: doctorData.education || 'Not specified',
          licenseNumber: doctorData.licenseNumber || 'Not specified',
          availability: doctorData.availability || {},
          about: doctorData.about || 'No description available'
        });
      });
      
      // Sort by fullName in code
      doctorsData.sort((a, b) => a.fullName.localeCompare(b.fullName));
      
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      
    } catch (error) {
      console.error('Load all doctors error:', error);
      showError('Failed to load doctors');
    }
  };

  // Refresh doctors data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Clean up existing subscription
    if (doctorsSubscription) {
      doctorsSubscription();
    }
    
    // Setup fresh subscription
    setupDoctorsSubscription();
    
    // Reset refreshing state after a short delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [doctorsSubscription]);

  // Show error alert
  const showError = (message) => {
    Alert.alert('Error', message, [{ text: 'OK' }]);
  };

  // Filter doctors based on search query and active filter
  const filterDoctors = useCallback(() => {
    let filtered = [...doctors];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(doctor => 
        doctor.fullName.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.address.toLowerCase().includes(query) ||
        doctor.languagesSpoken.some(lang => lang.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter(doctor => 
        doctor.specialization.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchQuery, activeFilter]);

  // Update search query
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  // Update active filter
  const updateActiveFilter = (filter) => {
    setActiveFilter(filter);
  };

  // Get available specializations for filter
  const getAvailableSpecializations = () => {
    const specializations = doctors.map(doctor => doctor.specialization);
    const uniqueSpecializations = [...new Set(specializations)];
    return ['All', ...uniqueSpecializations];
  };

  // Get doctor details for navigation
  const getDoctorDetails = (doctorId) => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  // Calculate doctor rating display
  const getDoctorRatingDisplay = (doctor) => {
    const rating = doctor.ratings || 0;
    const reviews = doctor.totalReviews || 0;
    
    if (reviews === 0) {
      return 'No reviews yet';
    }
    
    return `${rating.toFixed(1)} (${reviews} reviews)`;
  };

  // Get next available time
  const getNextAvailableTime = (doctor) => {
    if (!doctor.isAvailable) {
      return 'Currently unavailable';
    }
    
    // This is a simplified version - in a real app, you'd check actual availability
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) {
      return 'Available today';
    } else if (hour < 17) {
      return 'Available today';
    } else {
      return 'Available tomorrow';
    }
  };

  // Setup real-time subscription on component mount
  useEffect(() => {
    setupDoctorsSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      if (doctorsSubscription) {
        console.log('Cleaning up doctors subscription...');
        doctorsSubscription();
      }
    };
  }, []);

  // Apply filters when search query or active filter changes
  useEffect(() => {
    filterDoctors();
  }, [filterDoctors]);

  return {
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
    getNextAvailableTime,
    setupDoctorsSubscription,
    setupFallbackSubscription
  };
}; 