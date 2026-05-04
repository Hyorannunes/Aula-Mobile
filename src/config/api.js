import { Platform } from 'react-native';

/**
 * URL base da API. Em dispositivo físico com Expo Go, defina EXPO_PUBLIC_API_URL
 * no .env na raiz do app (ex.: http://192.168.1.10:3000).
 */
function defaultBaseUrl() {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
}

export const API_BASE_URL = defaultBaseUrl();
