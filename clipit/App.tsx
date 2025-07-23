import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import Landing from './src/components/Landing';
import Dashboard from './src/components/Dashboard';
import Explore from './src/components/Explore';
import UserProfile from './src/components/UserProfile';
import { AuthProvider } from './src/context/AuthContext';
import { ModalProvider } from './src/context/ModalContext';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Prevent external URL opening
    const handleUrl = (url: string) => {
      console.log('🚫 Blocked external URL attempt:', url);
      return false;
    };

    // Set up URL handling
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    // Override Linking.openURL to prevent external opening
    const originalOpenURL = Linking.openURL;
    Linking.openURL = async (url: string) => {
      console.log('🚫 Blocked Linking.openURL attempt:', url);
      return Promise.resolve(false);
    };

    return () => {
      subscription?.remove();
      Linking.openURL = originalOpenURL;
    };
  }, []);

  return (
    <AuthProvider>
      <ModalProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Explore" component={Explore} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </ModalProvider>
    </AuthProvider>
  );
} 