import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, Phone, User } from 'lucide-react';
import { orderApi } from '../services/api';
import { useAuthStore } from '../store';
import type { Order } from '../types';
import { orderStatusLabels, temperatureLabels, sweetnessLabels, sizeLabels } from '../types';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderApi.getById(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrder();
    }
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <p className="text-charcoal-muted">请先登录查看订单</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-cream-200 rounded" />
          <div className="bg-white rounded-2xl p-6">
            <div className="h-6 bg-cream-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-cream-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-charcoal-muted">订单不存在</p>
        <Link to="/orders" className="btn-secondary mt-4">
          返回订单列表
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-charcoal-muted hover:text-charcoal transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回订单列表</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-display-md text-charcoal">订单详情</h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                order.status === 'paid' || order.status === 'completed'
                  ? 'bg-brand-green-light text-brand-green'
                  : order.status === 'cancelled'
                  ? 'bg-red-50 text-red-500'
                  : 'bg-cream-200 text-charcoal-muted'
              }`}
            >
              {orderStatusLabels[order.status]}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6"
            >
              <h2 className="font-display text-lg text-charcoal mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                订单商品
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4 border-b border-cream-100 last:border-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <p className="text-charcoal font-medium">{item.productName}</p>
                      <p className="text-sm text-charcoal-muted mt-1">
                        {temperatureLabels[item.temperature]} · {sweetnessLabels[item.sweetness]} · {sizeLabels[item.size]}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-charcoal-muted">x{item.quantity}</span>
                        <span className="text-charcoal font-medium">
                          ¥{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-cream-200">
                <span className="text-charcoal font-medium">订单总额</span>
                <span className="text-2xl font-display text-charcoal">
                  ¥{order.total.toFixed(0)}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6"
            >
              <h2 className="font-display text-lg text-charcoal mb-4">配送信息</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-charcoal-muted mt-0.5" />
                  <div>
                    <p className="text-sm text-charcoal-muted">收件人</p>
                    <p className="text-charcoal">{order.recipientName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-charcoal-muted mt-0.5" />
                  <div>
                    <p className="text-sm text-charcoal-muted">联系电话</p>
                    <p className="text-charcoal">{order.recipientPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-charcoal-muted mt-0.5" />
                  <div>
                    <p className="text-sm text-charcoal-muted">配送地址</p>
                    <p className="text-charcoal">
                      {order.address}, {order.city}
                      {order.postalCode && ` ${order.postalCode}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-cream-200">
                <p className="text-sm text-charcoal-muted">
                  下单时间: {new Date(order.createdAt).toLocaleString('zh-CN')}
                </p>
                <p className="text-sm text-charcoal-muted mt-2">
                  订单编号: {order.id}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
