import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../../services/AuthService';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient', // Default to patient
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    // Check if all fields are filled
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    // Validate full name
    if (fullName.length < 2) {
      Alert.alert('Error', 'Please enter a valid full name');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    // Validate password
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call AuthService to create user
      const result = await AuthService.signUp(formData);

      if (result.success) {
        Alert.alert(
          'Success',
          `Account created successfully as ${formData.role}!`,
          [
            {
              text: 'OK',
              onPress: () => {
                if (formData.role === 'patient') {
                  navigation.replace('User');
                } else {
                  navigation.replace('Doctor');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    Alert.alert('Social Signup', `${provider} signup will be implemented`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header with curved background */}
        <View style={styles.headerContainer}>
          <View style={styles.curvedHeader}>
            <Text style={styles.headerTitle}>Sign Up</Text>
            <Text style={styles.headerSubtitle}>
              Join CureConnect and take control of your health journey!
            </Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Select Role</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'patient' && styles.roleButtonActive
                ]}
                onPress={() => updateFormData('role', 'patient')}
                disabled={isLoading}
              >
                <Image 
                  source={require('../../../assets/icons/immunity.png')}
                  style={[
                    styles.roleIcon,
                    formData.role === 'patient' && styles.roleIconActive
                  ]}
                  resizeMode="contain"
                />
                <Text style={[
                  styles.roleButtonText,
                  formData.role === 'patient' && styles.roleButtonTextActive
                ]}>
                  Patient
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'doctor' && styles.roleButtonActive
                ]}
                onPress={() => updateFormData('role', 'doctor')}
                disabled={isLoading}
              >
                <Image 
                  source={require('../../../assets/icons/doctor.png')}
                  style={[
                    styles.roleIcon,
                    formData.role === 'doctor' && styles.roleIconActive
                  ]}
                  resizeMode="contain"
                />
                <Text style={[
                  styles.roleButtonText,
                  formData.role === 'doctor' && styles.roleButtonTextActive
                ]}>
                  Doctor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#A0A0A0"
                value={formData.fullName}
                onChangeText={(value) => updateFormData('fullName', value)}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                placeholderTextColor="#A0A0A0"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#A0A0A0"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={18} 
                  color="#A0A0A0" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor="#A0A0A0"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={18} 
                  color="#A0A0A0" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.signUpButtonText, { marginLeft: 8 }]}>Creating Account...</Text>
              </View>
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR Sign Up With</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, isLoading && styles.socialButtonDisabled]}
              onPress={() => handleSocialSignup('Facebook')}
              disabled={isLoading}
            >
              <Image
                source={require('../../../assets/icons/facebook.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, isLoading && styles.socialButtonDisabled]}
              onPress={() => handleSocialSignup('Google')}
              disabled={isLoading}
            >
              <Image
                source={require('../../../assets/icons/google.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, isLoading && styles.socialButtonDisabled]}
              onPress={() => handleSocialSignup('Apple')}
              disabled={isLoading}
            >
              <Image
                source={require('../../../assets/icons/apple.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={[styles.signInLink, isLoading && styles.linkDisabled]}>Sign in</Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 19,
  },
  headerContainer: {
    height: 160,
    position: 'relative',
  },
  curvedHeader: {
    backgroundColor: '#0BAB7D',
    height: '100%',
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 19,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 7,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 19,
    paddingTop: 25,
  },
  roleContainer: {
    marginBottom: 18,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  roleButtonActive: {
    borderColor: '#0BAB7D',
    backgroundColor: '#F0FDF4',
  },
  roleIcon: {
    width: 20,
    height: 20,
    tintColor: '#666666',
  },
  roleIconActive: {
    tintColor: '#0BAB7D',
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  roleButtonTextActive: {
    color: '#0BAB7D',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginLeft: 14,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
  },
  eyeIcon: {
    paddingHorizontal: 14,
  },
  signUpButton: {
    backgroundColor: '#0BAB7D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  signUpButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#666666',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 25,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  signInText: {
    fontSize: 15,
    color: '#666666',
  },
  signInLink: {
    fontSize: 15,
    color: '#0BAB7D',
    fontWeight: '600',
  },
  linkDisabled: {
    opacity: 0.6,
  },
  termsContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#0BAB7D',
    fontWeight: '500',
  },
});

export default SignupScreen;