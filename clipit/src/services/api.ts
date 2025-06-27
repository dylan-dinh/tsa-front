import axios, { AxiosResponse } from 'axios';
import { RegisterResponse, Streamer, TwitchLoginResponse } from '../types';
import { verifyJWT, JWTPayload } from '../utils/jwt';
import * as SecureStore from 'expo-secure-store';

const API_URL = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8080") + "/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Vérifier que le token est toujours valide
        const verification = verifyJWT(token);
        if (verification.isValid) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Token invalide, le supprimer
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userInfo');
        }
      }
    } catch (error) {
      console.error('Error adding auth token to request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses d'erreur
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide, nettoyer le stockage
      try {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
      } catch (cleanupError) {
        console.error('Error cleaning up invalid token:', cleanupError);
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/users/login', { email, password });

    const { token, user } = response.data;

    // Vérifier la signature et la validité du JWT
    const jwtVerification = verifyJWT(token);
    
    if (!jwtVerification.isValid) {
      throw new Error(jwtVerification.error || 'Invalid JWT token received from server');
    }

    // Vérifier que les informations utilisateur correspondent
    const tokenPayload = jwtVerification.payload as JWTPayload;
    if (tokenPayload.email !== email) {
      throw new Error('Token email does not match login email');
    }

    return { token, user };
  } catch (error: unknown) {

    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Invalid email or password');
      }
      if (error.response.status === 401) {
        throw new Error('Authentication failed. Please check your credentials.');
      }
      if (error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const register = async (userData: {
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  password: string;
}) => {
  try {
      const response = await api.post('/users/register', userData);
      return response.data; // Return the response data from the backend
  } catch (error) {
      throw error; // Handle error appropriately
  }
};

// Twitch OAuth functions
export const initiateTwitchAuth = (): string => {
  // This will redirect to the backend endpoint that initiates Twitch OAuth
  return `${API_URL}/users/login/twitch`;
};

export const handleTwitchCallback = async (code: string, state?: string): Promise<TwitchLoginResponse> => {
  try {
    const response = await api.get(`/users/login/twitch/callback?code=${code}${state ? `&state=${state}` : ''}`);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Twitch authentication failed');
    }
    throw error;
  }
};

export const addStreamer = (url: string, token: string): Promise<AxiosResponse<Streamer>> => 
  api.post('/streamers', { url }, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getStreamers = (token: string): Promise<AxiosResponse<Streamer[]>> => 
  api.get('/streamers', {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getUser = (token: string): Promise<AxiosResponse<User>> =>
  api.get('/user', {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateUser = (token: string, userData: Partial<User>): Promise<AxiosResponse<User>> =>
  api.put('/user', userData, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const removeStreamer = (token: string, streamerId: string): Promise<AxiosResponse<void>> =>
  api.delete(`/streamers/${streamerId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export default api;
