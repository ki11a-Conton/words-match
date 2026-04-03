import { create } from 'zustand';
import type {
  User,
  LearningProgress,
  Achievement,
  WordMastery,
  Word,
  GrammarQuestion,
  SpeakingExercise
} from '../types';
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  getStoredUsers,
  setStoredUsers,
  getStoredProgress,
  setStoredProgress,
  getStoredAchievements,
  setStoredAchievements,
  getStoredWordMastery,
  setStoredWordMastery
} from '../utils/storage';
import { generateId, hashPassword } from '../utils/helpers';
import { sampleVocabulary, sampleGrammar, sampleSpeaking } from '../utils/sampleData';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentModule: 'vocabulary' | 'grammar' | 'speaking' | null;
  learningProgress: LearningProgress[];
  achievements: Achievement[];
  wordMastery: WordMastery[];
  vocabularyWords: Word[];
  grammarQuestions: GrammarQuestion[];
  speakingExercises: SpeakingExercise[];
  
  login: (email: string, password: string) => boolean;
  register: (email: string, username: string, password: string) => boolean;
  logout: () => void;
  setCurrentModule: (module: 'vocabulary' | 'grammar' | 'speaking' | null) => void;
  updateProgress: (moduleType: 'vocabulary' | 'grammar' | 'speaking', correct: boolean) => void;
  updateWordMastery: (word: string, level: number) => void;
  unlockAchievement: (badgeId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  currentModule: null,
  learningProgress: getStoredProgress(),
  achievements: getStoredAchievements(),
  wordMastery: getStoredWordMastery(),
  vocabularyWords: sampleVocabulary,
  grammarQuestions: sampleGrammar,
  speakingExercises: sampleSpeaking,

  login: (email: string, password: string) => {
    const users = getStoredUsers();
    const passwordHash = hashPassword(password);
    const user = users.find(
      (u: any) => u.email === email && u.passwordHash === passwordHash
    );
    
    if (user) {
      const parsedUser = {
        ...user,
        createdAt: new Date(user.createdAt),
        lastStreakUpdated: new Date(user.lastStreakUpdated)
      };
      setStoredUser(parsedUser);
      set({ user: parsedUser, isAuthenticated: true });
      return true;
    }
    return false;
  },

  register: (email: string, username: string, password: string) => {
    const users = getStoredUsers();
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false;
    }
    
    const newUser: User = {
      id: generateId(),
      email,
      username,
      passwordHash: hashPassword(password),
      createdAt: new Date(),
      streakDays: 0,
      lastStreakUpdated: new Date()
    };
    
    const updatedUsers = [...users, newUser];
    setStoredUsers(updatedUsers);
    setStoredUser(newUser);
    set({ user: newUser, isAuthenticated: true });
    return true;
  },

  logout: () => {
    removeStoredUser();
    set({ user: null, isAuthenticated: false });
  },

  setCurrentModule: (module) => {
    set({ currentModule: module });
  },

  updateProgress: (moduleType, correct) => {
    const state = get();
    if (!state.user) return;
    
    const progress = [...state.learningProgress];
    const existingIndex = progress.findIndex(
      p => p.userId === state.user!.id && p.moduleType === moduleType
    );
    
    if (existingIndex >= 0) {
      progress[existingIndex] = {
        ...progress[existingIndex],
        totalLearned: progress[existingIndex].totalLearned + 1,
        correctCount: correct 
          ? progress[existingIndex].correctCount + 1 
          : progress[existingIndex].correctCount,
        lastPracticeDate: new Date()
      };
    } else {
      progress.push({
        id: generateId(),
        userId: state.user.id,
        moduleType,
        totalLearned: 1,
        correctCount: correct ? 1 : 0,
        totalPracticeTime: 0,
        lastPracticeDate: new Date()
      });
    }
    
    setStoredProgress(progress);
    set({ learningProgress: progress });
  },

  updateWordMastery: (word, level) => {
    const state = get();
    if (!state.user) return;
    
    const mastery = [...state.wordMastery];
    const existingIndex = mastery.findIndex(
      m => m.userId === state.user!.id && m.word === word
    );
    
    if (existingIndex >= 0) {
      mastery[existingIndex] = {
        ...mastery[existingIndex],
        masteryLevel: level,
        reviewCount: mastery[existingIndex].reviewCount + 1,
        lastReviewed: new Date()
      };
    } else {
      mastery.push({
        id: generateId(),
        userId: state.user.id,
        word,
        masteryLevel: level,
        reviewCount: 1,
        lastReviewed: new Date()
      });
    }
    
    setStoredWordMastery(mastery);
    set({ wordMastery: mastery });
  },

  unlockAchievement: (badgeId) => {
    const state = get();
    if (!state.user) return;
    
    const existingAchievement = state.achievements.find(
      a => a.userId === state.user!.id && a.badgeId === badgeId
    );
    
    if (existingAchievement) return;
    
    const newAchievement: Achievement = {
      id: generateId(),
      userId: state.user.id,
      badgeId,
      earnedAt: new Date()
    };
    
    const updatedAchievements = [...state.achievements, newAchievement];
    setStoredAchievements(updatedAchievements);
    set({ achievements: updatedAchievements });
  }
}));
