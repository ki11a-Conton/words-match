import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, X } from 'lucide-react';
import { orderApi } from '../../services/api';
import { useAuthStore } from '../../store';
import type { Order } from '../../types';
import { orderStatusLabels, temperatureLabels, sweetnessLabels, sizeLabels } from '../../types';
import type { OrderStatus } from '../../types';

export default function AdminOrders() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAllAdmin();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await orderApi.updateStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        const updatedOrder = orders.find((o) => o.id === orderId);
        if (updatedOrder) {
          setSelectedOrder({ ...updatedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('更新失败，请重试');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="animate-fade-in min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-display-md text-charcoal mb-2">订单管理</h1>
          <p className="text-charcoal-muted mb-8">管理所有订单</p>
        </motion.div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="h-6 bg-cream-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-cream-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">订单ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">客户</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">商品</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">金额</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">状态</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-charcoal-muted">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-charcoal-muted text-sm font-mono">
                          {order.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-charcoal font-medium">{order.recipientName}</p>
                          <p className="text-sm text-charcoal-muted">{order.recipientPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-charcoal-muted">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件
                        </span>
                      </td>
                      <td className="px-6 py-4 text-charcoal font-medium">
                        ¥{order.total.toFixed(0)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          disabled={isUpdating}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                            order.status === 'paid'
                              ? 'bg-blue-50 text-blue-600'
                              : order.status === 'completed'
                              ? 'bg-brand-green-light text-brand-green'
                              : order.status === 'cancelled'
                              ? 'bg-red-50 text-red-500'
                              : 'bg-cream-200 text-charcoal-muted'
                          }`}
                        >
                          <option value="pending">待支付</option>
                          <option value="paid">已支付</option>
                          <option value="preparing">制作中</option>
                          <option value="ready">待取餐</option>
                          <option value="completed">已完成</option>
                          <option value="cancelled">已取消</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-charcoal-muted hover:text-brand-green transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-charcoal">订单详情</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-charcoal-muted">订单ID</p>
                    <p className="text-charcoal font-mono">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-muted">状态</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedOrder.status === 'paid'
                          ? 'bg-blue-50 text-blue-600'
                          : selectedOrder.status === 'completed'
                          ? 'bg-brand-green-light text-brand-green'
                          : 'bg-cream-200 text-charcoal-muted'
                      }`}
                    >
                      {orderStatusLabels[selectedOrder.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-muted">收件人</p>
                    <p className="text-charcoal">{selectedOrder.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-muted">联系电话</p>
                    <p className="text-charcoal">{selectedOrder.recipientPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-charcoal-muted">配送地址</p>
                    <p className="text-charcoal">
                      {selectedOrder.address}, {selectedOrder.city}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-charcoal-muted mb-3">商品列表</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-cream-50 rounded-lg">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-charcoal font-medium">{item.productName}</p>
                          <p className="text-sm text-charcoal-muted">
                            {temperatureLabels[item.temperature]} · {sweetnessLabels[item.sweetness]} · {sizeLabels[item.size]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-charcoal-muted">x{item.quantity}</p>
                          <p className="text-charcoal font-medium">¥{(item.price * item.quantity).toFixed(0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-cream-200">
                  <span className="text-charcoal font-medium">订单总额</span>
                  <span className="text-2xl font-display text-charcoal">
                    ¥{selectedOrder.total.toFixed(0)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
