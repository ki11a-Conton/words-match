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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)' }}>
      {/* Background decorations */}
      <div className="bg-decoration">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      
      <Header />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8 scale-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hello, {user.username}!
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Ready to learn something new today?
              </p>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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

        {/* Learning modules section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Learning Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {learningModules.map((module) => (
              <Link key={module.id} to={module.path} className="group">
                <Card hoverable className="h-full glass-card transition-all duration-300 group-hover:scale-[1.02]">
                  <CardContent className="flex flex-col h-full">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${module.gradient} text-white inline-block mb-5 shadow-2xl transition-transform duration-300 group-hover:scale-105`}>
                      {module.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {module.title}
                    </h3>
                    <p className="mb-5 flex-grow" style={{ color: 'var(--text-secondary)' }}>
                      {module.description}
                    </p>
                    <div className="mt-auto">
                      <Button className="w-full">
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Achievements section */}
        {userAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userAchievements.slice(0, 5).map((achievement, index) => (
                <Card key={achievement.id} className="text-center glass-card scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent>
                    <div className="text-5xl mb-3 animate-bounce">🏆</div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
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
