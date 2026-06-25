import React, { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Landing from './src/components/Landing';
import Home from './src/components/Home';
import Discover from './src/components/Discover';
import SavedClips from './src/components/SavedClips';
import UserProfile from './src/components/UserProfile';
import Explore from './src/components/Explore';
import AppNavBar from './src/components/AppNavBar';
import { AuthProvider } from './src/context/AuthContext';
import { ModalProvider } from './src/context/ModalContext';
import { colors } from './src/styles/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom-tab navigator with a responsive custom bar (sidebar on desktop,
// bottom bar on mobile). Tabs keep their screens mounted, so Twitch clip
// embeds keep playing as the user moves between Home / Discover / Saved / Profile.
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AppNavBar {...props} />}
      screenOptions={{ headerShown: false, lazy: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Discover" component={Discover} />
      <Tab.Screen name="Saved" component={SavedClips} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.surface, text: colors.white, border: colors.cardBorder, primary: colors.purple },
};

export default function App() {
  useEffect(() => {
    // Keep clips inside the app — never hand off to an external browser/app.
    const sub = Linking.addEventListener('url', () => {});
    const original = Linking.openURL;
    Linking.openURL = async (url: string) => { console.log('🚫 Blocked external URL:', url); return false as any; };
    return () => { sub?.remove(); Linking.openURL = original; };
  }, []);

  return (
    <AuthProvider>
      <ModalProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Explore" component={Explore} options={{ presentation: 'fullScreenModal', animation: Platform.OS === 'web' ? 'fade' : 'slide_from_bottom' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ModalProvider>
    </AuthProvider>
  );
}
