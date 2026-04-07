import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types';
import { categoryLabels } from '../../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative overflow-hidden" style={{ height: '70%' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs text-black rounded-full">
              {categoryLabels[product.category]}
            </span>
          </div>
        </div>
        <div className="p-6" style={{ height: '30%' }}>
          <h3 className="text-lg font-bold text-black mb-2">{product.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-medium text-black">
              ¥{product.price.toFixed(0)}
            </span>
            <motion.span 
              initial={{ x: 20, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-brand-red text-sm font-medium"
            >
              查看详情 →
            </motion.span>
          </div>
        </div>
      </div>
    </Link>
  );
}
