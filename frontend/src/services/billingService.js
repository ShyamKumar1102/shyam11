import api from './api';

export const invoiceService = {
  async getInvoices() {
    try {
      const response = await api.get('/invoices');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get invoices error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch invoices' };
    }
  },

  async getInvoice(id) {
    try {
      const response = await api.get(`/invoices/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get invoice error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch invoice' };
    }
  },

  async createInvoice(invoiceData) {
    try {
      const response = await api.post('/invoices', invoiceData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create invoice error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create invoice' };
    }
  },

  async updateInvoice(id, invoiceData) {
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update invoice error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to update invoice' };
    }
  },

  async deleteInvoice(id) {
    try {
      await api.delete(`/invoices/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Delete invoice error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to delete invoice' };
    }
  }
};

export const purchaseOrderService = {
  async getPurchaseOrders() {
    try {
      const response = await api.get('/purchase-orders');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get purchase orders error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch purchase orders' };
    }
  },

  async getPurchaseOrder(id) {
    try {
      const response = await api.get(`/purchase-orders/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get purchase order error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch purchase order' };
    }
  },

  async createPurchaseOrder(poData) {
    try {
      const response = await api.post('/purchase-orders', poData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create purchase order error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create purchase order' };
    }
  },

  async updatePurchaseOrder(id, poData) {
    try {
      const response = await api.put(`/purchase-orders/${id}`, poData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update purchase order error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to update purchase order' };
    }
  },

  async deletePurchaseOrder(id) {
    try {
      await api.delete(`/purchase-orders/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Delete purchase order error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to delete purchase order' };
    }
  }
};
