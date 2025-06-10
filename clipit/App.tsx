import React, { StrictMode } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalProvider } from './src/context/ModalContext';
import LandingPage from './src/components/Landing';
import Dashboard from './src/components/Dashboard';
import UserProfile from './src/components/UserProfile';
import Login from './src/components/Login';
import Register from './src/components/Register';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <StrictMode>
      <NavigationContainer>
        <ModalProvider>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen 
              name="Landing" 
              component={LandingPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Login" 
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Dashboard" 
              component={Dashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="UserProfile" 
              component={UserProfile}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </ModalProvider>
      </NavigationContainer>
    </StrictMode>
  );
} 