export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  // 使用Fisher-Yates洗牌算法，增加随机性种子
  const seed = Date.now();
  const random = (max: number) => {
    const x = Math.sin(seed + Math.random()) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  // 再次洗牌确保随机性
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
