// src/api/index.js
import axios from 'axios';

// Dùng biến môi trường
const API_URL = import.meta.env.VITE_API_URL || 'https://ktpm-backend.onrender.com';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product APIs
export const productAPI = {
  getAll: () => api.get('/api/v2/products'),
  getById: (id) => api.get(`/api/v2/products/${id}`),
  search: (query) => api.get(`/api/v2/products/search?q=${query}`),
  create: (productData) => api.post('/api/v2/products', productData),
  update: (id, productData) => api.put(`/api/v2/products/${id}`, productData),
  delete: (id) => api.delete(`/api/v2/products/${id}`),
  updateStatus: (id, status) => api.patch(`/api/v2/products/${id}/status`, { status }),
  getCategories: () => api.get('/api/v2/products/categories'),
};

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/v1/auth/login', credentials),
  register: (userData) => api.post('/api/v1/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  checkAuth: () => api.get('/api/v1/auth/check'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/api/v1/users/profile'),
  updateProfile: (data) => api.put('/api/v1/users/profile', data),
  changePassword: (data) => api.put('/api/v1/users/change-password', data),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/api/v1/admin/stats'),
  getAllUsers: () => api.get('/api/v1/admin/users'),
  updateUserRole: (userId, role) => api.put(`/api/v1/admin/users/${userId}/role`, { role }),
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle expired tokens
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.href.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;