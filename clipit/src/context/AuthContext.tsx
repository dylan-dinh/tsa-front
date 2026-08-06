import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Platform, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { User } from '../types';
import storage from '../services/storage';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    token: string | null;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



const LoadingScreen: React.FC = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9147ff" />
        <Text style={styles.loadingText}>Loading...</Text>
    </View>
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load stored authentication data on app start
    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedToken = await storage.getItem('token');
                const storedUserJson = await storage.getItem('user');
                
                if (storedToken) {
                    setToken(storedToken);
                    setIsAuthenticated(true);
                }
                
                if (storedUserJson) {
                    const storedUser = JSON.parse(storedUserJson);
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Failed to load stored auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredAuth();
    }, []);

    const login = async (token: string, user: User) => {
        setIsAuthenticated(true);
        setToken(token);
        setUser(user);
        
        try {
            await storage.setItem('token', token);
            await storage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Failed to store auth data:', error);
        }
    };

    const logout = async () => {
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        
        try {
            await storage.removeItem('token');
            await storage.removeItem('user');
        } catch (error) {
            console.error('Failed to remove auth data:', error);
        }
    };

    const updateUser = async (updatedUser: User) => {
        setUser(updatedUser);
        
        try {
            await storage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    // Don't render children until we've loaded stored auth
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, token, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280',
    },
});
