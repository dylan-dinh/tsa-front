import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { verifyJWT, isTokenExpiringSoon, JWTPayload } from '../utils/jwt';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: JWTPayload | null;
  token: string | null;
  login: (token: string, userInfo?: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        
        if (storedToken) {
          const verification = verifyJWT(storedToken);
          
          if (verification.isValid && verification.payload) {
            setToken(storedToken);
            setUser(verification.payload);
            setIsAuthenticated(true);
          } else {
            // Token invalide, le supprimer
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userInfo');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // En cas d'erreur, nettoyer le stockage
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Vérifier périodiquement si le token expire bientôt
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = async () => {
      if (isTokenExpiringSoon(token)) {
        console.warn('Token expiring soon, consider refreshing');
        // Ici vous pourriez implémenter un refresh automatique
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Vérifier toutes les minutes
    return () => clearInterval(interval);
  }, [token]);

  const login = useCallback(async (newToken: string, userInfo?: any) => {
    try {
      // Vérifier le token avant de le stocker
      const verification = verifyJWT(newToken);
      
      if (!verification.isValid) {
        throw new Error('Invalid JWT token');
      }

      // Stocker le token et les informations utilisateur
      await SecureStore.setItemAsync('userToken', newToken);
      if (userInfo) {
        await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
      }

      setToken(newToken);
      setUser(verification.payload || null);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userInfo');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    // Ici vous pourriez implémenter la logique de refresh token
    // Pour l'instant, on déconnecte l'utilisateur
    console.log('Token refresh not implemented yet');
    await logout();
  }, [logout]);

  return {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    refreshToken,
    isLoading
  };
}; 