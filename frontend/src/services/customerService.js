import api from './api';

export const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch customers' };
    }
  },

  getCustomer: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch customer' };
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create customer' };
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update customer' };
    }
  },

  deleteCustomer: async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to delete customer' };
    }
  }
};
