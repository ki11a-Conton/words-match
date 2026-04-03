import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { StatsCard } from '../components/stats/StatsCard';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BookOpen, ScrollText, Mic, TrendingUp, Trophy, Calendar, BookMarked, Gamepad2 } from 'lucide-react';

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
      id: 'match',
      title: 'Word Match',
      description: 'Fun matching game to learn words',
      icon: <Gamepad2 className="w-8 h-8" />,
      path: '/learn/match',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 'vocabulary',
      title: 'Flashcards',
      description: 'Learn words with flip cards',
      icon: <BookOpen className="w-8 h-8" />,
      path: '/learn/vocabulary',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'grammar',
      title: 'Grammar Quiz',
      description: 'Interactive grammar exercises',
      icon: <ScrollText className="w-8 h-8" />,
      path: '/learn/grammar',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'speaking',
      title: 'Speaking',
      description: 'Practice pronunciation with AI',
      icon: <Mic className="w-8 h-8" />,
      path: '/learn/speaking',
      gradient: 'from-violet-500 to-fuchsia-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background decorations */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      
      <Header />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, {user.username}!
          </h1>
          <p className="text-gray-600">
            Ready to learn something new today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Streak"
            value={`${user.streakDays} days`}
            icon={<Calendar className="w-6 h-6" />}
            color="amber"
          />
          <StatsCard
            title="Total Learned"
            value={totalLearned}
            icon={<TrendingUp className="w-6 h-6" />}
            color="indigo"
          />
          <StatsCard
            title="Accuracy"
            value={`${totalLearned > 0 ? Math.round((totalCorrect / totalLearned) * 100) : 0}%`}
            icon={<Trophy className="w-6 h-6" />}
            color="emerald"
          />
          <StatsCard
            title="Words Mastered"
            value={totalWordsMastered}
            icon={<BookMarked className="w-6 h-6" />}
            color="violet"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningModules.map((module) => (
              <Link key={module.id} to={module.path}>
                <Card hoverable className="h-full glass-card">
                  <CardContent>
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${module.gradient} text-white inline-block mb-4 shadow-lg`}>
                      {module.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {module.description}
                    </p>
                    <Button>
                      Start
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {userAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userAchievements.slice(0, 5).map((achievement, index) => (
                <Card key={achievement.id} className="text-center glass-card">
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
