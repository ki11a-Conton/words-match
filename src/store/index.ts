import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, CartItem, Product } from '../types';
import { authApi, cartApi } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authApi.login({ email, password });
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authApi.register({ email, password, name });
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        
        set({ isLoading: true });
        try {
          const user = await authApi.getMe();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },
      
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isInitialized: boolean;
  
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity: number, temperature: string, sweetness: string, size: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: false,
  isInitialized: false,
  
  fetchCart: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ items: [], isInitialized: true });
      return;
    }
    
    set({ isLoading: true });
    try {
      const items = await cartApi.getAll();
      set({ items, isLoading: false, isInitialized: true });
    } catch {
      set({ items: [], isLoading: false, isInitialized: true });
    }
  },
  
  addItem: async (product: Product, quantity: number, temperature: string, sweetness: string, size: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('请先登录');
    }
    
    set({ isLoading: true });
    try {
      const newItem = await cartApi.add({
        productId: product.id,
        quantity,
        temperature,
        sweetness,
        size,
      });
      
      const existingIndex = get().items.findIndex(item => item.id === newItem.id);
      if (existingIndex >= 0) {
        const newItems = [...get().items];
        newItems[existingIndex] = newItem;
        set({ items: newItems, isLoading: false });
      } else {
        set({ items: [newItem, ...get().items], isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateQuantity: async (id: string, quantity: number) => {
    set({ isLoading: true });
    try {
      const updatedItem = await cartApi.update(id, quantity);
      const newItems = get().items.map(item => 
        item.id === id ? updatedItem : item
      );
      set({ items: newItems, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  removeItem: async (id: string) => {
    set({ isLoading: true });
    try {
      await cartApi.remove(id);
      const newItems = get().items.filter(item => item.id !== id);
      set({ items: newItems, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  clearCart: async () => {
    try {
      await cartApi.clear();
      set({ items: [] });
    } catch (error) {
      throw error;
    }
  },
  
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
