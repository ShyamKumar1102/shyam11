import api from './api';

export const supplierService = {
  getSuppliers: async () => {
    try {
      const response = await api.get('/suppliers');
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch suppliers' };
    }
  },

  getSupplier: async (id) => {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch supplier' };
    }
  },

  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/suppliers', supplierData);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create supplier' };
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update supplier' };
    }
  },

  deleteSupplier: async (id) => {
    try {
      await api.delete(`/suppliers/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to delete supplier' };
    }
  }
};
