import api from './api';

export const customerService = {
  async getAllCustomers() {
    try {
      const response = await api.get('/customers');
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Get customers error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch customers' };
    }
  },

  async getCustomers() {
    return this.getAllCustomers();
  },

  async getCustomer(id) {
    try {
      const response = await api.get(`/customers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get customer error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch customer' };
    }
  },

  async createCustomer(customerData) {
    try {
      const response = await api.post('/customers', customerData);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Create customer error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create customer' };
    }
  },

  async updateCustomer(id, customerData) {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update customer error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to update customer' };
    }
  },

  async deleteCustomer(id) {
    try {
      await api.delete(`/customers/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Delete customer error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to delete customer' };
    }
  }
};

export const supplierService = {
  async getAllSuppliers() {
    try {
      const response = await api.get('/suppliers');
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Get suppliers error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch suppliers' };
    }
  },

  async getSuppliers() {
    return this.getAllSuppliers();
  },

  async getSupplier(id) {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get supplier error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch supplier' };
    }
  },

  async createSupplier(supplierData) {
    try {
      const response = await api.post('/suppliers', supplierData);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Create supplier error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create supplier' };
    }
  },

  async updateSupplier(id, supplierData) {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update supplier error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to update supplier' };
    }
  },

  async deleteSupplier(id) {
    try {
      await api.delete(`/suppliers/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Delete supplier error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to delete supplier' };
    }
  }
};
