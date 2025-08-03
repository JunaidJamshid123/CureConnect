import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats Screen</Text>
      <Text style={styles.subtitle}>Communicate with your doctors and peers.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
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

export default ChatsScreen;