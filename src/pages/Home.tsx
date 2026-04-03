import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { StatsCard } from '../components/stats/StatsCard';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BookOpen, ScrollText, Mic, TrendingUp, Trophy, Calendar, BookMarked } from 'lucide-react';

const Home: React.FC = () => {
  const { user, isAuthenticated, learningProgress, achievements, wordMastery } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const totalLearned = learningProgress
    .filter(p => p.userId === user.id)
    .reduce((sum, p) => sum + p.totalLearned, 0);

  const totalCorrect = learningProgress
    .filter(p => p.userId === user.id)
    .reduce((sum, p) => sum + p.correctCount, 0);

  const totalWordsMastered = wordMastery.filter(m => m.userId === user.id && m.masteryLevel >= 3).length;

  const userAchievements = achievements.filter(a => a.userId === user.id);

  const learningModules = [
    {
      id: 'vocabulary',
      title: '单词记忆',
      description: '通过闪卡高效记忆单词',
      icon: <BookOpen className="w-8 h-8" />,
      path: '/learn/vocabulary'
    },
    {
      id: 'grammar',
      title: '语法练习',
      description: '交互式语法题目训练',
      icon: <ScrollText className="w-8 h-8" />,
      path: '/learn/grammar'
    },
    {
      id: 'speaking',
      title: '口语跟读',
      description: 'AI 发音评分系统',
      icon: <Mic className="w-8 h-8" />,
      path: '/learn/speaking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            你好，{user.username}！
          </h1>
          <p className="text-gray-600">
            今天是学习的好日子，让我们继续进步吧！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="连续学习"
            value={`${user.streakDays} 天`}
            icon={<Calendar className="w-6 h-6" />}
            color="amber"
          />
          <StatsCard
            title="已学习"
            value={totalLearned}
            icon={<TrendingUp className="w-6 h-6" />}
            color="indigo"
          />
          <StatsCard
            title="正确率"
            value={`${totalLearned > 0 ? Math.round((totalCorrect / totalLearned) * 100) : 0}%`}
            icon={<Trophy className="w-6 h-6" />}
            color="emerald"
          />
          <StatsCard
            title="掌握单词"
            value={totalWordsMastered}
            icon={<BookMarked className="w-6 h-6" />}
            color="violet"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">选择学习模块</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningModules.map((module) => (
              <Link key={module.id} to={module.path}>
                <Card hoverable className="h-full">
                  <CardContent>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white inline-block mb-4">
                      {module.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {module.description}
                    </p>
                    <Button>
                      开始学习
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {userAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">获得的成就</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userAchievements.slice(0, 5).map((achievement, index) => (
                <Card key={achievement.id} className="text-center">
                  <CardContent>
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-sm font-medium text-gray-700">
                      {achievement.badgeId}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
