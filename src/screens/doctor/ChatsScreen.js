import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';

const messages = [
  { id: '1', sender: 'doctor', text: 'Hello, how can I help you today?' },
  { id: '2', sender: 'patient', text: 'I have a headache since morning.' },
  { id: '3', sender: 'doctor', text: 'Did you take any medication?' },
  { id: '4', sender: 'patient', text: 'No, not yet.' },
];

const ChatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Chats Screen</Text>
      <Text style={styles.subtitle}>Chat with patients.</Text>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'doctor'
                  ? styles.doctorBubble
                  : styles.patientBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            editable={false}
          />
        </View>
      </View>
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
  chatContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  messagesList: {
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  doctorBubble: {
    backgroundColor: '#E1BEE7',
    alignSelf: 'flex-end',
  },
  patientBubble: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E1BEE7',
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: '#F8F8F8',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEE',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default ChatsScreen;