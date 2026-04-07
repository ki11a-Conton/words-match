import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { categoryLabels } from '../../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="product-card block">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs text-charcoal rounded-full">
            {categoryLabels[product.category]}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-charcoal mb-2">{product.name}</h3>
        <p className="text-charcoal-muted text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-charcoal">
            ¥{product.price.toFixed(0)}
          </span>
          <span className="text-brand-green text-sm font-medium">查看详情 →</span>
        </div>
      </div>
    </Link>
  );
}
