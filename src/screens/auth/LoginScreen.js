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

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    // Check if all fields are filled
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call AuthService to sign in user
      const result = await AuthService.signIn(formData.email, formData.password);

      if (result.success) {
        Alert.alert(
          'Success',
          `Welcome back! Signing in as ${result.role}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate based on user role
                if (result.role === 'patient') {
                  navigation.replace('User');
                } else if (result.role === 'doctor') {
                  navigation.replace('Doctor');
                } else {
                  Alert.alert('Error', 'Invalid user role detected');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert('Social Login', `${provider} login will be implemented`);
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      Alert.alert('Email Required', 'Please enter your email address first');
      return;
    }
    
    // TODO: Implement password reset functionality
    Alert.alert('Password Reset', 'Password reset functionality will be implemented');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header with curved background */}
        <View style={styles.headerContainer}>
          <View style={styles.curvedHeader}>
            <Text style={styles.headerTitle}>Sign In</Text>
            <Text style={styles.headerSubtitle}>
              Welcome back to CureConnect, your trusted healthcare companion!
            </Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
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

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
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
            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={[styles.forgotPasswordText, isLoading && styles.linkDisabled]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[styles.signInButton, isLoading && styles.signInButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.signInButtonText, { marginLeft: 8 }]}>Signing In...</Text>
              </View>
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR Sign In With</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, isLoading && styles.socialButtonDisabled]}
              onPress={() => handleSocialLogin('Facebook')}
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
              onPress={() => handleSocialLogin('Google')}
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
              onPress={() => handleSocialLogin('Apple')}
              disabled={isLoading}
            >
              <Image
                source={require('../../../assets/icons/apple.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Signup')}
              disabled={isLoading}
            >
              <Text style={[styles.signUpLink, isLoading && styles.linkDisabled]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Accounts Info */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <Text style={styles.demoText}>Patient: patient@test.com | password123</Text>
            <Text style={styles.demoText}>Doctor: doctor@test.com | password123</Text>
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
    height: 180,
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
  inputContainer: {
    marginBottom: 18,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 7,
  },
  forgotPasswordText: {
    color: '#0BAB7D',
    fontSize: 13,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#0BAB7D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  signInButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  signInButtonText: {
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  signUpText: {
    fontSize: 15,
    color: '#666666',
  },
  signUpLink: {
    fontSize: 15,
    color: '#0BAB7D',
    fontWeight: '600',
  },
  linkDisabled: {
    opacity: 0.6,
  },
  demoContainer: {
    backgroundColor: '#F8F9FA',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 8,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 7,
  },
  demoText: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 2,
  },
});

export default LoginScreen;