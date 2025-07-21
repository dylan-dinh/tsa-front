import axios, { AxiosResponse } from 'axios';
import { RegisterResponse, Streamer, TwitchLoginResponse, ClipsResponse } from '../types';
import { User } from '../types/index';

const API_URL = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8080") + "/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error(error.response.data.message || 'Invalid email or password');
      }
    }
    throw error;
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

export const getClips = (
  gameIds: string[], 
  token: string, 
  page: number = 1, 
  limit: number = 100
): Promise<AxiosResponse<ClipsResponse>> => {
  // Build query parameters for multiple game IDs and pagination
  const params = new URLSearchParams();
  gameIds.forEach(gameId => {
    params.append('game_id', gameId);
  });
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return api.get(`/users/clips?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export default api;
