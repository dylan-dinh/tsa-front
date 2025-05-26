import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalProvider } from './context/ModalContext';
import LandingPage from './components/Landing';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ModalProvider>
        <Stack.Navigator initialRouteName="Landing">
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
      </ModalProvider>
    </NavigationContainer>
  );
} 