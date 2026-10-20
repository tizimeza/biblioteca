export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LIBROS: '/libros',
  LIBRO_FILTER_OPTIONS: '/libros/opciones-filtros',
};
