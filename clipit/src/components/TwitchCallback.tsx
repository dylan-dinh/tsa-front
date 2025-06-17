import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTwitchAuth } from '../hooks/useTwitchAuth';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TwitchCallback: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isLoading, error } = useTwitchAuth();

  useEffect(() => {
    // If authentication is successful, navigate to dashboard
    // This will be handled by the useTwitchAuth hook
    const timer = setTimeout(() => {
      if (!isLoading && !error) {
        navigation.navigate('Dashboard');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, error, navigation]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Authentication Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={() => navigation.goBack()}>
          Try Again
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#9147ff" style={styles.loader} />
      <Text style={styles.loadingText}>Completing Twitch authentication...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    fontSize: 16,
    color: '#9147ff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default TwitchCallback; 