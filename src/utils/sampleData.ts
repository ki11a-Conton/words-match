import type { Word, GrammarQuestion, SpeakingExercise, Badge } from '../types';

export const sampleVocabulary: Word[] = [
  {
    id: '1',
    english: 'Serendipity',
    chinese: '意外发现珍奇事物的本领',
    phonetic: '/ˌserənˈdɪpɪti/',
    example: 'Finding that old photo was pure serendipity.',
    difficulty: 'hard'
  },
  {
    id: '2',
    english: 'Ephemeral',
    chinese: '短暂的、转瞬即逝的',
    phonetic: '/ɪˈfem(ə)rəl/',
    example: 'The beauty of cherry blossoms is ephemeral.',
    difficulty: 'medium'
  },
  {
    id: '3',
    english: 'Resilience',
    chinese: '韧性、适应力',
    phonetic: '/rɪˈzɪliəns/',
    example: 'Her resilience helped her overcome many challenges.',
    difficulty: 'hard'
  },
  {
    id: '4',
    english: 'Tranquil',
    chinese: '宁静的、平静的',
    phonetic: '/ˈtræŋkwɪl/',
    example: 'The lake was so tranquil in the morning.',
    difficulty: 'medium'
  },
  {
    id: '5',
    english: 'Curious',
    chinese: '好奇的',
    phonetic: '/ˈkjʊəriəs/',
    example: 'Children are naturally curious about the world.',
    difficulty: 'easy'
  }
];

export const sampleGrammar: GrammarQuestion[] = [
  {
    id: '1',
    question: 'I ___ to the park yesterday.',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 2,
    explanation: 'yesterday 表示过去时间，要用一般过去时。',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'She ___ her homework every day.',
    options: ['do', 'does', 'did', 'doing'],
    correctAnswer: 1,
    explanation: 'every day 表示经常性动作，主语是第三人称单数，用 does。',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'They ___ basketball when it started to rain.',
    options: ['play', 'played', 'are playing', 'were playing'],
    correctAnswer: 3,
    explanation: '表示过去某个时间正在进行的动作，用过去进行时。',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'If I ___ you, I would study harder.',
    options: ['am', 'was', 'were', 'be'],
    correctAnswer: 2,
    explanation: '虚拟语气中，be 动词一律用 were。',
    difficulty: 'hard'
  }
];

export const sampleSpeaking: SpeakingExercise[] = [
  {
    id: '1',
    text: 'The quick brown fox jumps over the lazy dog.',
    phonetic: 'ðə kwɪk braʊn fɒks dʒʌmps ˈəʊvə ðə ˈleɪzi dɒɡ.',
    translation: '敏捷的棕色狐狸跳过了懒狗。',
    difficulty: 'medium'
  },
  {
    id: '2',
    text: 'Practice makes perfect.',
    phonetic: 'ˈpræktɪs meɪks ˈpɜːfɪkt.',
    translation: '熟能生巧。',
    difficulty: 'easy'
  },
  {
    id: '3',
    text: 'Where there is a will, there is a way.',
    phonetic: 'weə ðeər ɪz ə wɪl, ðeər ɪz ə weɪ.',
    translation: '有志者，事竟成。',
    difficulty: 'hard'
  }
];

export const badges: Badge[] = [
  {
    id: 'first_day',
    name: '学习起步',
    description: '完成第一天的学习',
    icon: 'award',
    unlocked: true
  },
  {
    id: 'word_master',
    name: '单词大师',
    description: '掌握50个单词',
    icon: 'book',
    unlocked: false
  },
  {
    id: 'grammar_king',
    name: '语法之王',
    description: '完成30道语法题',
    icon: 'check',
    unlocked: false
  }
];

export { badges as sampleBadges };
