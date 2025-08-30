import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';

import HomeScreen from '../screens/user/HomeScreen';
import DoctorsScreen from '../screens/user/DoctorsScreen';
import SchedulesScreen from '../screens/doctor/SchedulesScreen';
import ChatsScreen from '../screens/user/ChatsScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import FloatingChatbot from '../components/FloatingChatbot';


const Tab = createBottomTabNavigator();

function UserTabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = require('../../assets/icons/home.png');
            } else if (route.name === 'Doctors') {
              iconName = require('../../assets/icons/doctor.png');
            } else if (route.name === 'Chats') {
              iconName = require('../../assets/icons/chat.png');
            } else if (route.name === 'Profile') {
              iconName = require('../../assets/icons/profile.png');
            } else if (route.name === 'Schedules') {
              iconName = require('../../assets/icons/calendar.png');
            }

            return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Doctors" component={DoctorsScreen} />
        <Tab.Screen name="Chats" component={ChatsScreen} />
        <Tab.Screen name="Schedules" component={SchedulesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      
      {/* Floating Chatbot - appears on all user screens */}
      <FloatingChatbot />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

export default UserTabNavigator;