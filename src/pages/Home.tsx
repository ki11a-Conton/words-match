import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function Home() {
  // 模拟产品数据结构
  const products = [
    { id: 1, name: '招牌奶茶', price: 28 },
    { id: 2, name: '水果茶', price: 32 },
    { id: 3, name: '纯茶', price: 22 },
    { id: 4, name: '芝士茶', price: 36 },
    { id: 5, name: '季节限定', price: 38 },
    { id: 6, name: '特调奶茶', price: 30 },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 parallax">
          <img 
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20milk%20tea%20in%20clear%20glass%2C%20minimalist%20style%2C%20black%20and%20white%20with%20red%20accent%2C%20professional%20product%20photography%2C%20dramatic%20lighting&image_size=landscape_16_9" 
            alt="茶里九世招牌奶茶" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between h-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-12 lg:mb-0"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-title text-white leading-tight mb-6">
                <span className="relative inline-block">
                  茶里九世
                  <span className="absolute -inset-1 bg-gradient-to-r from-brand-red to-brand-gold rounded-lg blur opacity-30 -z-10"></span>
                </span>
                <br />
                <span className="text-brand-red">灵感之茶</span>
              </h1>
              
              <p className="text-xl text-white/80 max-w-xl mb-8">
                每一杯茶，都是我们对品质的执着追求
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="sticky top-1/2 transform -translate-y-1/2"
            >
              <Link to="/products" className="btn-primary px-8 py-4 text-lg">
                立即点单
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-title text-text-primary mb-6">灵感产品</h2>
              <div className="w-20 h-1 bg-brand-red mb-8"></div>
              <p className="text-text-secondary text-lg max-w-2xl">
                每一款都是我们用心打造的杰作，只为给您带来最纯粹的味觉享受
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-card"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-card bg-accent-card-bg">
                  <img
                    src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=premium%20${encodeURIComponent(product.name)}%2C%20minimalist%20style%2C%20black%20and%20white%20with%20red%20accent%2C%20professional%20product%20photography&image_size=portrait_4_3`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-title text-text-primary mb-2">{product.name}</h3>
                  <p className="text-text-secondary text-lg font-medium">¥{product.price}</p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6"
                >
                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    加入购物车
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Link to="/products" className="btn-secondary px-8 py-3">
              查看全部产品
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-card overflow-hidden shadow-soft">
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
              <h2 className="text-3xl lg:text-4xl font-title text-text-primary mt-4 mb-6">
                源于热爱，忠于品质
              </h2>
              <div className="w-16 h-1 bg-accent-divider mb-8"></div>
              <p className="text-text-secondary leading-body mb-6">
                茶里九世诞生于对茶饮文化的热爱。我们相信，一杯好茶不仅仅是饮品，更是一种生活态度的体现。从原料选择到制作工艺，每一个环节我们都精益求精。
              </p>
              <p className="text-text-secondary leading-body mb-8">
                我们与优质茶园建立长期合作，确保每一片茶叶都来自最佳产地。新鲜水果每日配送，只为给您呈现最纯正的风味。这不仅是我们的承诺，更是我们的坚持。
              </p>
              <Link to="/products" className="btn-primary">
                了解更多
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
