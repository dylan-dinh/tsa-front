import axios, { AxiosResponse } from 'axios';
import { RegisterResponse, Streamer } from '../types';
import { User } from '../types/index';

const API_URL = 'http://localhost:8080/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string) => {
  return axios.post('/api/login', { email, password });
};

export const register = (email: string, password: string): Promise<AxiosResponse<RegisterResponse>> => 
  api.post('/register', { email, password });

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