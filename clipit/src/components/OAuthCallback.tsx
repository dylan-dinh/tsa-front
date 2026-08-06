import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { handleTwitchCallback } from '../services/api';
import { RootStackParamList } from '../types/navigation';
import { colors, font } from '../styles/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Twitch authentication...');
  const { login } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const processCallback = async () => {
      if (Platform.OS !== 'web') {
        setStatus('error');
        setMessage('OAuth callback only supported on web');
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const token = urlParams.get('token');
        const state = urlParams.get('state');

        const tempUser = {
          id: 'temp',
          email: 'twitch@user.com',
          username: 'TwitchUser',
          first_name: 'Twitch',
          last_name: 'User',
          display_name: 'TwitchGamer',
          login: 'twitchuser',
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (token) {
          setMessage('Completing authentication...');
          await login(token, tempUser);
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          window.history.replaceState({}, document.title, '/');
          setTimeout(() => navigation.navigate('Main'), 800);
        } else if (code) {
          setMessage('Exchanging code for token...');
          const response = await handleTwitchCallback(code, state || undefined);
          await login(response.token, tempUser);
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          window.history.replaceState({}, document.title, '/');
          setTimeout(() => navigation.navigate('Main'), 800);
        } else {
          setTimeout(() => {
            setStatus('error');
            setMessage('No authentication data received');
          }, 800);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    processCallback();
  }, [login, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color={colors.purple} />
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.subMessage}>Please wait while we complete your authentication...</Text>
          </>
        )}
        {status === 'success' && (
          <>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successMessage}>{message}</Text>
          </>
        )}
        {status === 'error' && (
          <>
            <Text style={styles.errorIcon}>✗</Text>
            <Text style={styles.errorMessage}>{message}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  subMessage: {
    marginTop: 10,
    fontSize: 14,
    color: colors.dim,
    textAlign: 'center',
  },
  successIcon: {
    fontSize: 48,
    color: colors.success,
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: colors.success,
    textAlign: 'center',
    fontWeight: font.weight.semibold,
  },
  errorIcon: {
    fontSize: 48,
    color: colors.danger,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    fontWeight: font.weight.semibold,
  },
});

export default OAuthCallback;
