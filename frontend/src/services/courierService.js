import api from './api';

export const courierService = {
  async getAllCouriers() {
    try {
      const response = await api.get('/couriers');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching couriers:', error);
      return [];
    }
  }
};

export const shipmentService = {
  async getAllShipments() {
    try {
      const response = await api.get('/shipments');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching shipments:', error);
      return [];
    }
  },

  async getShipment(id) {
    try {
      const response = await api.get(`/shipments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw error;
    }
  },

  async createShipment(shipmentData) {
    try {
      const response = await api.post('/shipments', shipmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      return null;
    }
  },

  async updateShipmentStatus(id, statusData) {
    try {
      const response = await api.put(`/shipments/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error;
    }
  }
};