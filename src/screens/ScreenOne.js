import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScreenOne = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen One</Text>
      <Text style={styles.subtitle}>This is the first additional screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
});

export default ScreenOne;