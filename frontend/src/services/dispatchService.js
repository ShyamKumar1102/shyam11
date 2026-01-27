import api from './api';

export const dispatchService = {
  async getDispatchHistory() {
    try {
      const response = await api.get('/dispatch');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get dispatch history error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch dispatch history' };
    }
  },

  async createDispatch(dispatchData) {
    try {
      const response = await api.post('/dispatch', dispatchData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create dispatch error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create dispatch record' };
    }
  }
};
