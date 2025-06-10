import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalProvider } from './context/ModalContext';
import LandingPage from './components/Landing';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const AppWithProviders: React.FC = () => {
  console.log('AppWithProviders: Initializing');
  
  return (
    <SafeAreaProvider>
      <ModalProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName="Landing"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#111827',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          >
            <Stack.Screen 
              name="Landing" 
              component={LandingPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Dashboard" 
              component={Dashboard}
              options={{ 
                headerShown: true,
                title: 'Dashboard'
              }}
            />
            <Stack.Screen 
              name="UserProfile" 
              component={UserProfile}
              options={{ 
                headerShown: true,
                title: 'Profile'
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ModalProvider>
    </SafeAreaProvider>
  );
};

export default AppWithProviders; 