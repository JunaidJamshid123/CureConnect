import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FloatingChatbot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  const flatListRef = useRef(null);

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your medical assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Animation when opening
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  const toggleChatbot = () => {
    setIsVisible(!isVisible);
    setIsMinimized(false);
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const maximizeChatbot = () => {
    setIsMinimized(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response (replace with actual AI integration)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText.trim());
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Scroll to bottom
      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
      }
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Medical-related responses
    if (input.includes('headache') || input.includes('head pain')) {
      return "Headaches can have various causes. Common remedies include rest, hydration, and over-the-counter pain relievers. If severe or persistent, please consult a doctor.";
    } else if (input.includes('fever') || input.includes('temperature')) {
      return "A fever is often a sign of infection. Rest, stay hydrated, and monitor your temperature. Seek medical attention if fever is high (>103°F) or persistent.";
    } else if (input.includes('cough') || input.includes('cold')) {
      return "For coughs and colds, rest, stay hydrated, and consider honey for cough relief. If symptoms persist or worsen, consult a healthcare provider.";
    } else if (input.includes('pain') || input.includes('hurt')) {
      return "Pain can indicate various conditions. Rest the affected area and consider over-the-counter pain relievers. Seek medical help if pain is severe or persistent.";
    } else if (input.includes('appointment') || input.includes('doctor')) {
      return "To book an appointment, go to the Doctors tab and select a doctor. You can also check their availability and book directly through the app.";
    } else if (input.includes('emergency') || input.includes('urgent')) {
      return "If this is a medical emergency, please call emergency services immediately (911 in the US). This chatbot is for general information only.";
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm here to help with your medical questions. Feel free to ask about symptoms, medications, or general health advice.";
    } else if (input.includes('thank')) {
      return "You're welcome! I'm here to help. Is there anything else you'd like to know about your health?";
    } else if (input.includes('blood pressure') || input.includes('bp')) {
      return "Normal blood pressure is typically below 120/80 mmHg. High blood pressure can lead to serious health issues. Monitor regularly and consult a doctor if elevated.";
    } else if (input.includes('diabetes') || input.includes('blood sugar')) {
      return "Diabetes requires careful management of blood sugar levels through diet, exercise, and medication. Regular monitoring and doctor visits are essential.";
    } else if (input.includes('allergy') || input.includes('allergic')) {
      return "Allergies can cause various symptoms. Avoid triggers, consider antihistamines, and carry emergency medication if prescribed. See a doctor for severe reactions.";
    } else if (input.includes('sleep') || input.includes('insomnia')) {
      return "Good sleep hygiene includes regular bedtime, avoiding screens before bed, and creating a comfortable environment. Consult a doctor if sleep problems persist.";
    } else if (input.includes('diet') || input.includes('nutrition')) {
      return "A balanced diet with fruits, vegetables, lean proteins, and whole grains supports good health. Consider consulting a nutritionist for personalized advice.";
    } else if (input.includes('exercise') || input.includes('workout')) {
      return "Regular exercise improves health and mood. Aim for 150 minutes of moderate activity weekly. Start slowly and consult a doctor before beginning a new program.";
    } else if (input.includes('medication') || input.includes('medicine')) {
      return "Always take medications as prescribed. Don't stop without consulting your doctor. Report any side effects immediately.";
    } else if (input.includes('vaccine') || input.includes('vaccination')) {
      return "Vaccines protect against serious diseases. Stay up-to-date with recommended vaccinations. Consult your doctor about any concerns.";
    } else if (input.includes('mental health') || input.includes('anxiety') || input.includes('depression')) {
      return "Mental health is as important as physical health. If you're struggling, consider talking to a mental health professional. You're not alone.";
    } else if (input.includes('pregnancy') || input.includes('pregnant')) {
      return "Pregnancy requires special care and regular prenatal visits. Consult an obstetrician for personalized guidance and care.";
    } else if (input.includes('child') || input.includes('baby') || input.includes('pediatric')) {
      return "Children have unique health needs. Regular pediatric visits and vaccinations are crucial. Contact a pediatrician for specific concerns.";
    } else if (input.includes('elderly') || input.includes('aging') || input.includes('senior')) {
      return "Aging brings specific health considerations. Regular check-ups, medication reviews, and preventive care are important for seniors.";
    } else {
      return "I understand you're asking about '" + userInput + "'. While I can provide general health information, please consult a healthcare professional for specific medical advice. How else can I help you?";
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isBot ? styles.botMessage : styles.userMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isBot ? styles.botBubble : styles.userBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isBot ? styles.botText : styles.userText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  if (isMinimized) {
    return (
      <TouchableOpacity
        style={[styles.floatingButton, styles.minimizedButton]}
        onPress={maximizeChatbot}
        activeOpacity={0.8}
      >
        <Image 
          source={require('../../assets/icons/chatbot.png')} 
          style={styles.chatbotIconSmall}
          resizeMode="contain"
        />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>1</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <>
      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={toggleChatbot}
        activeOpacity={0.8}
      >
        <Image 
          source={require('../../assets/icons/chatbot.png')} 
          style={styles.chatbotIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Chatbot Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleChatbot}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.chatbotContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim }
                ]
              }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
                             <View style={styles.headerLeft}>
                 <View style={styles.botAvatar}>
                   <Image 
                     source={require('../../assets/icons/chatbot.png')} 
                     style={styles.botAvatarIcon}
                     resizeMode="contain"
                   />
                 </View>
                 <View>
                   <Text style={styles.botName}>Medical Assistant</Text>
                   <Text style={styles.botStatus}>Online</Text>
                 </View>
               </View>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={minimizeChatbot} style={styles.headerButton}>
                  <Ionicons name="remove" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleChatbot} style={styles.headerButton}>
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              style={styles.messagesList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
            />

            {/* Quick Action Buttons */}
            {messages.length === 1 && (
              <View style={styles.quickActionsContainer}>
                <Text style={styles.quickActionsTitle}>Quick Topics:</Text>
                <View style={styles.quickActionsGrid}>
                  {[
                    { text: 'Headache', icon: 'medical', color: '#FF6B6B' },
                    { text: 'Fever', icon: 'thermometer', color: '#FFA726' },
                    { text: 'Pain', icon: 'bandage', color: '#AB47BC' },
                    { text: 'Appointment', icon: 'calendar', color: '#42A5F5' },
                    { text: 'Emergency', icon: 'warning', color: '#EF5350' },
                    { text: 'Medication', icon: 'medical-outline', color: '#66BB6A' }
                  ].map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.quickActionButton, { borderColor: action.color }]}
                      onPress={() => {
                        const userMessage = {
                          id: Date.now(),
                          text: action.text,
                          isBot: false,
                          timestamp: new Date()
                        };
                        
                        setMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        
                        // Simulate bot response
                        setTimeout(() => {
                          const botResponse = generateBotResponse(action.text);
                          const botMessage = {
                            id: Date.now() + 1,
                            text: botResponse,
                            isBot: true,
                            timestamp: new Date()
                          };
                          
                          setMessages(prev => [...prev, botMessage]);
                          setIsTyping(false);
                          
                          // Scroll to bottom
                          if (flatListRef.current) {
                            setTimeout(() => {
                              flatListRef.current.scrollToEnd({ animated: true });
                            }, 100);
                          }
                        }, 1000);
                      }}
                    >
                      <Ionicons name={action.icon} size={18} color={action.color} />
                      <Text style={[styles.quickActionText, { color: action.color }]}>{action.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>Medical Assistant is typing...</Text>
              </View>
            )}

            {/* Input Section */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me about your health..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={inputText.trim() ? "#fff" : "#ccc"} 
                />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 130,
    right: 25,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
    borderWidth: 3,
    borderColor: '#45a049',
  },
  minimizedButton: {
    bottom: 130,
    right: 25,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatbotIcon: {
    width: 48,
    height: 48,
  },
  chatbotIconSmall: {
    width: 42,
    height: 42,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatbotContainer: {
    backgroundColor: '#fff',
    height: height * 0.75,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f5e8',
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  botAvatarIcon: {
    width: 32,
    height: 32,
  },
  botName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  botStatus: {
    fontSize: 13,
    color: '#e8f5e8',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 18,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  botBubble: {
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 8,
    borderRightWidth: 4,
    borderRightColor: '#45a049',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  botText: {
    color: '#2c3e50',
  },
  userText: {
    color: '#fff',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 6,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  typingContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 24,
    marginVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#e8f5e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typingText: {
    fontSize: 13,
    color: '#4CAF50',
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
    backgroundColor: '#fafafa',
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e8f5e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default FloatingChatbot; 