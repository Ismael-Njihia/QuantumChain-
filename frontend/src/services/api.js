import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateWallet: (walletAddress) => api.put('/auth/wallet', { walletAddress }),
};

export const tokenAPI = {
  purchase: (data) => api.post('/tokens/purchase', data),
  getBalance: () => api.get('/tokens/balance'),
  transfer: (data) => api.post('/tokens/transfer', data),
  getTransactions: (page = 1, limit = 10) => api.get(`/tokens/transactions?page=${page}&limit=${limit}`),
  stake: (amount) => api.post('/tokens/stake', { amount }),
  unstake: (amount) => api.post('/tokens/unstake', { amount }),
};

export const contactAPI = {
  send: (data) => api.post('/contact/send', data),
  subscribe: (email) => api.post('/contact/subscribe', { email }),
};

export default api;
