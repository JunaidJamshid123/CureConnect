import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const handlePatientLogin = () => {
    // Add your authentication logic here
    // For now, we'll just navigate to the User tab navigator
    navigation.replace('User');
  };

  const handleDoctorLogin = () => {
    // Add your authentication logic here
    // For now, we'll just navigate to the Doctor tab navigator
    navigation.replace('Doctor');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button title="Login as Patient" onPress={handlePatientLogin} />
      <Button title="Login as Doctor" onPress={handleDoctorLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign up
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

export default LoginScreen;