import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Award, Heart } from 'lucide-react';
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
        setFeaturedProducts(products.slice(0, 6));
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
      icon: Leaf,
      title: '新鲜原料',
      description: '精选优质茶叶与新鲜水果，每日新鲜制作',
    },
    {
      icon: Award,
      title: '匠心品质',
      description: '专业茶饮师团队，传承与创新完美结合',
    },
    {
      icon: Heart,
      title: '用心服务',
      description: '每一杯都承载着我们对品质的执着追求',
    },
  ];

  return (
    <div className="animate-fade-in">
      <section className="gradient-hero min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-green-light/50 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="inline-block px-4 py-2 bg-brand-green/10 text-brand-green text-sm font-medium rounded-full mb-6">
                新鲜制作 · 品质保证
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="text-display-xl lg:text-[4.5rem] text-charcoal mb-6 leading-tight"
            >
              一杯好茶
              <br />
              <span className="text-brand-green">一种生活</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-lg lg:text-xl text-charcoal-muted mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              我们相信，真正的品质源于对细节的执着。每一杯茶饮，都是我们对美好生活的诠释。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/products" className="btn-primary">
                探索产品
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link to="/products?category=milk_tea" className="btn-secondary">
                热门推荐
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-100 to-transparent" />
      </section>

      <section className="py-20 lg:py-30 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-green-light flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="font-display text-xl text-charcoal mb-3">{feature.title}</h3>
                <p className="text-charcoal-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">精选产品</h2>
              <p className="section-subtitle">
                每一款都是我们用心打造的杰作，只为给您带来最纯粹的味觉享受
              </p>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-cream-200" />
                  <div className="p-5">
                    <div className="h-6 bg-cream-200 rounded w-2/3 mb-3" />
                    <div className="h-4 bg-cream-200 rounded w-full mb-2" />
                    <div className="h-4 bg-cream-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
            className="text-center mt-12"
          >
            <Link to="/products" className="btn-secondary">
              查看全部产品
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-30 bg-charcoal text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-green text-sm font-medium tracking-wider uppercase">
                我们的故事
              </span>
              <h2 className="font-display text-display-lg text-white mt-4 mb-6">
                源于热爱，忠于品质
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                茶里九世诞生于对茶饮文化的热爱。我们相信，一杯好茶不仅仅是饮品，更是一种生活态度的体现。从原料选择到制作工艺，每一个环节我们都精益求精。
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                我们与优质茶园建立长期合作，确保每一片茶叶都来自最佳产地。新鲜水果每日配送，只为给您呈现最纯正的风味。这不仅是我们的承诺，更是我们的坚持。
              </p>
              <Link to="/products" className="btn-accent">
                开始探索
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-4xl overflow-hidden">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20milk%20tea%20shop%20interior%2C%20minimalist%20design%2C%20natural%20light%2C%20wooden%20furniture%2C%20green%20plants%2C%20cozy%20atmosphere%2C%20professional%20interior%20photography&image_size=portrait_4_3"
                  alt="茶里九世门店"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-green rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-30 gradient-subtle">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">准备好开始了吗？</h2>
            <p className="section-subtitle mb-10">
              探索我们的产品系列，找到属于你的那一杯
            </p>
            <Link to="/products" className="btn-primary">
              立即选购
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
