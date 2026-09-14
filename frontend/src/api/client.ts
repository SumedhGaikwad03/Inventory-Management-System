import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'; 
// this config allows typescript to undrstand errors,urls etc 
import { storage } from '../utils/storage.ts';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5062/api';

/**
 * Configured Axios instance with JWT interceptor and standard headers
 */
export const apiClient: AxiosInstance = axios.create({ // this tells that apiclient is an instance of the axios 
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
}); // here we have configure axios instant 

// Request interceptor: Attach JWT token if available
// this runs before requests leaves our frontend 
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken(); // cheks local stroage for jwt 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } // attach jwt for each request 
    return config; // congif is returned to axios 
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
    return Promise.reject(error); // The interceptor preserves the rejected Axios error and passes it back to whatever code called the API.
    //  Usually, that is a feature API caller in a Page or Component, where a local try/catch handles it.
  }
);
