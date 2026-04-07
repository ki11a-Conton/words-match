import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';
import { orderApi, paymentApi } from '../services/api';
import { temperatureLabels, sweetnessLabels, sizeLabels } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, items.length, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const order = await orderApi.create({
        ...formData,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.image,
          quantity: item.quantity,
          price: item.price,
          temperature: item.temperature,
          sweetness: item.sweetness,
          size: item.size,
        })),
      });

      try {
        const { checkoutUrl } = await paymentApi.createCheckoutSession(order.id);
        window.location.href = checkoutUrl;
      } catch (paymentError) {
        console.error('Payment error:', paymentError);
        await clearCart();
        navigate(`/orders/${order.id}`);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('订单创建失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in min-h-screen bg-cream-50">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-charcoal-muted hover:text-charcoal transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回购物车</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-display-md text-charcoal mb-8">结账</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 lg:p-8"
            >
              <h2 className="font-display text-xl text-charcoal mb-6">配送信息</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    收件人姓名 *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="请输入收件人姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    联系电话 *
                  </label>
                  <input
                    type="tel"
                    name="recipientPhone"
                    value={formData.recipientPhone}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="请输入联系电话"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    详细地址 *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="请输入详细地址"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    城市 *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="请输入城市"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    邮政编码
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="请输入邮政编码（选填）"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-cream-200">
                <h3 className="font-display text-lg text-charcoal mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  支付方式
                </h3>
                <div className="bg-cream-50 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div className="flex-1">
                    <p className="text-charcoal font-medium">信用卡支付</p>
                    <p className="text-sm text-charcoal-muted">通过 Stripe 安全支付</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-8 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    处理中...
                  </span>
                ) : (
                  `确认支付 ¥${getTotal().toFixed(0)}`
                )}
              </button>
            </motion.form>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 sticky top-24"
            >
              <h2 className="font-display text-xl text-charcoal mb-6">订单详情</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-charcoal font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-charcoal-muted">
                        {temperatureLabels[item.temperature]} · {sweetnessLabels[item.sweetness]} · {sizeLabels[item.size]}
                      </p>
                      <p className="text-sm text-charcoal-muted">x{item.quantity}</p>
                    </div>
                    <p className="text-charcoal font-medium">
                      ¥{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-200 pt-4 space-y-3">
                <div className="flex justify-between text-charcoal-muted">
                  <span>商品小计</span>
                  <span>¥{getTotal().toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>配送费</span>
                  <span>免费</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-cream-200">
                  <span className="text-charcoal font-medium">总计</span>
                  <span className="text-2xl font-display text-charcoal">
                    ¥{getTotal().toFixed(0)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
