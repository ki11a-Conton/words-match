import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { orderApi } from '../services/api';
import { useAuthStore } from '../store';
import type { Order } from '../types';
import { orderStatusLabels, temperatureLabels, sweetnessLabels, sizeLabels } from '../types';

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  paid: <CheckCircle className="w-5 h-5 text-blue-500" />,
  preparing: <Clock className="w-5 h-5 text-orange-500" />,
  ready: <CheckCircle className="w-5 h-5 text-brand-green" />,
  completed: <CheckCircle className="w-5 h-5 text-brand-green" />,
  cancelled: <XCircle className="w-5 h-5 text-red-500" />,
};

export default function Orders() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <p className="text-charcoal-muted">请先登录查看订单</p>
        <Link to="/login" className="btn-primary mt-4">
          去登录
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-display-md text-charcoal mb-8">我的订单</h1>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-cream-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-cream-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-cream-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-cream-300 mx-auto mb-6" />
            <h2 className="text-xl text-charcoal mb-2">暂无订单</h2>
            <p className="text-charcoal-muted mb-8">快去选购您喜欢的茶饮吧</p>
            <Link to="/products" className="btn-primary">
              浏览产品
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {statusIcons[order.status]}
                    <span className="font-medium text-charcoal">
                      {orderStatusLabels[order.status]}
                    </span>
                  </div>
                  <span className="text-sm text-charcoal-muted">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm text-charcoal font-medium">{item.productName}</p>
                        <p className="text-xs text-charcoal-muted">
                          {temperatureLabels[item.temperature]} · {sizeLabels[item.size]} x{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex items-center text-sm text-charcoal-muted">
                      +{order.items.length - 3} 件商品
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-cream-200">
                  <div className="text-charcoal-muted text-sm">
                    共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-display text-charcoal">
                      ¥{order.total.toFixed(0)}
                    </span>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-brand-green text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      查看详情
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
