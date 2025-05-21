// src/context/api.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = "https://e-commerce-hfbs.onrender.com/api";

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

/**
 * Function to keep the backend alive by sending periodic pings
 * @returns A cleanup function
 */
function startKeepAliveInterval(): () => void {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  
  // Start interval
  intervalId = setInterval(() => {
    api.get('/health')
      .catch(err => console.log('Health ping error (can be ignored):', err.message));
  }, 10 * 60 * 1000); // 10 minutes
  
  // Return cleanup function
  return () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  };
}

export { startKeepAliveInterval };
export default api;