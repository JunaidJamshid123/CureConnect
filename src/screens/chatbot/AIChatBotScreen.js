import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AIChatBotScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Chatbot Screen</Text>
      <Text style={styles.subtitle}>This is where the AI assistant logic will go.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
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

export default AIChatBotScreen;