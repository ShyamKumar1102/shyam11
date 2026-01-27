import api from './api';

export const productService = {
  async getProducts() {
    try {
      const response = await api.get('/products');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get products error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch products' };
    }
  },

  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get product error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch product' };
    }
  },

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create product error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create product' };
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to update product' };
    }
  },

  async deleteProduct(productId) {
    try {
      await api.delete(`/products/${productId}`);
      return { success: true };
    } catch (error) {
      console.error('Delete product error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to delete product' };
    }
  }
};

export const stockService = {
  async getStock() {
    try {
      const response = await api.get('/stock');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get stock error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch stock' };
    }
  },

  async addStock(stockData) {
    try {
      const response = await api.post('/stock', stockData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Add stock error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to add stock' };
    }
  },

  async updateStock(id, stockData) {
    try {
      const response = await api.put(`/stock/${id}`, stockData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Update stock error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to update stock' };
    }
  },

  async dispatchStock(id, dispatchQuantity) {
    try {
      const response = await api.post(`/stock/${id}/dispatch`, { dispatchQuantity });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Dispatch stock error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to dispatch stock' };
    }
  }
};

export const orderService = {
  async getOrders() {
    try {
      const response = await api.get('/orders');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get orders error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch orders' };
    }
  },

  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Create order error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to create order' };
    }
  },

  async getIncomeSummary(startDate, endDate) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/orders/income/summary', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get income summary error:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to fetch income summary' };
    }
  }
};