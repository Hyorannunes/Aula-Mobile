import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const AUTH_TOKEN_KEY = '@demo/auth_token';

export const authTokenStorageKey = AUTH_TOKEN_KEY;

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error, fallback = 'Erro de rede') {
  const msg = error?.response?.data?.error;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (error?.message === 'Network Error') return 'Sem conexão com o servidor';
  return fallback;
}

export default client;
