import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated, isLoading, navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9147ff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Sera redirigé vers Login
  }

  return <>{children}</>;
};

export default ProtectedRoute;
