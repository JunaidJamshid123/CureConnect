import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SchedulesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Schedules Screen</Text>
      <Text style={styles.subtitle}>Manage your appointments.</Text>
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

export default SchedulesScreen;