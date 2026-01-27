import api from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return { success: false, error: 'Server not running. Please start the backend server.' };
      }
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      
      return { success: true, user };
    } catch (error) {
      console.error('Register error:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return { success: false, error: 'Server not running. Please start the backend server.' };
      }
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  getUserRole() {
    return localStorage.getItem('userRole');
  }
};