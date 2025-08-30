import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import HomeScreen from '../screens/doctor/HomeScreen';
import PatientsScreen from '../screens/doctor/PatientsScreen';
import SchedulesScreen from '../screens/doctor/SchedulesScreen';
import ChatsScreen from '../screens/doctor/ChatsScreen';
import ProfileScreen from '../screens/doctor/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

function DoctorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = require('../../assets/icons/home.png');
          } else if (route.name === 'Patients') {
            iconName = require('../../assets/icons/immunity.png');
          } else if (route.name === 'Schedules') {
            iconName = require('../../assets/icons/calendar.png');
          } else if (route.name === 'Chats') {
            iconName = require('../../assets/icons/chat.png');
          } else if (route.name === 'Profile') {
            iconName = require('../../assets/icons/profile.png');
          }

          return <Image source={iconName} style={{ width: size, height: size, tintColor: color }} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Patients" component={PatientsScreen} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default DoctorTabNavigator;