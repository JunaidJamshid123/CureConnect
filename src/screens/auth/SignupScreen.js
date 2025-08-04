import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SignupScreen = ({ navigation }) => {
  const handlePatientSignup = () => {
    // Add your signup logic here
    // For now, we'll just navigate to the User tab navigator
    navigation.replace('User');
  };

  const handleDoctorSignup = () => {
    // Add your signup logic here
    // For now, we'll just navigate to the Doctor tab navigator
    navigation.replace('Doctor');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Button title="Sign Up as Patient" onPress={handlePatientSignup} />
      <Button title="Sign Up as Doctor" onPress={handleDoctorSignup} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginTop: 20,
    color: 'blue',
  },
});

export default SignupScreen;