import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  getProfile: async (token) => {
    const response = await api.get('/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export const tokenAPI = {
  purchaseTokens: async (purchaseData, token) => {
    const response = await api.post('/tokens/purchase', purchaseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getBalance: async (address, token) => {
    const response = await api.get(`/tokens/balance/${address}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getTokenPrice: async () => {
    const response = await api.get('/tokens/price');
    return response.data;
  },
};

export const dexAPI = {
  createOrder: async (orderData, token) => {
    const response = await api.post('/dex/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getOrders: async (token) => {
    const response = await api.get('/dex/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  executeOrder: async (orderId, token) => {
    const response = await api.post(`/dex/orders/${orderId}/execute`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export const ipfsAPI = {
  uploadDocument: async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/ipfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getDocument: async (hash) => {
    const response = await api.get(`/ipfs/file/${hash}`);
    return response.data;
  },
};

export default api;
