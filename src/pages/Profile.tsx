import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, User, Calendar, Mail, LogOut, Trophy } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout, achievements, learningProgress } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const userAchievements = achievements.filter(a => a.userId === user.id);
  const userProgress = learningProgress.filter(p => p.userId === user.id);
  const totalLearned = userProgress.reduce((sum, p) => sum + p.totalLearned, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            返回首页
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            个人资料
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-6xl shadow-xl">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.username}
                </h2>
                <p className="text-gray-600 mb-4">
                  {user.email}
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      加入于: {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">
                      获得成就: {userAchievements.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">
                      总学习: {totalLearned}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  学习统计
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">
                      {user.streakDays}
                    </div>
                    <div className="text-sm text-indigo-700">
                      连续学习天数
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      {totalLearned}
                    </div>
                    <div className="text-sm text-emerald-700">
                      总学习次数
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  账号管理
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={handleLogout}
                    icon={<LogOut className="w-5 h-5" />}
                  >
                    退出登录
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
