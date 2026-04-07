import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { productApi, orderApi } from '../../services/api';
import { useAuthStore } from '../../store';
import type { Product, Order } from '../../types';
import { categoryLabels, orderStatusLabels } from '../../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          productApi.getAll(),
          orderApi.getAllAdmin(),
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'paid' || o.status === 'preparing').length;

  const stats = [
    {
      label: '总收入',
      value: `¥${totalRevenue.toFixed(0)}`,
      icon: TrendingUp,
      color: 'bg-brand-green-light text-brand-green',
    },
    {
      label: '订单数',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: '产品数',
      value: products.length,
      icon: Package,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: '待处理',
      value: pendingOrders,
      icon: Users,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="animate-fade-in min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-display-md text-charcoal mb-2">管理后台</h1>
          <p className="text-charcoal-muted mb-8">欢迎回来，{user?.name}</p>
        </motion.div>

        {isLoading ? (
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="h-4 bg-cream-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-cream-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6"
                >
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-charcoal-muted text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-display text-charcoal">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg text-charcoal">最近订单</h2>
                  <Link to="/admin/orders" className="text-brand-green text-sm hover:underline">
                    查看全部
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-cream-100 last:border-0">
                      <div>
                        <p className="text-charcoal font-medium">{order.recipientName}</p>
                        <p className="text-sm text-charcoal-muted">
                          {order.items.length} 件商品 · ¥{order.total.toFixed(0)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'paid'
                            ? 'bg-blue-50 text-blue-600'
                            : order.status === 'completed'
                            ? 'bg-brand-green-light text-brand-green'
                            : 'bg-cream-200 text-charcoal-muted'
                        }`}
                      >
                        {orderStatusLabels[order.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg text-charcoal">产品管理</h2>
                  <Link to="/admin/products" className="text-brand-green text-sm hover:underline">
                    查看全部
                  </Link>
                </div>

                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 py-3 border-b border-cream-100 last:border-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-charcoal font-medium truncate">{product.name}</p>
                        <p className="text-sm text-charcoal-muted">{categoryLabels[product.category]}</p>
                      </div>
                      <span className="text-charcoal font-medium">¥{product.price.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
