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

export default api;
export { api };