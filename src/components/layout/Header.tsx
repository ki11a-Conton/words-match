import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Home, Trophy, User, LogOut, Menu, X, Gamepad2 } from 'lucide-react';
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
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/learn/match', label: 'Word Match', icon: <Gamepad2 size={20} /> },
    { path: '/learn/vocabulary', label: 'Flashcards', icon: <BookOpen size={20} /> },
    { path: '/learn/grammar', label: 'Grammar', icon: <BookOpen size={20} /> },
    { path: '/learn/speaking', label: 'Speaking', icon: <BookOpen size={20} /> },
    { path: '/progress', label: 'Progress', icon: <Trophy size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="liquid-glass-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 liquid-glass-content">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-xl">
              <BookOpen className="text-white" size={22} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LangLearn
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`liquid-glass-nav-item text-sm font-medium flex items-center gap-2 ${
                  location.pathname === item.path ? 'active' : 'text-gray-700'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              Hi, {user?.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon={<LogOut size={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
          <button
            className="md:hidden p-2 text-gray-700 hover:bg-white/40 rounded-xl transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/30 glass">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`liquid-glass-nav-item text-sm font-medium flex items-center gap-3 ${
                  location.pathname === item.path ? 'active' : 'text-gray-700'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/30">
              <p className="px-4 py-2 text-sm text-gray-600 font-medium">
                Hi, {user?.username}
              </p>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full liquid-glass-nav-item text-sm font-medium text-red-600 hover:bg-red-50/50 flex items-center gap-3"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
