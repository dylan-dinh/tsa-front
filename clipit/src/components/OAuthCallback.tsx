import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { handleTwitchCallback } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

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
                
                console.log('OAuth Callback - URL params:', { code: !!code, token: !!token, state: !!state });
                console.log('Current URL:', window.location.href);

                // Check if we have a token parameter (backend redirected with token)
                if (token) {
                    console.log('Token parameter detected, processing authentication');
                    
                    setMessage('Completing authentication...');
                    
                    // Create a temporary user object since backend only returns token
                    const tempUser = {
                        id: 'temp',
                        email: 'twitch@user.com',
                        username: 'TwitchUser',
                        first_name: 'Twitch',
                        last_name: 'User',
                        display_name: 'TwitchGamer',
                        login: 'twitchuser',
                        email_verified: true,
                        twitch_username: undefined,
                        twitch_id: undefined,
                        twitch_avatar: undefined,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    
                    await login(token, tempUser);
                    setStatus('success');
                    setMessage('Authentication successful! Redirecting...');
                    
                    // Clean up URL and navigate to dashboard using React Navigation
                    window.history.replaceState({}, document.title, '/dashboard');
                    console.log('OAuth Callback - About to navigate to dashboard (token case)');
                    
                    setTimeout(() => {
                        // Navigate to dashboard using React Navigation
                        console.log('OAuth Callback - Executing navigation to dashboard (token case)');
                        navigation.navigate('Dashboard');
                    }, 1000);
                    
                } else if (code) {
                    // We have a code, need to exchange it for token
                    setMessage('Exchanging code for token...');
                    
                    const response = await handleTwitchCallback(code!, state || undefined);
                    
                    // Create a temporary user object since backend only returns token
                    const tempUser = {
                        id: 'temp',
                        email: 'twitch@user.com',
                        username: 'TwitchUser',
                        first_name: 'Twitch',
                        last_name: 'User',
                        display_name: 'TwitchGamer',
                        login: 'twitchuser',
                        email_verified: true,
                        twitch_username: undefined,
                        twitch_id: undefined,
                        twitch_avatar: undefined,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    
                    await login(response.token, tempUser);
                    setStatus('success');
                    setMessage('Authentication successful! Redirecting...');
                    
                    // Clean up URL and navigate to dashboard using React Navigation
                    window.history.replaceState({}, document.title, '/dashboard');
                    console.log('OAuth Callback - About to navigate to dashboard (code case)');
                    
                    setTimeout(() => {
                        // Navigate to dashboard using React Navigation
                        console.log('OAuth Callback - Executing navigation to dashboard (code case)');
                        navigation.navigate('Dashboard');
                    }, 1000);
                    
                } else {
                    // Add a small delay before showing error to prevent flash
                    // Only show error if we're still in loading state (not processing)
                    setTimeout(() => {
                        if (status === 'loading') {
                            setStatus('error');
                            setMessage('No authentication data received');
                        }
                    }, 1000);
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
                        <ActivityIndicator size="large" color="#9147ff" />
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
        backgroundColor: '#fff',
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
        color: '#666',
        textAlign: 'center',
    },
    subMessage: {
        marginTop: 10,
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    successIcon: {
        fontSize: 48,
        color: '#22c55e',
        marginBottom: 10,
    },
    successMessage: {
        fontSize: 16,
        color: '#22c55e',
        textAlign: 'center',
        fontWeight: '600',
    },
    errorIcon: {
        fontSize: 48,
        color: '#ef4444',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default OAuthCallback; 