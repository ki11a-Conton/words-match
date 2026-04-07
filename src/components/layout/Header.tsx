import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, LogOut, Search, Home, Coffee, MapPin, UserCircle } from 'lucide-react';
import { useAuthStore, useCartStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

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
    { 
      path: '/', 
      label: '首页',
      dropdown: [
        { title: '品牌首页', description: '了解茶里九世品牌故事' },
        { title: '最新活动', description: '查看最新促销和活动' }
      ]
    },
    { 
      path: '/products', 
      label: '产品',
      dropdown: [
        { title: '奶茶系列', description: '经典奶茶饮品' },
        { title: '水果茶系列', description: '新鲜水果茶' },
        { title: '纯茶系列', description: '精选茶叶' },
        { title: '季节限定', description: '限时推出新品' }
      ]
    },
    { 
      path: '/brand', 
      label: '品牌故事',
      dropdown: [
        { title: '品牌理念', description: '了解我们的品牌价值观' },
        { title: '发展历程', description: '品牌成长故事' },
        { title: '企业责任', description: '我们的社会责任' }
      ]
    },
    { 
      path: '/stores', 
      label: '门店',
      dropdown: [
        { title: '门店查询', description: '查找附近门店' },
        { title: '门店加盟', description: '了解加盟信息' }
      ]
    },
    { 
      path: '/news', 
      label: '新闻',
      dropdown: [
        { title: '公司新闻', description: '最新公司动态' },
        { title: '媒体报道', description: '媒体对我们的报道' }
      ]
    },
  ];

  const getMobileQuickLinks = () => [
    { path: '/', icon: <Home className="w-5 h-5" />, label: '首页' },
    { path: '/products', icon: <Coffee className="w-5 h-5" />, label: '菜单' },
    { path: '/stores', icon: <MapPin className="w-5 h-5" />, label: '门店' },
    { path: isAuthenticated ? '/orders' : '/login', icon: <UserCircle className="w-5 h-5" />, label: '我的' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-[10px] shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-22">
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  <Link
                    to={link.path}
                    className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''} ${
                      !isScrolled ? 'text-white' : 'text-text-secondary'
                    } ${!isScrolled ? 'hover:text-white' : ''}
                    transition-all duration-300 hover:scale-102 hover:shadow-md active:scale-98`}
                    onMouseEnter={() => setHoveredNav(link.path)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    {link.label}
                  </Link>
                  
                  {hoveredNav === link.path && link.dropdown && (
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[600px] bg-white rounded-card shadow-lg py-6 px-8 z-50 opacity-100"
                      onMouseEnter={() => setHoveredNav(link.path)}
                      onMouseLeave={() => setHoveredNav(null)}
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {link.dropdown.map((item, index) => (
                          <div key={index} className="flex flex-col gap-2 p-3 rounded-lg hover:bg-accent-card-bg transition-colors">
                            <h3 className="text-text-primary font-title text-sm">{item.title}</h3>
                            <p className="text-text-secondary text-xs">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link to="/" className="flex items-center gap-2">
              <span className={`font-display text-2xl lg:text-3xl tracking-tight ${
                isScrolled ? 'text-text-primary' : 'text-white'
              }`}>
                茶里九世
              </span>
            </Link>

            <div className="flex items-center gap-4 lg:gap-6">
              <button 
                className={`p-2 transition-all duration-300 ${
                  isScrolled ? 'text-text-secondary hover:text-text-primary' : 'text-white hover:text-white/80'
                } hover:scale-102 hover:shadow-md active:scale-98`}
                aria-label="搜索"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/cart"
                className={`relative p-2 transition-all duration-300 ${
                  isScrolled ? 'text-text-secondary hover:text-text-primary' : 'text-white hover:text-white/80'
                } hover:scale-102 hover:shadow-md active:scale-98`}
                aria-label="购物车"
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
                    className={`flex items-center gap-2 p-2 transition-all duration-300 ${
                      isScrolled ? 'text-text-secondary hover:text-text-primary' : 'text-white hover:text-white/80'
                    } hover:scale-102 hover:shadow-md active:scale-98`}
                    aria-haspopup="true"
                    aria-expanded={showUserMenu}
                    aria-label="用户菜单"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline text-sm">{user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-card shadow-lg py-2 z-50 opacity-100"
                    >
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-accent-card-bg transition-colors"
                      >
                        我的订单
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-accent-card-bg transition-colors"
                        >
                          管理后台
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-accent-card-bg flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`btn-primary text-sm px-6 py-2 transition-all duration-300 hover:scale-102 hover:shadow-md active:scale-98 ${
                    !isScrolled ? 'bg-white text-text-primary hover:bg-accent-card-bg' : ''
                  }`}
                >
                  登录
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 transition-all duration-300 ${
                  isScrolled ? 'text-text-primary' : 'text-white'
                } hover:scale-102 hover:shadow-md active:scale-98`}
                aria-haspopup="true"
                aria-expanded={isMobileMenuOpen}
                aria-label="移动端菜单"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

            {isMobileMenuOpen && (
              <div
                className={`lg:hidden border-t ${isScrolled ? 'border-accent-divider' : 'border-white/20'} py-4 opacity-100`}
              >
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-sm transition-all duration-300 hover:scale-102 hover:shadow-md active:scale-98 ${
                        isActive(link.path) 
                          ? (isScrolled ? 'text-text-primary' : 'text-white')
                          : (isScrolled ? 'text-text-secondary' : 'text-white/80')
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
        </div>
      </header>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-accent-divider z-40">
        <div className="flex justify-around items-center h-16">
          {getMobileQuickLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300 hover:scale-102 active:scale-98 ${
                isActive(link.path) ? 'text-brand-primary' : 'text-text-secondary'
              }`}
              aria-label={link.label}
            >
              {link.icon}
              <span className="text-xs">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
