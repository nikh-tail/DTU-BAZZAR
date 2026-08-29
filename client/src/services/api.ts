import axios from 'axios';

// Dynamically use Render backend in production or VITE_API_URL, and relative path locally
const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const DEFAULT_PROD_URL = 'https://dtu-bazzar.onrender.com';

const rawApiUrl = import.meta.env.VITE_API_URL || (!isLocalhost && isBrowser ? DEFAULT_PROD_URL : '');
export const API_BASE_URL = rawApiUrl
  ? `${rawApiUrl.replace(/\/$/, '')}/api`
  : '/api';

// Instant background warm-up for Render serverless container on client boot
if (isBrowser && !isLocalhost) {
  fetch(`${DEFAULT_PROD_URL}/api/health`, { mode: 'no-cors' }).catch(() => {});
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45s timeout to handle initial Render wakeups cleanly
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
    return Promise.reject(error);
  }
);
