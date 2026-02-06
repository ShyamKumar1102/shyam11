import api from './api';

export const invoiceService = {
  async getInvoices() {
    try {
      const response = await api.get('/invoices');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch invoices' };
    }
  },

  async createInvoice(invoiceData) {
    try {
      const response = await api.post('/invoices', invoiceData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create invoice' };
    }
  }
};

export const purchaseOrderService = {
  async getPurchaseOrders() {
    try {
      const response = await api.get('/purchase-orders');
      return { success: true, data: response.data || [] };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch purchase orders' };
    }
  },

  async createPurchaseOrder(orderData) {
    try {
      const response = await api.post('/purchase-orders', orderData);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create purchase order' };
    }
  }
};

export const purchaseBillService = {
  async getPurchaseBills() {
    try {
      const response = await api.get('/purchase-bills');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch purchase bills' };
    }
  },

  async createPurchaseBill(billData) {
    try {
      const response = await api.post('/purchase-bills', billData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to create purchase bill' };
    }
  },

  async updatePurchaseBill(id, billData) {
    try {
      const response = await api.put(`/purchase-bills/${id}`, billData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update purchase bill' };
    }
  },

  async deletePurchaseBill(id) {
    try {
      await api.delete(`/purchase-bills/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to delete purchase bill' };
    }
  }
};