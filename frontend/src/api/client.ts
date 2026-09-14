import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
// this config allows typescript to understand errors,urls etc
import { storage } from '../utils/storage.ts';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5062/api';

/**
 * Configured Axios instance with JWT interceptor and standard headers
 */
// this tells that apiclient is an instance of the axios
// here we have configured axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT token if available
// this runs before requests leave our frontend
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // checks local storage for jwt
    const token = storage.getToken();
    if (token && config.headers) {
      // attach jwt for each request
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config is returned to axios
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global handling for 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid/expired token and notify auth state
      storage.clearToken();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    // The interceptor preserves the rejected Axios error and passes it back to whatever code called the API.
    //  Usually, that is a feature API caller in a Page or Component, where a local try/catch handles it.
    return Promise.reject(error);
  }
);
