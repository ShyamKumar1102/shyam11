import axios from 'axios';

const API_BASE_URL = 'https://shyam11-5oe6.onrender.com/api';

console.log('=== API Configuration ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('========================');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url);
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server may be sleeping');
    } else if (error.response?.status === 503) {
      console.error('Service unavailable - server is starting up');
    }
    return Promise.reject(error);
  }
);

export default api;
export { api };