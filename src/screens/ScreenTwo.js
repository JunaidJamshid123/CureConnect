import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScreenTwo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen Two</Text>
      <Text style={styles.subtitle}>This is the second additional screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDE7',
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

export default ScreenTwo;