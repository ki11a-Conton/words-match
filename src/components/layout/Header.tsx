import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Home, Trophy, User, LogOut, Menu, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { useState } from 'react';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: '首页', icon: <Home size={20} /> },
    { path: '/learn/vocabulary', label: '单词记忆', icon: <BookOpen size={20} /> },
    { path: '/learn/grammar', label: '语法练习', icon: <BookOpen size={20} /> },
    { path: '/learn/speaking', label: '口语跟读', icon: <BookOpen size={20} /> },
    { path: '/progress', label: '学习进度', icon: <Trophy size={20} /> },
    { path: '/profile', label: '个人资料', icon: <User size={20} /> }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              语言学习
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600">
              欢迎, {user?.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon={<LogOut size={18} />}
              onClick={handleLogout}
            >
              退出
            </Button>
          </div>
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-3 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <p className="px-4 py-2 text-sm text-gray-600">
                欢迎, {user?.username}
              </p>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
              >
                <LogOut size={20} />
                退出登录
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
