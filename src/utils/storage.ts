const STORAGE_KEYS = {
  USER: 'language_learning_user',
  USERS: 'language_learning_users',
  PROGRESS: 'language_learning_progress',
  ACHIEVEMENTS: 'language_learning_achievements',
  WORD_MASTERY: 'language_learning_word_mastery'
} as const;

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  },

  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }
};

export const getStoredUser = () => storage.get(STORAGE_KEYS.USER, null);
export const setStoredUser = (user: unknown) => storage.set(STORAGE_KEYS.USER, user);
export const removeStoredUser = () => storage.remove(STORAGE_KEYS.USER);

export const getStoredUsers = () => storage.get(STORAGE_KEYS.USERS, []);
export const setStoredUsers = (users: unknown[]) => storage.set(STORAGE_KEYS.USERS, users);

export const getStoredProgress = () => storage.get(STORAGE_KEYS.PROGRESS, []);
export const setStoredProgress = (progress: unknown[]) => storage.set(STORAGE_KEYS.PROGRESS, progress);

export const getStoredAchievements = () => storage.get(STORAGE_KEYS.ACHIEVEMENTS, []);
export const setStoredAchievements = (achievements: unknown[]) => storage.set(STORAGE_KEYS.ACHIEVEMENTS, achievements);

export const getStoredWordMastery = () => storage.get(STORAGE_KEYS.WORD_MASTERY, []);
export const setStoredWordMastery = (wordMastery: unknown[]) => storage.set(STORAGE_KEYS.WORD_MASTERY, wordMastery);
