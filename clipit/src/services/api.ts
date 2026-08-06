import axios, { AxiosResponse } from 'axios';
import { Clip, RegisterResponse, Streamer, TwitchLoginResponse, ClipsResponse } from '../types';
import { User } from '../types/index';
import storage from './storage';

const API_URL = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8080") + "/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (!config.headers.Authorization) {
    const token = await storage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getClipSlug = (clip: Clip): string | null => {
  const sources = [clip.EmbedURL, clip.URL];
  for (const source of sources) {
    if (!source) continue;
    const embedMatch = source.match(/[?&]clip=([^&]+)/);
    if (embedMatch) return decodeURIComponent(embedMatch[1]);
    const pathMatch = source.match(/clips\.twitch\.tv\/([^/?&#]+)/);
    if (pathMatch && pathMatch[1] !== 'embed') return pathMatch[1];
  }
  return clip.TwitchID || null;
};

export const getTwitchEmbedUrl = (
  clip: Clip,
  parent: string,
  opts?: { autoplay?: boolean; muted?: boolean },
): string | null => {
  const slug = getClipSlug(clip);
  if (!slug) return null;
  const params = new URLSearchParams({
    clip: slug,
    parent,
    autoplay: String(opts?.autoplay ?? false),
    muted: String(opts?.muted ?? false),
  });
  return `https://clips.twitch.tv/embed?${params.toString()}`;
};

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

export interface GameSubscription {
  twitch_id: string;
  name: string;
  box_art_url: string;
}

export const getUserGames = (): Promise<AxiosResponse<{ games: GameSubscription[] }>> =>
  api.get('/users/games');

export const subscribeToGame = (
  gameTwitchId: string,
  meta?: { name?: string; box_art_url?: string },
): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/users/games/${gameTwitchId}`, meta ?? {});

export const unsubscribeFromGame = (
  gameTwitchId: string,
): Promise<AxiosResponse<{ message: string }>> =>
  api.delete(`/users/games/${gameTwitchId}`);

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
