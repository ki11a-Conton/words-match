import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { SpeakingRecorder } from '../components/learning/SpeakingRecorder';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ArrowLeft, Trophy } from 'lucide-react';

const Speaking = () => {
  const { isAuthenticated, speakingExercises, updateProgress, unlockAchievement } = useAppStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleComplete = () => {
    updateProgress('speaking', true);
    if (currentIndex + 1 >= speakingExercises.length) {
      setSessionComplete(true);
      unlockAchievement('first_day');
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">出色的发音！</h2>
              <p className="text-xl text-gray-600 mb-8">
                你完成了本次口语练习！
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  icon={<ArrowLeft size={20} />}
                  onClick={() => navigate('/')}
                >
                  返回首页
                </Button>
                <Button
                  onClick={() => {
                    setSessionComplete(false);
                    setCurrentIndex(0);
                  }}
                >
                  再练一次
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate('/')}
          >
            返回
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">口语跟读</h1>
            <p className="text-gray-600">
              {currentIndex + 1} / {speakingExercises.length}
            </p>
          </div>
          <div className="w-24"></div>
        </div>
        <div className="mb-8">
          <ProgressBar
            value={currentIndex + 1}
            max={speakingExercises.length}
            size="lg"
            showLabel
          />
        </div>
        <SpeakingRecorder
          text={speakingExercises[currentIndex].text}
          translation={speakingExercises[currentIndex].translation}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default Speaking;
