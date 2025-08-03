import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Image } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import SchedulesScreen from '../screens/SchedulesScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Custom Icon Component using your asset images
const CustomIcon = ({ name, color, size, focused }) => {
  const getIconSource = () => {
    switch (name) {
      case 'Home':
        return require('../../assets/home.png');
      case 'Doctors':
        return require('../../assets/doctor.png');
      case 'Schedules':
        return require('../../assets/calendar.png');
      case 'Chats':
        return require('../../assets/chat.png');
      case 'Profile':
        return require('../../assets/profile.png');
      default:
        return require('../../assets/home.png');
    }
  };

  return (
    <View style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 4
    }}>
      <Image
        source={getIconSource()}
        style={{
          width: size,
          height: size,
          tintColor: color,
          opacity: focused ? 1 : 0.7,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default function BottomTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#00D4AA', // Medical green color from the design
          tabBarInactiveTintColor: '#9CA3AF', // Light gray
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            paddingTop: 8,
            paddingBottom: 8,
            height: 65,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
          tabBarIcon: ({ focused, color, size }) => (
            <CustomIcon
              name={route.name}
              color={color}
              size={24}
              focused={focused}
            />
          ),
          headerShown: false, // Hide headers for cleaner look
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen 
          name="Doctors" 
          component={DoctorsScreen}
          options={{ tabBarLabel: 'Doctors' }}
        />
        <Tab.Screen 
          name="Schedules" 
          component={SchedulesScreen}
          options={{ tabBarLabel: 'Schedule' }}
        />
        <Tab.Screen 
          name="Chats" 
          component={ChatsScreen}
          options={{ tabBarLabel: 'Chat' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}