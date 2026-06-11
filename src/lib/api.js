import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

if (!API_BASE_URL) {
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app')) {
    API_BASE_URL = 'https://preproute-backend.vercel.app/api';
  } else {
    API_BASE_URL = '/api';
  }
}

// Normalize base URL: remove trailing slashes to avoid '//' when joining paths
API_BASE_URL = API_BASE_URL.replace(/\/+$/,'');

// Ensure base URL includes the API prefix for backend routes
if (!API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = `${API_BASE_URL}/api`;
}

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Allow sending cookies/credentials to the API when required
api.defaults.withCredentials = true;

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('preproute_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
      return Promise.reject(new Error('Request timeout - server may be slow'));
    }
    
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      
      if (error.response.status === 401) {
        localStorage.removeItem('preproute_token');
        localStorage.removeItem('preproute_user');
        window.location.href = '/login';
      }
      
      return Promise.reject(error.response.data || error);
    } else if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject(new Error('Network error - cannot reach server'));
    } else {
      console.error('Error setting up request:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;