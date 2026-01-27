import api from './api';

export const courierService = {
  getAllCouriers: async () => {
    const response = await api.get('/couriers');
    return response.data;
  },

  getCourier: async (id) => {
    const response = await api.get(`/couriers/${id}`);
    return response.data;
  },

  createCourier: async (courierData) => {
    const response = await api.post('/couriers', courierData);
    return response.data;
  },

  updateCourier: async (id, courierData) => {
    const response = await api.put(`/couriers/${id}`, courierData);
    return response.data;
  },

  deleteCourier: async (id) => {
    const response = await api.delete(`/couriers/${id}`);
    return response.data;
  }
};

export const shipmentService = {
  getAllShipments: async () => {
    const response = await api.get('/shipments');
    return response.data;
  },

  getShipment: async (id) => {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },

  trackShipment: async (trackingNumber) => {
    const response = await api.get(`/shipments/track/${trackingNumber}`);
    return response.data;
  },

  getShipmentsByOrder: async (orderId) => {
    const response = await api.get(`/shipments/order/${orderId}`);
    return response.data;
  },

  createShipment: async (shipmentData) => {
    const response = await api.post('/shipments', shipmentData);
    return response.data;
  },

  updateShipmentStatus: async (id, statusData) => {
    const response = await api.put(`/shipments/${id}/status`, statusData);
    return response.data;
  },

  updateShipment: async (id, shipmentData) => {
    const response = await api.put(`/shipments/${id}`, shipmentData);
    return response.data;
  }
};
