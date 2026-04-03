import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Trophy, Clock, Target, RefreshCw, Play, Pause } from 'lucide-react';
import { shuffleArray } from '../utils/helpers';

interface MatchWord {
  english: string;
  chinese: string;
}

const WORDS_PER_ROUND = 4;
const ROUND_TIME = 20;

const WordMatch: React.FC = () => {
  const { user, isAuthenticated, vocabularyWords, updateProgress } = useAppStore();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState<'ready' | 'countdown' | 'playing' | 'paused' | 'complete'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [roundWords, setRoundWords] = useState<MatchWord[]>([]);
  const [englishWords, setEnglishWords] = useState<MatchWord[]>([]);
  const [chineseWords, setChineseWords] = useState<MatchWord[]>([]);
  const [selectedEnglish, setSelectedEnglish] = useState<MatchWord | null>(null);
  const [selectedChinese, setSelectedChinese] = useState<MatchWord | null>(null);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [wrongWords, setWrongWords] = useState<MatchWord[]>([]);

  const allWords: MatchWord[] = vocabularyWords.map(w => ({
    english: w.english,
    chinese: w.chinese
  }));

  const startNewRound = useCallback(() => {
    const shuffled = shuffleArray([...allWords]);
    const roundWords = shuffled.slice(0, WORDS_PER_ROUND);
    setRoundWords(roundWords);
    setEnglishWords(shuffleArray([...roundWords]));
    setChineseWords(shuffleArray([...roundWords]));
    setMatchedPairs(0);
    setSelectedEnglish(null);
    setSelectedChinese(null);
    setTimeLeft(ROUND_TIME);
    setCurrentRound(r => r + 1);
  }, [allWords]);

  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setCurrentRound(0);
    setWrongWords([]);
    startNewRound();
  };

  const handleMatch = (word: MatchWord, type: 'english' | 'chinese') => {
    if (gameState !== 'playing') return;

    if (type === 'english') {
      setSelectedEnglish(word);
      if (selectedChinese) {
        checkMatch(word, selectedChinese);
      }
    } else {
      setSelectedChinese(word);
      if (selectedEnglish) {
        checkMatch(selectedEnglish, word);
      }
    }
  };

  const checkMatch = (eng: MatchWord, chi: MatchWord) => {
    setTotalAttempts(t => t + 1);
    
    if (eng.english === chi.english) {
      setCorrectCount(c => c + 1);
      setScore(s => s + Math.round((timeLeft / ROUND_TIME) * 100) + 50);
      setMatchedPairs(p => p + 1);
      updateProgress('vocabulary', true);
      
      setEnglishWords(prev => prev.filter(w => w.english !== eng.english));
      setChineseWords(prev => prev.filter(w => w.english !== eng.english));
      
      if (matchedPairs + 1 >= WORDS_PER_ROUND) {
        setTimeout(() => {
          if (currentRound >= 5) {
            setGameState('paused');
          } else {
            startNewRound();
          }
        }, 500);
      }
    } else {
      setWrongWords(prev => [...prev, eng]);
      updateProgress('vocabulary', false);
    }
    
    setSelectedEnglish(null);
    setSelectedChinese(null);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      startGame();
    }
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setWrongWords(prev => [...prev, ...roundWords]);
      if (currentRound >= 5) {
        setGameState('paused');
      } else {
        startNewRound();
      }
    }
  }, [gameState, timeLeft, currentRound, roundWords]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Background decorations */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      
      <Header />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate('/')}
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Word Match</h1>
          <div className="flex gap-4">
            <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              <span className="font-bold">{score}</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
              <Target size={18} className="text-green-500" />
              <span className="font-bold">{accuracy}%</span>
            </div>
          </div>
        </div>

        {gameState === 'ready' && (
          <div className="glass-card rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Play size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Word Match</h2>
            <p className="text-gray-600 mb-8">Match English words with their Chinese meanings. Be quick and accurate!</p>
            <Button size="lg" onClick={startCountdown}>
              Start Game
            </Button>
          </div>
        )}

        {gameState === 'countdown' && (
          <div className="flex items-center justify-center h-96">
            <div className="text-9xl font-bold text-indigo-600 countdown-number">
              {countdown}
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="glass-card px-6 py-3 rounded-xl flex items-center gap-3">
                <Clock size={20} className={timeLeft <= 5 ? 'text-red-500' : 'text-indigo-500'} />
                <span className={`text-2xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-900'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="glass-card px-6 py-3 rounded-xl">
                <span className="text-gray-600">Round </span>
                <span className="font-bold text-gray-900">{currentRound}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* English Column */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  English
                </h3>
                <div className="space-y-4">
                  {englishWords.map((word, index) => (
                    <button
                      key={`eng-${index}`}
                      onClick={() => handleMatch(word, 'english')}
                      className={`match-item w-full glass-card rounded-2xl p-5 text-left text-lg font-medium
                        ${selectedEnglish?.english === word.english ? 'selected' : ''}`}
                    >
                      {word.english}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chinese Column */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Chinese
                </h3>
                <div className="space-y-4">
                  {chineseWords.map((word, index) => (
                    <button
                      key={`chi-${index}`}
                      onClick={() => handleMatch(word, 'chinese')}
                      className={`match-item w-full glass-card rounded-2xl p-5 text-left text-lg
                        ${selectedChinese?.english === word.english ? 'selected' : ''}`}
                    >
                      {word.chinese}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {gameState === 'paused' && (
          <div className="glass-card rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Pause size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Great Progress!</h2>
            <p className="text-gray-600 mb-6">Completed {currentRound} rounds</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4">
                <p className="text-3xl font-bold text-indigo-600">{score}</p>
                <p className="text-sm text-indigo-700">Total Score</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-sm text-green-700">Accuracy</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                icon={<RefreshCw size={20} />}
                onClick={() => navigate('/')}
              >
                End Game
              </Button>
              <Button onClick={() => {
                setGameState('playing');
                startNewRound();
              }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {gameState === 'complete' && (
          <div className="glass-card rounded-3xl p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4">
                <p className="text-2xl font-bold text-indigo-600">{score}</p>
                <p className="text-xs text-indigo-700">Score</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-xs text-green-700">Accuracy</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                <p className="text-2xl font-bold text-purple-600">{currentRound}</p>
                <p className="text-xs text-purple-700">Rounds</p>
              </div>
            </div>

            <Button onClick={() => setGameState('ready')}>
              Play Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WordMatch;
