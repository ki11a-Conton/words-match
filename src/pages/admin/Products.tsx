import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { productApi } from '../../services/api';
import { useAuthStore } from '../../store';
import type { Product, ProductCategory } from '../../types';
import { categoryLabels } from '../../types';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: ProductCategory;
    image: string;
    temperature: string;
    sweetness: string;
    size: string;
  }>({
    name: '',
    description: '',
    price: '',
    category: 'milk_tea',
    image: '',
    temperature: 'cold,hot',
    sweetness: 'full,seventy,fifty,thirty,none',
    size: 'medium,large,extra_large',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'category' ? (value as ProductCategory) : value 
    }));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      temperature: product.temperature,
      sweetness: product.sweetness,
      size: product.size,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, {
          ...formData,
          price: parseFloat(formData.price),
        });
      } else {
        await productApi.create({
          ...formData,
          price: parseFloat(formData.price),
        });
      }
      await fetchProducts();
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'milk_tea',
        image: '',
        temperature: 'cold,hot',
        sweetness: 'full,seventy,fifty,thirty,none',
        size: 'medium,large,extra_large',
      });
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个产品吗？')) return;

    try {
      await productApi.delete(id);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('删除失败，请重试');
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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-display-md text-charcoal">产品管理</h1>
            <p className="text-charcoal-muted mt-1">管理所有产品信息</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                category: 'milk_tea',
                image: '',
                temperature: 'cold,hot',
                sweetness: 'full,seventy,fifty,thirty,none',
                size: 'medium,large,extra_large',
              });
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加产品
          </button>
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
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">产品</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">分类</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal-muted">价格</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-charcoal-muted">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-charcoal font-medium">{product.name}</p>
                            <p className="text-sm text-charcoal-muted line-clamp-1 max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-cream-100 text-charcoal-muted text-sm rounded-full">
                          {categoryLabels[product.category]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-charcoal font-medium">
                        ¥{product.price.toFixed(0)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-charcoal-muted hover:text-brand-green transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-charcoal-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {(editingProduct || formData.name !== '') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setEditingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-charcoal">
                  {editingProduct ? '编辑产品' : '添加产品'}
                </h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">产品名称</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="请输入产品名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">描述</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="input-field resize-none"
                    placeholder="请输入产品描述"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">价格</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">分类</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="fruit_tea">水果茶</option>
                      <option value="milk_tea">奶茶</option>
                      <option value="pure_tea">纯茶</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">图片URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="btn-secondary flex-1"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1"
                  >
                    {isSaving ? '保存中...' : '保存'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
