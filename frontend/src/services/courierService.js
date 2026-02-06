import api from './api';

export const courierService = {
  // Get all couriers
  getCouriers: async () => {
    try {
      const response = await api.get('/couriers');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching couriers:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch couriers' };
    }
  },

  // Get all active couriers (for backward compatibility)
  getAllCouriers: async () => {
    try {
      const response = await api.get('/couriers');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching couriers:', error);
      return [];
    }
  },

  // Create new courier
  createCourier: async (courierData) => {
    try {
      const response = await api.post('/couriers', courierData);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error('Error creating courier:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create courier' };
    }
  },

  // Update courier
  updateCourier: async (courierId, courierData) => {
    try {
      const response = await api.put(`/couriers/${courierId}`, courierData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating courier:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update courier' };
    }
  },

  // Delete courier
  deleteCourier: async (courierId) => {
    try {
      await api.delete(`/couriers/${courierId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting courier:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to delete courier' };
    }
  },

  // Get courier by ID
  getCourierById: async (courierId) => {
    try {
      const response = await api.get(`/couriers/${courierId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching courier:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch courier' };
    }
  }
};

export const shipmentService = {
  // Create new shipment
  createShipment: async (shipmentData) => {
    try {
      const response = await api.post('/shipments', shipmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      return null;
    }
  },

  // Get all shipments
  getShipments: async () => {
    try {
      const response = await api.get('/shipments');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching shipments:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to fetch shipments' };
    }
  },

  // Update shipment status
  updateShipmentStatus: async (shipmentId, status) => {
    try {
      const response = await api.put(`/shipments/${shipmentId}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating shipment status:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update shipment status' };
    }
  }
};