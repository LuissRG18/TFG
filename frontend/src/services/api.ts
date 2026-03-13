import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
});

// Adjuntar token JWT a cada petición si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scilens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar errores globales
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('scilens_token');
      localStorage.removeItem('scilens_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

