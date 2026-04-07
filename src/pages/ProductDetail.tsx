import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { productApi } from '../services/api';
import { useAuthStore, useCartStore } from '../store';
import type { Product } from '../types';
import { temperatureLabels, sweetnessLabels, sizeLabels, categoryLabels } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState('cold');
  const [sweetness, setSweetness] = useState('fifty');
  const [size, setSize] = useState('medium');
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await productApi.getById(id);
        setProduct(data);
        const temps = data.temperature.split(',');
        if (temps.length > 0) setTemperature(temps[0]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    setIsAdding(true);
    try {
      await addItem(product, quantity, temperature, sweetness, size);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-2/3" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const temperatures = product.temperature.split(',');
  const sweetnesses = product.sweetness.split(',');
  const sizes = product.size.split(',');

  const sizePriceAdjustment: Record<string, number> = {
    medium: 0,
    large: 3,
    extra_large: 6,
  };

  const finalPrice = product.price + (sizePriceAdjustment[size] || 0);

  return (
    <div className="animate-fade-in min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-16">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回产品列表</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 bg-brand-green-light text-brand-green text-sm font-medium rounded-full mb-4">
              {categoryLabels[product.category]}
            </span>

            <h1 className="text-display-md text-black mb-4">{product.name}</h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="text-3xl font-display text-black mb-8">
              ¥{product.price.toFixed(0)}
              {size !== 'medium' && (
                <span className="text-base text-gray-500 ml-2">
                  ({{ medium: '中杯', large: '大杯 +¥3', extra_large: '超大杯 +¥6' }[size]})
                </span>
              )}
            </div>

            {temperatures.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-3">温度</label>
                <div className="flex flex-wrap gap-3">
                  {temperatures.map((temp) => (
                    <button
                      key={temp}
                      onClick={() => setTemperature(temp)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                        temperature === temp
                          ? 'bg-brand-green text-white border-brand-green'
                          : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {temperatureLabels[temp]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sweetnesses.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-3">甜度</label>
                <div className="flex flex-wrap gap-3">
                  {sweetnesses.map((sweet) => (
                    <button
                      key={sweet}
                      onClick={() => setSweetness(sweet)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                        sweetness === sweet
                          ? 'bg-brand-green text-white border-brand-green'
                          : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {sweetnessLabels[sweet]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 1 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-black mb-3">杯型</label>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                        size === s
                          ? 'bg-brand-green text-white border-brand-green'
                          : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {sizeLabels[s]}
                      {s === 'large' && ' +¥3'}
                      {s === 'extra_large' && ' +¥6'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-medium text-black mb-3">数量</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-primary flex-1 relative overflow-hidden"
              >
                {showSuccess ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    已加入购物车
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    加入购物车 · ¥{(finalPrice * quantity).toFixed(0)}
                  </span>
                )}
              </button>
            </div>

            {!isAuthenticated && (
              <p className="text-gray-500 text-sm mt-4 text-center">
                <Link to="/login" className="text-brand-green hover:underline">
                  登录
                </Link>{' '}
                后可将商品加入购物车
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
