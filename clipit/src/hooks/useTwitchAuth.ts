import { useState } from 'react';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';

export const useTwitchAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create the auth request for mobile
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: 'dummy', // This will be replaced by backend redirect
            scopes: ['user:read:email'],
            redirectUri: Platform.OS === 'web' 
                ? window.location.origin 
                : AuthSession.makeRedirectUri({ scheme: 'clipit' }),
            responseType: AuthSession.ResponseType.Code,
        },
        {
            authorizationEndpoint: `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/api/users/login/twitch`,
        }
    );

    const initiateAuth = async () => {
        setError(null);
        setIsLoading(true);
        
        try {
            if (Platform.OS === 'web') {
                // For web, redirect directly to backend
                const authUrl = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"}/api/users/login/twitch`;
                window.location.href = authUrl;
            } else {
                // For mobile, use expo-auth-session
                const result = await promptAsync();
                if (result.type === 'cancel') {
                    setIsLoading(false);
                }
                // Note: Mobile callback handling is done by the OAuthCallback component
            }
        } catch (err) {
            setError('Failed to initiate authentication');
            setIsLoading(false);
        }
    };

    return {
        initiateAuth,
        isLoading,
        error,
    };
}; 