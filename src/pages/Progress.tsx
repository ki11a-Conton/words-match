import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { StatsCard } from '../components/stats/StatsCard';
import { AchievementBadge } from '../components/stats/AchievementBadge';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ArrowLeft, TrendingUp, Trophy, Clock, Target, BookOpen, ScrollText, Mic } from 'lucide-react';
import { badges } from '../utils/sampleData';

const Progress: React.FC = () => {
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

  const userProgress = learningProgress.filter(p => p.userId === user.id);
  const userAchievements = achievements.filter(a => a.userId === user.id);
  const userWordMastery = wordMastery.filter(m => m.userId === user.id);

  const totalLearned = userProgress.reduce((sum, p) => sum + p.totalLearned, 0);
  const totalCorrect = userProgress.reduce((sum, p) => sum + p.correctCount, 0);
  const totalTime = userProgress.reduce((sum, p) => sum + p.totalPracticeTime, 0);

  const vocabularyProgress = userProgress.find(p => p.moduleType === 'vocabulary');
  const grammarProgress = userProgress.find(p => p.moduleType === 'grammar');
  const speakingProgress = userProgress.find(p => p.moduleType === 'speaking');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0) {
      return `${hours}小时${remainingMins}分钟`;
    }
    return `${remainingMins}分钟`;
  };

  const getProgressPercentage = (progress?: typeof vocabularyProgress) => {
    if (!progress) return 0;
    const total = progress.totalLearned;
    const correct = progress.correctCount;
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            返回首页
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            学习进度
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="总学习数"
            value={totalLearned}
            icon={<TrendingUp className="w-6 h-6" />}
            color="indigo"
          />
          <StatsCard
            title="正确率"
            value={`${totalLearned > 0 ? Math.round((totalCorrect / totalLearned) * 100) : 0}%`}
            icon={<Target className="w-6 h-6" />}
            color="emerald"
          />
          <StatsCard
            title="学习时长"
            value={formatTime(totalTime)}
            icon={<Clock className="w-6 h-6" />}
            color="amber"
          />
          <StatsCard
            title="获得成就"
            value={userAchievements.length}
            icon={<Trophy className="w-6 h-6" />}
            color="violet"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">各模块进度</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">单词记忆</h3>
                    <p className="text-sm text-gray-600">
                      {vocabularyProgress?.totalLearned || 0} 个单词
                    </p>
                  </div>
                </div>
                <ProgressBar
                  value={getProgressPercentage(vocabularyProgress)}
                  color="primary"
                  showLabel
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <ScrollText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">语法练习</h3>
                    <p className="text-sm text-gray-600">
                      {grammarProgress?.totalLearned || 0} 道题目
                    </p>
                  </div>
                </div>
                <ProgressBar
                  value={getProgressPercentage(grammarProgress)}
                  color="success"
                  showLabel
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">口语跟读</h3>
                    <p className="text-sm text-gray-600">
                      {speakingProgress?.totalLearned || 0} 次练习
                    </p>
                  </div>
                </div>
                <ProgressBar
                  value={getProgressPercentage(speakingProgress)}
                  color="primary"
                  showLabel
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {userWordMastery.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">单词掌握情况</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {userWordMastery.slice(0, 10).map((mastery) => (
                <Card key={mastery.id} className="text-center">
                  <CardContent>
                    <h4 className="font-bold text-gray-900 mb-1">{mastery.word}</h4>
                    <div className="text-sm text-gray-600">
                      掌握度: {mastery.masteryLevel}/5
                    </div>
                    <div className="text-xs text-gray-500">
                      复习 {mastery.reviewCount} 次
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">成就系统</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map((badge) => {
              const unlocked = userAchievements.find(a => a.badgeId === badge.id);
              return (
                <AchievementBadge
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  unlocked={!!unlocked}
                  unlockedAt={unlocked?.earnedAt}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
