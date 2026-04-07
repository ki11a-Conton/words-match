import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';
import { temperatureLabels, sweetnessLabels, sizeLabels } from '../types';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, isLoading, isInitialized, fetchCart, updateQuantity, removeItem, getTotal } = useCartStore();

  useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      fetchCart();
    }
  }, [isAuthenticated, isInitialized, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(id, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (!isAuthenticated) {
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
          <h1 className="text-display-md text-charcoal mb-8">购物车</h1>
        </motion.div>

        {isLoading && !isInitialized ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 flex gap-6">
                <div className="w-24 h-24 bg-cream-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-cream-200 rounded w-1/3" />
                  <div className="h-4 bg-cream-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-cream-300 mx-auto mb-6" />
            <h2 className="text-xl text-charcoal mb-2">购物车是空的</h2>
            <p className="text-charcoal-muted mb-8">快去挑选你喜欢的茶饮吧</p>
            <Link to="/products" className="btn-primary">
              浏览产品
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 flex gap-6"
                >
                  <Link to={`/products/${item.productId}`} className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-display text-lg text-charcoal hover:text-brand-green transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-charcoal-muted mt-1">
                      {temperatureLabels[item.temperature]} · {sweetnessLabels[item.sweetness]} · {sizeLabels[item.size]}
                    </p>
                    <p className="text-brand-green font-medium mt-2">¥{item.price.toFixed(0)}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-charcoal-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-lg font-medium text-charcoal">
                      ¥{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 sticky top-24"
              >
                <h2 className="font-display text-xl text-charcoal mb-6">订单摘要</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-charcoal-muted">
                    <span>商品数量</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>配送费</span>
                    <span>免费</span>
                  </div>
                </div>

                <div className="border-t border-cream-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal font-medium">总计</span>
                    <span className="text-2xl font-display text-charcoal">
                      ¥{getTotal().toFixed(0)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full"
                >
                  去结算
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>

                <Link
                  to="/products"
                  className="block text-center text-sm text-charcoal-muted hover:text-charcoal mt-4 transition-colors"
                >
                  继续购物
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
