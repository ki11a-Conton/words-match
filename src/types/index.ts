export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  streakDays: number;
  lastStreakUpdated: Date;
}

export interface LearningProgress {
  id: string;
  userId: string;
  moduleType: 'vocabulary' | 'grammar' | 'speaking';
  totalLearned: number;
  correctCount: number;
  totalPracticeTime: number;
  lastPracticeDate: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface WordMastery {
  id: string;
  userId: string;
  word: string;
  masteryLevel: number;
  reviewCount: number;
  lastReviewed: Date;
}

export interface Word {
  id: string;
  english: string;
  chinese: string;
  phonetic: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SpeakingExercise {
  id: string;
  text: string;
  phonetic: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
