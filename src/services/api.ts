import axios from 'axios';
import type { User, Product, CartItem, Order } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (data: { email: string; password: string; name: string }): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const productApi = {
  getAll: async (category?: string): Promise<Product[]> => {
    const params = category ? { category } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const cartApi = {
  getAll: async (): Promise<CartItem[]> => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  add: async (data: {
    productId: string;
    quantity: number;
    temperature: string;
    sweetness: string;
    size: string;
  }): Promise<CartItem> => {
    const response = await api.post('/cart', data);
    return response.data;
  },
  
  update: async (id: string, quantity: number): Promise<CartItem> => {
    const response = await api.put(`/cart/${id}`, { quantity });
    return response.data;
  },
  
  remove: async (id: string): Promise<void> => {
    await api.delete(`/cart/${id}`);
  },
  
  clear: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  create: async (data: {
    recipientName: string;
    recipientPhone: string;
    address: string;
    city: string;
    postalCode: string;
    items: Array<{
      productId: string;
      productName: string;
      productImage: string;
      quantity: number;
      price: number;
      temperature: string;
      sweetness: string;
      size: string;
    }>;
  }): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
  
  getAllAdmin: async (): Promise<Order[]> => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },
};

export const paymentApi = {
  createCheckoutSession: async (orderId: string): Promise<{ checkoutUrl: string }> => {
    const response = await api.post('/payment/create-checkout-session', { orderId });
    return response.data;
  },
  
  verify: async (sessionId: string): Promise<Order> => {
    const response = await api.get(`/payment/verify/${sessionId}`);
    return response.data;
  },
};

export default api;
