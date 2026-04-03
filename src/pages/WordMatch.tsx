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
  id: string;
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
  const [wrongPair, setWrongPair] = useState<{ english: MatchWord | null; chinese: MatchWord | null }>({ english: null, chinese: null });

  const allWords: MatchWord[] = vocabularyWords.map(w => ({
    english: w.english,
    chinese: w.chinese,
    id: w.id
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
    setWrongPair({ english: null, chinese: null });
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
      
      setTimeout(() => {
        setEnglishWords(prev => prev.filter(w => w.id !== eng.id));
        setChineseWords(prev => prev.filter(w => w.id !== eng.id));
      }, 400);
      
      setSelectedEnglish(null);
      setSelectedChinese(null);
      setWrongPair({ english: null, chinese: null });
      
      if (matchedPairs + 1 >= WORDS_PER_ROUND) {
        setTimeout(() => {
          if (currentRound >= 5) {
            setGameState('paused');
          } else {
            startNewRound();
          }
        }, 600);
      }
    } else {
      setWrongWords(prev => [...prev, eng]);
      updateProgress('vocabulary', false);
      setWrongPair({ english: eng, chinese: chi });
      
      setTimeout(() => {
        setSelectedEnglish(null);
        setSelectedChinese(null);
        setWrongPair({ english: null, chinese: null });
      }, 500);
    }
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

  const getItemClass = (word: MatchWord, type: 'english' | 'chinese') => {
    let className = 'match-item';
    
    const isSelected = type === 'english' 
      ? selectedEnglish?.id === word.id 
      : selectedChinese?.id === word.id;
    
    const isWrong = type === 'english'
      ? wrongPair.english?.id === word.id
      : wrongPair.chinese?.id === word.id;
    
    if (isSelected && !isWrong) {
      className += ' selected';
    }
    if (isWrong) {
      className += ' wrong';
    }
    
    return className;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)' }}>
      {/* Background decorations */}
      <div className="bg-decoration">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      
      <Header />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <Button
            variant="ghost"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate('/')}
            className="glass"
          >
            Back
          </Button>
          
          <div className="stats-bar flex gap-3">
            <div className="stat-item">
              <div className="stat-icon score">🏆</div>
              <div>
                <div className="stat-value">{score}</div>
                <div className="stat-label text-xs text-gray-500">Score</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon progress">📊</div>
              <div>
                <div className="stat-value">{accuracy}%</div>
                <div className="stat-label text-xs text-gray-500">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {gameState === 'ready' && (
          <div className="game-area text-center py-16">
            <div className="completion-icon mx-auto mb-6" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' }}>
              <Play size={40} className="text-white" />
            </div>
            <h2 className="completion-title mb-4">Word Match</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Match English words with their Chinese meanings. Be quick and accurate to get higher scores!
            </p>
            <Button size="lg" onClick={startCountdown} className="btn-primary">
              Start Game
            </Button>
          </div>
        )}

        {gameState === 'countdown' && (
          <div className="game-area flex items-center justify-center min-h-[400px]">
            <div className="text-9xl font-bold countdown-number" style={{ 
              background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--success) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {countdown}
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="game-area">
            {/* Game header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">Round {currentRound}</span>
              </div>
              
              <div className={`timer-container flex items-center gap-2 ${timeLeft <= 5 ? 'urgent' : ''}`}>
                <Clock size={20} />
                <span className="font-mono">{timeLeft}s</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(matchedPairs / WORDS_PER_ROUND) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{matchedPairs}/{WORDS_PER_ROUND}</span>
              </div>
            </div>

            {/* Match grid */}
            <div className="match-grid">
              {/* English Column */}
              <div className="match-column">
                <div className="match-column-title">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  English
                </div>
                {englishWords.map((word) => (
                  <button
                    key={`eng-${word.id}`}
                    onClick={() => handleMatch(word, 'english')}
                    className={getItemClass(word, 'english')}
                  >
                    {word.english}
                  </button>
                ))}
              </div>

              {/* Chinese Column */}
              <div className="match-column">
                <div className="match-column-title">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Chinese
                </div>
                {chineseWords.map((word) => (
                  <button
                    key={`chi-${word.id}`}
                    onClick={() => handleMatch(word, 'chinese')}
                    className={getItemClass(word, 'chinese')}
                  >
                    {word.chinese}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="game-area text-center py-16">
            <div className="completion-icon mx-auto mb-6">
              <Pause size={40} className="text-white" />
            </div>
            <h2 className="completion-title mb-2">Great Progress!</h2>
            <p className="text-gray-600 mb-8">Completed {currentRound} rounds</p>
            
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">{score}</div>
                <div className="text-sm text-gray-500">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                icon={<RefreshCw size={20} />}
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                End Game
              </Button>
              <Button onClick={() => {
                setGameState('playing');
                startNewRound();
              }} className="btn-primary">
                Continue
              </Button>
            </div>
          </div>
        )}

        {gameState === 'complete' && (
          <div className="game-area text-center py-16">
            <div className="completion-icon mx-auto mb-6">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="completion-title mb-4">Game Complete!</h2>
            
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{score}</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{currentRound}</div>
                <div className="text-sm text-gray-500">Rounds</div>
              </div>
            </div>

            <Button onClick={() => setGameState('ready')} className="btn-primary">
              Play Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WordMatch;
