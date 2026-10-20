import { API_ENDPOINTS } from '../constants/api';
import { api } from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data.data.token;
  },
};
