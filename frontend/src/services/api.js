import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { APP_ROUTES } from '../constants/routes';
import { AUTH_EVENTS, STORAGE_KEYS } from '../constants/storage';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.dispatchEvent(new Event(AUTH_EVENTS.SESSION_EXPIRED));
      if (window.location.pathname !== APP_ROUTES.LOGIN) {
        window.location.assign(APP_ROUTES.LOGIN);
      }
    }
    return Promise.reject(error);
  },
);
