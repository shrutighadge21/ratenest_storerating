import axios from 'axios';
import type { Store, User, Rating, AdminKPIs, UserRole } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.config && error.config.url && !error.config.url.includes('/auth/login')) {
        console.error('[API INTERCEPTOR] 401 Unauthorized received for URL:', error.config?.url);
        fetch('http://localhost:5001/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Interceptor caught 401 for URL: ' + error.config?.url }) }).catch(()=>null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (data: { name: string; email: string; address: string; password: string }) => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },
  updatePassword: async (oldPassword: string, newPassword: string) => {
    const res = await apiClient.patch('/auth/password', { oldPassword, newPassword });
    return res.data;
  },
  updateProfile: async (data: { name?: string; address?: string }) => {
    const res = await apiClient.patch('/auth/profile', data);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

export const adminApi = {
  getDashboardKPIs: async () => {
    const res = await apiClient.get('/users/dashboard');
    return res.data;
  },
  getUsers: async (params?: { search?: string; name?: string; email?: string; address?: string; role?: string; sort?: string }) => {
    const res = await apiClient.get('/users', { params });
    return res.data;
  },
  createUser: async (data: { name: string; email: string; address: string; password: string; role: UserRole }) => {
    const res = await apiClient.post('/users', data);
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
};

export const storesApi = {
  getStores: async (params?: { search?: string; name?: string; address?: string; email?: string; category?: string; sort?: string }) => {
    const res = await apiClient.get('/stores', { params });
    return res.data;
  },
  getMyStore: async () => {
    const res = await apiClient.get('/stores/my-store');
    return res.data;
  },
  createStore: async (data: { name: string; email: string; address: string; ownerId: string; category?: string; description?: string }) => {
    const res = await apiClient.post('/stores', data);
    return res.data;
  },
  deleteStore: async (id: string) => {
    const res = await apiClient.delete(`/stores/${id}`);
    return res.data;
  },
};

export const ratingsApi = {
  submitRating: async (storeId: string, score: number) => {
    const res = await apiClient.post('/ratings', { storeId, score });
    return res.data;
  },
  getStoreRatings: async (storeId: string) => {
    const res = await apiClient.get(`/ratings/${storeId}`);
    return res.data;
  },
};
