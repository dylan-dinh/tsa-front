import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalProvider } from './src/context/ModalContext';
import LandingPage from './src/components/Landing';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ModalProvider>
        <Stack.Navigator>
          <Stack.Screen 
            name="Landing" 
            component={LandingPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </ModalProvider>
    </NavigationContainer>
  );
} 