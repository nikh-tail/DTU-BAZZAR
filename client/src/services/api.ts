import axios from 'axios';

export const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to inject JWT bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dtu_bazaar_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on expired / invalid session if requested by protected route
      const isAuthRoute = error.config.url?.includes('/auth/request-otp') || error.config.url?.includes('/auth/verify-otp');
      if (!isAuthRoute) {
        // localStorage.removeItem('dtu_bazaar_token');
      }
    }
    return Promise.reject(error);
  }
);
