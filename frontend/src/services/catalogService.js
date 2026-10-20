import { API_ENDPOINTS } from '../constants/api';
import { api } from './api';

export const catalogService = {
  async getBookFilterOptions() {
    const response = await api.get(API_ENDPOINTS.LIBRO_FILTER_OPTIONS);
    return response.data.data;
  },

  async getBooks(filters) {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== ''),
    );
    const response = await api.get(API_ENDPOINTS.LIBROS, { params });
    return response.data.data;
  },

  async getBook(id) {
    const response = await api.get(`${API_ENDPOINTS.LIBROS}/${id}`);
    return response.data.data;
  },
};
