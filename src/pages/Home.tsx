import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Coffee, Leaf, Award, Sparkles, MapPin, Instagram, Globe, MessageSquare } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productApi } from '../services/api';
import type { Product } from '../types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productApi.getAll();
        setFeaturedProducts(products.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const features = [
    {
      icon: Coffee,
      title: '新鲜原料',
      description: '精选优质茶叶与新鲜水果，每日新鲜制作',
    },
    {
      icon: Leaf,
      title: '手工现制',
      description: '专业茶饮师手工调制，保证每一杯的品质',
    },
    {
      icon: Sparkles,
      title: '灵感创作',
      description: '不断创新口味，为您带来惊喜体验',
    },
    {
      icon: Award,
      title: '品质保证',
      description: '严格的品质控制，确保每一杯都完美',
    },
  ];

  const stores = [
    {
      id: 1,
      name: '北京三里屯店',
      address: '北京市朝阳区三里屯太古里',
      hours: '10:00 - 22:00',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tea%20shop%20exterior%2C%20minimalist%20design%2C%20black%20and%20white%20with%20red%20accent%2C%20professional%20photography&image_size=square',
    },
    {
      id: 2,
      name: '上海新天地店',
      address: '上海市黄浦区新天地',
      hours: '10:00 - 22:00',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tea%20shop%20exterior%2C%20minimalist%20design%2C%20black%20and%20white%20with%20red%20accent%2C%20professional%20photography&image_size=square',
    },
    {
      id: 3,
      name: '广州天河店',
      address: '广州市天河区天河城',
      hours: '10:00 - 22:00',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20tea%20shop%20exterior%2C%20minimalist%20design%2C%20black%20and%20white%20with%20red%20accent%2C%20professional%20photography&image_size=square',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20milk%20tea%20in%20clear%20glass%2C%20minimalist%20style%2C%20black%20and%20white%20with%20red%20accent%2C%20professional%20product%20photography%2C%20dramatic%20lighting&image_size=landscape_16_9" 
            alt="茶里九世招牌奶茶" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              茶里九世
              <br />
              <span className="text-brand-red">灵感之茶</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              每一杯茶，都是我们对品质的执着追求
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="btn-primary">
                立即点单
              </Link>
              <Link to="/products" className="btn-secondary text-white border-white hover:bg-white/10">
                探索产品
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <ArrowDown className="w-8 h-8 text-white" />
        </motion.div>
      </section>

      {/* Product Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">灵感产品</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                每一款都是我们用心打造的杰作，只为给您带来最纯粹的味觉享受
              </p>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Link to="/products" className="btn-primary">
              查看全部产品
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20tea%20shop%20interior%2C%20minimalist%20design%2C%20black%20and%20white%20with%20red%20accent%2C%20natural%20light%2C%20professional%20interior%20photography&image_size=portrait_4_3"
                  alt="茶里九世门店"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-brand-red text-sm font-medium tracking-wider uppercase">
                品牌故事
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-black mt-4 mb-6">
                源于热爱，忠于品质
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                茶里九世诞生于对茶饮文化的热爱。我们相信，一杯好茶不仅仅是饮品，更是一种生活态度的体现。从原料选择到制作工艺，每一个环节我们都精益求精。
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                我们与优质茶园建立长期合作，确保每一片茶叶都来自最佳产地。新鲜水果每日配送，只为给您呈现最纯正的风味。这不仅是我们的承诺，更是我们的坚持。
              </p>
              <Link to="/products" className="btn-primary">
                了解更多
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">特色亮点</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                我们坚持以高品质原料和创新工艺，为您带来最纯粹的茶饮体验
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <feature.icon className="w-10 h-10 text-brand-red" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">门店信息</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                寻找离你最近的茶里九世门店
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <div className="aspect-square">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2">{store.name}</h3>
                  <div className="flex items-start mb-3">
                    <MapPin className="w-5 h-5 text-brand-red mr-2 mt-1" />
                    <p className="text-gray-600">{store.address}</p>
                  </div>
                  <p className="text-gray-500">{store.hours}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link to="/products" className="btn-secondary">
              查找附近门店
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social & Membership Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">加入会员</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                成为茶里九世会员，享受专属优惠和特权。每一杯茶都为您积累积分，兑换精美礼品和限量产品。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary">
                  立即注册
                </Link>
                <Link to="/login" className="btn-secondary">
                  会员登录
                </Link>
              </div>
              
              <div className="mt-12">
                <h3 className="text-xl font-bold text-black mb-4">关注我们</h3>
                <div className="flex space-x-6">
                  <a href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                    <Globe className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                    <MessageSquare className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">公众号二维码</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-black text-white text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">准备好开始了吗？</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
              探索我们的产品系列，找到属于你的那一杯
            </p>
            <Link to="/products" className="btn-accent">
              立即点单
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
