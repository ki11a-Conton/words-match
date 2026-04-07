import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, LogOut, Search } from 'lucide-react';
import { useAuthStore, useCartStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/products', label: '产品' },
    { path: '/brand', label: '品牌故事' },
    { path: '/stores', label: '门店' },
    { path: '/news', label: '新闻' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-22">
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''} ${
                  !isScrolled ? 'text-white' : 'text-gray-500'
                } ${!isScrolled ? 'hover:text-white' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link to="/" className="flex items-center gap-2">
            <span className={`font-display text-2xl lg:text-3xl tracking-tight ${
              isScrolled ? 'text-black' : 'text-white'
            }`}>
              茶里九世
            </span>
          </Link>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className={`p-2 transition-colors ${
              isScrolled ? 'text-gray-500 hover:text-black' : 'text-white hover:text-white/80'
            }`}>
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/cart"
              className={`relative p-2 transition-colors ${
                isScrolled ? 'text-gray-500 hover:text-black' : 'text-white hover:text-white/80'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-white text-xs rounded-full flex items-center justify-center">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-2 transition-colors ${
                    isScrolled ? 'text-gray-500 hover:text-black' : 'text-white hover:text-white/80'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                    >
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-50"
                      >
                        我的订单
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-50"
                        >
                          管理后台
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className={`btn-primary text-sm px-6 py-2 ${
                  !isScrolled ? 'bg-white text-black hover:bg-gray-100' : ''
                }`}
              >
                登录
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${isScrolled ? 'border-gray-200' : 'border-white/20'} py-4`}
            >
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm ${
                      isActive(link.path) 
                        ? (isScrolled ? 'text-black' : 'text-white')
                        : (isScrolled ? 'text-gray-500' : 'text-white/80')
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
