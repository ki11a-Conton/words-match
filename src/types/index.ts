export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'fruit_tea' | 'milk_tea' | 'pure_tea';
  image: string;
  temperature: string;
  sweetness: string;
  size: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  temperature: string;
  sweetness: string;
  size: string;
  price: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  temperature: string;
  sweetness: string;
  size: string;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  postalCode: string;
  stripePaymentId?: string;
  stripeSessionId?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type ProductCategory = 'fruit_tea' | 'milk_tea' | 'pure_tea';

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export const categoryLabels: Record<string, string> = {
  fruit_tea: '水果茶',
  milk_tea: '奶茶',
  pure_tea: '纯茶',
};

export const temperatureLabels: Record<string, string> = {
  cold: '冷饮',
  hot: '热饮',
};

export const sweetnessLabels: Record<string, string> = {
  full: '全糖',
  seventy: '七分糖',
  fifty: '五分糖',
  thirty: '三分糖',
  none: '无糖',
};

export const sizeLabels: Record<string, string> = {
  medium: '中杯',
  large: '大杯',
  extra_large: '超大杯',
};

export const orderStatusLabels: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  preparing: '制作中',
  ready: '待取餐',
  completed: '已完成',
  cancelled: '已取消',
};
