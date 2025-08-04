import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator'; // Corrected import
import CustomSplashScreen from './src/screens/SplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // You can add any initialization logic here
        // For example: loading fonts, checking auth status, etc.
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the native splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return <AppNavigator />;
};

export default App;