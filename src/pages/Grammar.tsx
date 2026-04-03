import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { GrammarQuiz } from '../components/learning/GrammarQuiz';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { shuffleArray } from '../utils/helpers';

const Grammar: React.FC = () => {
  const { user, isAuthenticated, grammarQuestions, updateProgress, unlockAchievement } = useAppStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([...grammarQuestions]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setShuffledQuestions(shuffleArray([...grammarQuestions]));
  }, [grammarQuestions]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAnswer = (correct: boolean) => {
    updateProgress('grammar', correct);
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setShuffledQuestions(shuffleArray([...grammarQuestions]));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsComplete(false);
  };

  const progress = ((currentIndex + (isComplete ? 1 : 0)) / shuffledQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            返回首页
          </Button>
          <div className="text-lg font-semibold text-gray-700">
            {currentIndex + 1} / {shuffledQuestions.length}
          </div>
        </div>

        <div className="mb-8">
          <ProgressBar
            value={progress}
            color="success"
            size="lg"
            showLabel
            label="练习进度"
          />
        </div>

        {!isComplete ? (
          shuffledQuestions[currentIndex] && (
            <GrammarQuiz
              question={shuffledQuestions[currentIndex]}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          )
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full text-6xl mb-6 shadow-xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              练习完成！
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              你答对了 {correctCount} 题
            </p>
            <p className="text-gray-500 mb-8">
              正确率: {Math.round((correctCount / shuffledQuestions.length) * 100)}%
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRestart}
                icon={<RefreshCw className="w-5 h-5" />}
              >
                再练一次
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/')}
              >
                返回首页
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Grammar;
