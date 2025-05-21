// src/context/api.ts
import axios from 'axios';

const API_BASE_URL = "https://e-commerce-hfbs.onrender.com/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Keep backend alive function
export const pingServer = () => {
  // Simple ping without intervals to avoid complications
  api.get('/health')
    .catch(() => console.log('Health check ping - silent failure is okay'));
};

export default api;