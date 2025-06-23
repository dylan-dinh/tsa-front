import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import des composants
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Import des contextes
import { ModalProvider } from './context/ModalContext';

// Import des types
import { RootStackParamList } from './types/navigation';

// Import des tests JWT (pour les tests en console)
import './utils/testJWT';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <ModalProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Landing"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen 
              name="Dashboard" 
              component={Dashboard}
              options={{
                headerShown: true,
                title: 'Dashboard',
              }}
            />
            <Stack.Screen 
              name="UserProfile" 
              component={UserProfile}
              options={{
                headerShown: true,
                title: 'User Profile',
              }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ModalProvider>
    </SafeAreaProvider>
  );
} 