import type { Word, GrammarQuestion, SpeakingExercise, Badge } from '../types';

export const sampleVocabulary: Word[] = [
  { id: '1', english: 'abandon', chinese: '丢弃;放弃，抛弃', phonetic: '/əˈbændən/', example: 'He had to abandon his car in the snow.', difficulty: 'medium' },
  { id: '2', english: 'benefit', chinese: '利益;好处', phonetic: '/ˈbenɪfɪt/', example: 'We all benefit from exercise.', difficulty: 'easy' },
  { id: '3', english: 'absolute', chinese: '绝对的;纯粹的', phonetic: '/ˈæbsəluːt/', example: 'I have absolute trust in you.', difficulty: 'medium' },
  { id: '4', chinese: '完全地;绝对地', english: 'absolutely', phonetic: '/ˈæbsəluːtli/', example: 'You are absolutely right.', difficulty: 'easy' },
  { id: '5', english: 'culture', chinese: '文化;教养', phonetic: '/ˈkʌltʃə/', example: 'We should respect different cultures.', difficulty: 'medium' },
  { id: '6', english: 'abstract', chinese: '摘要', phonetic: '/ˈæbstrækt/', example: 'Please read the abstract first.', difficulty: 'hard' },
  { id: '7', english: 'development', chinese: '发展;开发', phonetic: '/dɪˈveləpmənt/', example: 'The city has seen rapid development.', difficulty: 'medium' },
  { id: '8', english: 'academic', chinese: '学院的;学术的', phonetic: '/ækəˈdemɪk/', example: 'The academic year starts in September.', difficulty: 'medium' },
  { id: '9', english: 'environment', chinese: '环境', phonetic: '/ɪnˈvaɪrənmənt/', example: 'We need to protect the environment.', difficulty: 'easy' },
  { id: '10', english: 'access', chinese: '接近;通道，入口', phonetic: '/ˈækses/', example: 'You need a password to access the system.', difficulty: 'easy' },
  { id: '11', english: 'finance', chinese: '财政;金融', phonetic: '/ˈfaɪnæns/', example: 'He works in finance.', difficulty: 'medium' },
  { id: '12', english: 'accompany', chinese: '陪伴，陪同;伴随', phonetic: '/əˈkʌmpəni/', example: 'Will you accompany me to the party?', difficulty: 'medium' },
  { id: '13', english: 'government', chinese: '政府', phonetic: '/ˈɡʌvənmənt/', example: 'The government has announced new policies.', difficulty: 'easy' },
  { id: '14', english: 'accurate', chinese: '准确的，正确无误的', phonetic: '/ˈækjərət/', example: 'Please be accurate in your work.', difficulty: 'medium' },
  { id: '15', english: 'history', chinese: '历史', phonetic: '/ˈhɪstri/', example: 'I enjoy studying history.', difficulty: 'easy' },
  { id: '16', english: 'acknowledge', chinese: '承认;致谢', phonetic: '/əkˈnɒlɪdʒ/', example: 'He acknowledged his mistake.', difficulty: 'hard' },
  { id: '17', english: 'information', chinese: '信息;消息', phonetic: '/ˌɪnfəˈmeɪʃn/', example: 'I need more information.', difficulty: 'easy' },
  { id: '18', english: 'adapt', chinese: '使适应;改编', phonetic: '/əˈdæpt/', example: 'Animals adapt to their environment.', difficulty: 'medium' },
  { id: '19', english: 'justice', chinese: '正义;司法', phonetic: '/ˈdʒʌstɪs/', example: 'We believe in justice for all.', difficulty: 'medium' },
  { id: '20', english: 'knowledge', chinese: '知识;学问', phonetic: '/ˈnɒlɪdʒ/', example: 'Knowledge is power.', difficulty: 'easy' },
  { id: '21', english: 'language', chinese: '语言', phonetic: '/ˈlæŋɡwɪdʒ/', example: 'English is an international language.', difficulty: 'easy' },
  { id: '22', english: 'management', chinese: '管理;经营', phonetic: '/ˈmænɪdʒmənt/', example: 'Good management is essential.', difficulty: 'medium' },
  { id: '23', english: 'network', chinese: '网络;网状系统', phonetic: '/ˈnetwɜːk/', example: 'The company has a global network.', difficulty: 'medium' },
  { id: '24', english: 'opportunity', chinese: '机会;机遇', phonetic: '/ˌɒpəˈtjuːnəti/', example: 'This is a great opportunity.', difficulty: 'medium' },
  { id: '25', english: 'performance', chinese: '表演;表现', phonetic: '/pəˈfɔːməns/', example: 'Her performance was excellent.', difficulty: 'medium' },
  { id: '26', english: 'quality', chinese: '质量;品质', phonetic: '/ˈkwɒləti/', example: 'We focus on quality.', difficulty: 'easy' },
  { id: '27', english: 'research', chinese: '研究;调查', phonetic: '/rɪˈsɜːtʃ/', example: 'He is doing research on cancer.', difficulty: 'medium' },
  { id: '28', english: 'strategy', chinese: '战略;策略', phonetic: '/ˈstrætədʒi/', example: 'We need a new strategy.', difficulty: 'hard' },
  { id: '29', english: 'technology', chinese: '技术;工艺', phonetic: '/tekˈnɒlədʒi/', example: 'Technology is changing rapidly.', difficulty: 'easy' },
  { id: '30', english: 'understanding', chinese: '理解;领会', phonetic: '/ˌʌndəˈstændɪŋ/', example: 'We need mutual understanding.', difficulty: 'medium' }
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
