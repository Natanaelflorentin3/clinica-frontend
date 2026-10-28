import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});

// Interceptor de request: agrega el token del store (fuera de un componente → getState())
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response: un 401 significa que el token ya no es válido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login');

    // En el login, un 401 es "credenciales incorrectas": lo maneja el formulario con un toast
    if (error.response?.status === 401 && !esLogin) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);
