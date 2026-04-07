import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package } from 'lucide-react';
import { paymentApi } from '../services/api';
import type { Order } from '../types';
import { orderStatusLabels } from '../types';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await paymentApi.verify(sessionId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to verify payment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-20 text-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-cream-200 rounded-full mx-auto mb-6" />
          <div className="h-8 bg-cream-200 rounded w-1/2 mx-auto mb-4" />
          <div className="h-4 bg-cream-200 rounded w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-display-md text-charcoal mb-4">支付成功</h1>
          <p className="text-charcoal-muted text-lg mb-8">
            感谢您的订单！我们将尽快为您准备。
          </p>

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 text-left mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg text-charcoal flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  订单详情
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'paid'
                      ? 'bg-brand-green-light text-brand-green'
                      : 'bg-cream-200 text-charcoal-muted'
                  }`}
                >
                  {orderStatusLabels[order.status]}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-charcoal font-medium">{item.productName}</p>
                      <p className="text-sm text-charcoal-muted">
                        数量: {item.quantity}
                      </p>
                    </div>
                    <p className="text-charcoal font-medium">
                      ¥{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-200 pt-4 space-y-2">
                <div className="flex justify-between text-charcoal-muted">
                  <span>收件人</span>
                  <span>{order.recipientName}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>联系电话</span>
                  <span>{order.recipientPhone}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>配送地址</span>
                  <span>{order.address}, {order.city}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-cream-200">
                  <span className="text-charcoal font-medium">订单总额</span>
                  <span className="text-xl font-display text-charcoal">
                    ¥{order.total.toFixed(0)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders" className="btn-secondary">
              查看订单
            </Link>
            <Link to="/products" className="btn-primary">
              继续购物
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
