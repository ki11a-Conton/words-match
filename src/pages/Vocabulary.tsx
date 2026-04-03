import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { VocabularyCard } from '../components/learning/VocabularyCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ArrowLeft, Trophy } from 'lucide-react';
import { shuffleArray } from '../utils/helpers';

const Vocabulary = () => {
  const { isAuthenticated, vocabularyWords, updateProgress, updateWordMastery, unlockAchievement } = useAppStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledWords, setShuffledWords] = useState(vocabularyWords);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShuffledWords(shuffleArray([...vocabularyWords]));
  }, [isAuthenticated, navigate, vocabularyWords]);

  const handleKnow = () => {
    updateProgress('vocabulary', true);
    updateWordMastery(shuffledWords[currentIndex].english, 5);
    setCorrectCount(c => c + 1);
    nextWord();
  };

  const handleDontKnow = () => {
    updateProgress('vocabulary', false);
    updateWordMastery(shuffledWords[currentIndex].english, 1);
    nextWord();
  };

  const nextWord = () => {
    setIsFlipped(false);
    if (currentIndex + 1 >= shuffledWords.length) {
      setSessionComplete(true);
      if (correctCount + 1 >= shuffledWords.length) {
        unlockAchievement('first_day');
      }
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">太棒了！</h2>
              <p className="text-xl text-gray-600 mb-2">
                你完成了本次单词学习！
              </p>
              <p className="text-lg text-gray-500 mb-8">
                正确率: {Math.round((correctCount / shuffledWords.length) * 100)}%
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
                    setCorrectCount(0);
                    setShuffledWords(shuffleArray([...vocabularyWords]));
                  }}
                >
                  再学一次
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
            <h1 className="text-2xl font-bold text-gray-900">单词记忆</h1>
            <p className="text-gray-600">
              {currentIndex + 1} / {shuffledWords.length}
            </p>
          </div>
          <div className="w-24"></div>
        </div>
        <div className="mb-8">
          <ProgressBar
            value={currentIndex + 1}
            max={shuffledWords.length}
            size="lg"
            showLabel
          />
        </div>
        <div className="max-w-lg mx-auto">
          <VocabularyCard
            word={shuffledWords[currentIndex]}
            onKnow={handleKnow}
            onDontKnow={handleDontKnow}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
