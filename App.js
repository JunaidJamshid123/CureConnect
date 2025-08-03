import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigation/BottomTabNavigator'; // Import the BottomTabNavigator

const App = () => {
  useEffect(() => {
    // Hide the splash screen after a short delay or when your app is ready
    // For demonstration, we'll hide it after 2 seconds.
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return <AppNavigator />;
};

export default App;
