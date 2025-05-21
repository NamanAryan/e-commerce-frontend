// src/context/api.tsx
import axios from 'axios';

const API_BASE_URL = "https://e-commerce-hfbs.onrender.com/api";

// Flag to prevent multiple redirects or token refreshes at once
let isRefreshing = false;
let isRedirecting = false;

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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token available - handle session expiry without redirect
          isRefreshing = false;
          localStorage.removeItem('token');
          // Instead of redirecting, just return the error
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data.token) {
          // Save new tokens
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          
          // Update auth header
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          }
          
          isRefreshing = false;
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed
        isRefreshing = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // Instead of redirecting, just return the error
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Safe redirect helper that prevents too many redirects
export const safeRedirect = (path: string) => {
  if (!isRedirecting) {
    isRedirecting = true;
    // Small timeout to prevent multiple redirects
    setTimeout(() => {
      window.location.href = path;
      // Reset flag after redirect
      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }, 100);
  }
};

// Keep backend alive function with safety limits
export const keepBackendAlive = () => {
  // Use a reference to track the interval
  let pingInterval: string | number | NodeJS.Timeout | null | undefined = null;
  
  // Only set up the ping if it's not already running
  if (!pingInterval) {
    pingInterval = setInterval(() => {
      axios.get(`${API_BASE_URL}/health`)
        .catch(err => console.log('Ping error (can be ignored):', err));
    }, 10 * 60 * 1000); // 10 minutes
  }
  
  // Provide a way to clear the interval if needed
  return () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  };
};

export default api;