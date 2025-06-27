import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTwitchAuth } from '../hooks/useTwitchAuth';
import { useAuth } from '../context/AuthContext';

const TwitchAuthTester: React.FC = () => {
    const { initiateAuth, isLoading, error } = useTwitchAuth();
    const { user, isAuthenticated, logout } = useAuth();

    const handleAuth = async () => {
        if (isAuthenticated) {
            await logout();
        } else {
            initiateAuth();
        }
    };

    const showUserInfo = () => {
        if (user) {
            Alert.alert('User Info', JSON.stringify(user, null, 2));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Twitch Auth Tester</Text>
            <Text style={styles.platform}>Platform: {Platform.OS}</Text>
            
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {isAuthenticated && user && (
                <View style={styles.userContainer}>
                    <Text style={styles.userText}>✅ Authenticated</Text>
                    <Text style={styles.userText}>User: {user.email}</Text>
                    {user.twitch_username && (
                        <Text style={styles.userText}>Twitch: {user.twitch_username}</Text>
                    )}
                    <TouchableOpacity onPress={showUserInfo} style={styles.infoButton}>
                        <Text style={styles.infoButtonText}>Show Full User Info</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                onPress={handleAuth}
                style={[styles.authButton, isLoading && styles.buttonDisabled]}
                disabled={isLoading}
            >
                <MaterialCommunityIcons 
                    name="twitch" 
                    size={20} 
                    color="white" 
                    style={styles.icon}
                />
                <Text style={styles.authButtonText}>
                    {isLoading 
                        ? 'Loading...' 
                        : isAuthenticated 
                            ? 'Logout' 
                            : 'Login with Twitch'
                    }
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        margin: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    platform: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 15,
    },
    errorContainer: {
        backgroundColor: '#fef2f2',
        padding: 10,
        borderRadius: 6,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
    },
    userContainer: {
        backgroundColor: '#f0f9ff',
        padding: 15,
        borderRadius: 6,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    userText: {
        color: '#0369a1',
        fontSize: 14,
        marginBottom: 5,
    },
    infoButton: {
        backgroundColor: '#0369a1',
        padding: 8,
        borderRadius: 4,
        marginTop: 10,
    },
    infoButtonText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
    },
    authButton: {
        backgroundColor: '#9147ff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 6,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    icon: {
        marginRight: 8,
    },
    authButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TwitchAuthTester; 