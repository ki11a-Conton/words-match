import type { Word, GrammarQuestion, SpeakingExercise, Badge } from '../types';

export const sampleVocabulary: Word[] = [
  { id: '1', english: 'abandon', chinese: '丢弃;放弃，抛弃', phonetic: '/əˈbændən/', example: 'He had to abandon his car in the snow.', difficulty: 'medium' },
  { id: '2', english: 'aboard', chinese: '在船(车)上;上船', phonetic: '/əˈbɔːd/', example: 'Welcome aboard the flight to Paris.', difficulty: 'easy' },
  { id: '3', english: 'absolute', chinese: '绝对的;纯粹的', phonetic: '/ˈæbsəluːt/', example: 'I have absolute trust in you.', difficulty: 'medium' },
  { id: '4', english: 'absolutely', chinese: '完全地;绝对地', phonetic: '/ˈæbsəluːtli/', example: 'You are absolutely right.', difficulty: 'easy' },
  { id: '5', english: 'absorb', chinese: '吸收;使专心', phonetic: '/əbˈsɔːb/', example: 'Plants absorb sunlight.', difficulty: 'medium' },
  { id: '6', english: 'abstract', chinese: '摘要', phonetic: '/ˈæbstrækt/', example: 'Please read the abstract first.', difficulty: 'hard' },
  { id: '7', english: 'abundant', chinese: '丰富的;大量的', phonetic: '/əˈbʌndənt/', example: 'We have abundant resources.', difficulty: 'medium' },
  { id: '8', english: 'academic', chinese: '学院的;学术的', phonetic: '/ækəˈdemɪk/', example: 'The academic year starts in September.', difficulty: 'medium' },
  { id: '9', english: 'accelerate', chinese: '(使)加快;促进', phonetic: '/əkˈseləreɪt/', example: 'We need to accelerate our efforts.', difficulty: 'hard' },
  { id: '10', english: 'access', chinese: '接近;通道，入口', phonetic: '/ˈækses/', example: 'You need a password to access the system.', difficulty: 'easy' },
  { id: '11', english: 'accommodate', chinese: '容纳;供应，供给', phonetic: '/əˈkɒmədeɪt/', example: 'This room can accommodate 20 people.', difficulty: 'hard' },
  { id: '12', english: 'accompany', chinese: '陪伴，陪同;伴随', phonetic: '/əˈkʌmpəni/', example: 'Will you accompany me to the party?', difficulty: 'medium' },
  { id: '13', english: 'accomplish', chinese: '达到(目的);完成', phonetic: '/əˈkʌmplɪʃ/', example: 'She accomplished her goal.', difficulty: 'medium' },
  { id: '14', english: 'accurate', chinese: '准确的，正确无误的', phonetic: '/ˈækjərət/', example: 'Please be accurate in your work.', difficulty: 'medium' },
  { id: '15', english: 'achieve', chinese: '完成;达到', phonetic: '/əˈtʃiːv/', example: 'You can achieve anything with hard work.', difficulty: 'easy' },
  { id: '16', english: 'acknowledge', chinese: '承认;致谢', phonetic: '/əkˈnɒlɪdʒ/', example: 'He acknowledged his mistake.', difficulty: 'hard' },
  { id: '17', english: 'acquire', chinese: '取得;获得;学到', phonetic: '/əˈkwaɪə/', example: 'She acquired new skills.', difficulty: 'medium' },
  { id: '18', english: 'adapt', chinese: '使适应;改编', phonetic: '/əˈdæpt/', example: 'Animals adapt to their environment.', difficulty: 'medium' },
  { id: '19', english: 'adequate', chinese: '足够的;可以胜任的', phonetic: '/ˈædɪkwət/', example: 'We have adequate supplies.', difficulty: 'hard' },
  { id: '20', english: 'adjust', chinese: '调整，调节;校正', phonetic: '/əˈdʒʌst/', example: 'Please adjust your seat.', difficulty: 'easy' }
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
