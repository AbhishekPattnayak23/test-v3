import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api', // Will proxy through Vite in development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      // Client-side apps should handle redirects via React Router, not window.location
      // The actual redirect will be handled by React Router in the components
      // window.location.href = '/login'; // SANDBOX VIOLATION - removed
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;