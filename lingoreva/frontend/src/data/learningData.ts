export type StudyLevel = 'Pre-A1' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type StudyGoal = 'Everyday communication' | 'Travel English' | 'Work English' | 'IT & programming' | 'Business English' | 'Interview prep' | 'Study' | 'Academic English' | 'Exam preparation' | 'Fluent speaking';
export type StudySkill = 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Pronunciation';

export type PracticeTask = {
  id: string;
  title: string;
  type: string;
  duration: number;
  difficulty: string;
  description: string;
  skill: string;
  goal: string;
  level: string;
  xp: number;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type LessonQuestion = {
  id: string;
  skill: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type PlacementQuestion = {
  id: string;
  skillCategory: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
};

export const LEVEL_OPTIONS: { value: StudyLevel; label: string; description: string }[] = [
  { value: 'Pre-A1', label: 'Pre-A1', description: 'Start from zero' },
  { value: 'A1', label: 'A1', description: 'Elementary basics' },
  { value: 'A2', label: 'A2', description: 'Daily conversations' },
  { value: 'B1', label: 'B1', description: 'Independent use' },
  { value: 'B2', label: 'B2', description: 'Confidence and fluency' },
  { value: 'C1', label: 'C1', description: 'Advanced nuance' },
  { value: 'C2', label: 'C2', description: 'Near-native' },
];

export const GOAL_OPTIONS: StudyGoal[] = [
  'Everyday communication',
  'Travel English',
  'Work English',
  'IT & programming',
  'Business English',
  'Interview prep',
  'Study',
  'Academic English',
  'Exam preparation',
  'Fluent speaking',
];

export const SKILL_OPTIONS: StudySkill[] = [
  'Vocabulary',
  'Grammar',
  'Reading',
  'Listening',
  'Writing',
  'Speaking',
  'Pronunciation',
];

export const DAILY_GOAL_OPTIONS = [10, 20, 30];
export const COURSE_LENGTH_OPTIONS = [1, 2, 3];

const LEVEL_INDEX: Record<StudyLevel, number> = {
  'Pre-A1': 0,
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const getDaySeed = (date: Date = new Date()) => {
  const raw = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return [...raw].reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

const getDifficultyLabel = (level: string, daySeed: number, index: number) => {
  const levelScore = LEVEL_INDEX[(level as StudyLevel) ?? 'A1'] ?? 1;
  const combined = levelScore + index + (daySeed % 3 === 0 ? 1 : 0);
  if (combined <= 2) return 'Warm-up';
  if (combined <= 4) return 'Core';
  if (combined <= 6) return 'Challenge';
  return 'Expert';
};

const makeTaskFromTemplate = (
  skill: string,
  goal: string,
  level: string,
  daySeed: number,
  offset: number,
  template: { title: string; type: string; description: string; prompt: string; options: string[]; answer: string; explanation: string; },
): PracticeTask => {
  const levelScore = LEVEL_INDEX[(level as StudyLevel) ?? 'A1'] ?? 1;
  const difficulty = getDifficultyLabel(level, daySeed, offset);

  return {
    id: `${skill.toLowerCase().replace(/\s+/g, '-')}-${daySeed}-${offset}`,
    title: template.title,
    type: template.type,
    duration: 6 + Math.max(0, levelScore - 1) + ((daySeed + offset) % 3),
    difficulty,
    description: template.description,
    skill,
    goal,
    level,
    xp: 50 + levelScore * 15 + offset * 10,
    prompt: template.prompt,
    options: template.options,
    answer: template.answer,
    explanation: template.explanation,
  };
};

const PRACTICE_BANK: Record<string, Array<{ title: string; type: string; description: string; prompt: string; options: string[]; answer: string; explanation: string }>> = {
  Vocabulary: [
    {
      title: 'Context clue check',
      type: 'Vocabulary',
      description: 'Choose the most natural word for the situation.',
      prompt: 'I was so tired after the flight that I just wanted to ______ on the sofa and rest.',
      options: ['lie down', 'pick up', 'give away', 'run around'],
      answer: 'lie down',
      explanation: '“Lie down” is the normal phrasal expression for resting on a sofa or bed.',
    },
    {
      title: 'Collocation practice',
      type: 'Vocabulary',
      description: 'Use useful high-frequency collocations in real sentences.',
      prompt: 'We need to ______ a decision before the meeting starts.',
      options: ['make', 'do', 'take', 'have'],
      answer: 'make',
      explanation: 'With “decision,” English uses “make a decision,” which is a fixed collocation.',
    },
    {
      title: 'Meaning in context',
      type: 'Vocabulary',
      description: 'Pick the word that matches the idea in context.',
      prompt: 'The manager wants to ______ the new team to improve communication.',
      options: ['organize', 'arrange', 'coordinate', 'deliver'],
      answer: 'coordinate',
      explanation: '“Coordinate” fits when a manager is bringing people together and making them work smoothly.',
    },
  ],
  Grammar: [
    {
      title: 'Verb tense review',
      type: 'Grammar',
      description: 'Choose the correct verb form for a completed action.',
      prompt: 'By the time she arrived, the team ______ the presentation already.',
      options: ['had finished', 'has finished', 'finishes', 'was finishing'],
      answer: 'had finished',
      explanation: 'Past perfect is used because the completion happened before another action in the past.',
    },
    {
      title: 'Article choice',
      type: 'Grammar',
      description: 'Select the article that sounds natural in context.',
      prompt: 'I saw ______ interesting documentary about space travel yesterday.',
      options: ['an', 'a', 'the', 'no article'],
      answer: 'an',
      explanation: '“Interesting” starts with a vowel sound, so the correct article is “an.”',
    },
    {
      title: 'Conditionals',
      type: 'Grammar',
      description: 'Choose the most natural conditional structure.',
      prompt: 'If I ______ more time, I would learn Spanish properly.',
      options: ['had', 'have', 'will have', 'am having'],
      answer: 'had',
      explanation: 'This is a second conditional sentence used for unreal or imagined situations.',
    },
  ],
  Reading: [
    {
      title: 'Main idea',
      type: 'Reading',
      description: 'Read the idea and select the best summary.',
      prompt: 'A local café introduced shorter opening hours because fewer customers visited early in the morning. The owner said the change would help staff and reduce costs.',
      options: ['The café wants to stay open later instead of earlier.', 'The café is closing permanently.', 'The café changed hours to match customer demand.', 'The café is expanding to another location.'],
      answer: 'The café changed hours to match customer demand.',
      explanation: 'The text says the café reduced morning hours because few people visited, so the change is based on demand and cost efficiency.',
    },
    {
      title: 'Inference',
      type: 'Reading',
      description: 'Decide what can be inferred from the text.',
      prompt: 'Maria was late to the meeting because her train was delayed, but she still arrived with a clear summary of her progress and a solution for the problem.',
      options: ['She was not prepared for the meeting.', 'She handled the situation professionally.', 'She left the office early.', 'She never works with teams.'],
      answer: 'She handled the situation professionally.',
      explanation: 'Her calm, prepared response suggests professionalism and problem-solving under pressure.',
    },
  ],
  Listening: [
    {
      title: 'Listening for details',
      type: 'Listening',
      description: 'Listen to the key idea and choose the correct summary.',
      prompt: 'A speaker says: “I’m not sure if we can finish this project before Friday, but we can definitely finish the first draft by tomorrow.”',
      options: ['The whole project will be done tomorrow.', 'The first draft can be ready tomorrow, but the full project may take longer.', 'The project is cancelled.', 'The team has already finished everything.'],
      answer: 'The first draft can be ready tomorrow, but the full project may take longer.',
      explanation: 'The speaker distinguishes between the draft and the full project, showing a realistic timeline.',
    },
    {
      title: 'Tone understanding',
      type: 'Listening',
      description: 'Choose the best interpretation of the speaker’s tone.',
      prompt: '“I wish I had brought my umbrella — now I’m soaked.”',
      options: ['The speaker is excited about the weather.', 'The speaker is complaining about the rain.', 'The speaker is speaking formally to a client.', 'The speaker approves of the weather.'],
      answer: 'The speaker is complaining about the rain.',
      explanation: 'The phrase is clearly expressive and negative, showing frustration with getting wet.',
    },
  ],
  Speaking: [
    {
      title: 'Conversation flow',
      type: 'Speaking',
      description: 'Choose the sentence that sounds most natural in a conversation.',
      prompt: 'You want to politely ask for a recommendation.',
      options: ['Could you suggest a good restaurant nearby?', 'You must recommend me a restaurant.', 'I want eat a restaurant near.', 'Recommend to me where eat.'],
      answer: 'Could you suggest a good restaurant nearby?',
      explanation: 'This is the most natural and polite request in English.',
    },
    {
      title: 'Useful phrase',
      type: 'Speaking',
      description: 'Choose the best response to a request for help.',
      prompt: 'A friend asks: “Can you help me with this email?”',
      options: ['Of course, I can take a look at it.', 'I no help with this email.', 'It help you maybe not.', 'I help not because busy.'],
      answer: 'Of course, I can take a look at it.',
      explanation: 'This is a natural, polite, and clear response to helping someone.',
    },
  ],
  Pronunciation: [
    {
      title: 'Stress pattern',
      type: 'Pronunciation',
      description: 'Choose the sentence with the correct emphasis for natural speech.',
      prompt: 'Which sentence sounds most natural in spoken English?',
      options: ['I want to travel next year.', 'I want to TRAVEL next year.', 'I WANT to travel next year.', 'I want to travel NEXT year.'],
      answer: 'I want to travel next year.',
      explanation: 'The sentence is neutral and natural; the emphasis is not strongly placed unless the speaker is contrasting a point.',
    },
  ],
};

export const generateTodayPlan = (minutes: number, level: string = 'A1', skills: string[] = [], goals: string[] = []) => {
  const studyMinutes = [10, 20, 30].includes(minutes) ? minutes : 20;
  const normalizedSkills = skills.length ? skills : ['Vocabulary', 'Grammar'];
  const normalizedGoals = goals.length ? goals : ['Everyday communication'];
  const warmupDuration = Math.round(studyMinutes * 0.2);
  const coreDuration = Math.round(studyMinutes * 0.4);
  const deepDuration = studyMinutes === 30 ? 5 : 0;
  const practiceDuration = studyMinutes - warmupDuration - coreDuration - deepDuration;

  const tasks = [
    {
      id: 'warmup',
      type: 'Warm-up',
      title: 'Quick pronunciation + review',
      duration: warmupDuration,
      description: 'Activate the target language with short speaking and listening tasks.',
      accent: 'rose',
    },
    {
      id: 'core',
      type: 'Core lesson',
      title: `${normalizedSkills[0]} focus`,
      duration: coreDuration,
      description: `Practice ${normalizedSkills[0].toLowerCase()} with ${normalizedGoals[0].toLowerCase()} phrases and context.`,
      accent: 'indigo',
    },
    {
      id: 'practice',
      type: 'Practice',
      title: `${normalizedSkills[1] ?? 'Grammar'} drill`,
      duration: practiceDuration,
      description: 'Complete a focused exercise set and review the most common mistakes.',
      accent: 'emerald',
    },
  ];

  if (studyMinutes === 30) {
    tasks.push({
      id: 'deep',
      type: 'Deep work',
      title: 'Mini conversation or reading block',
      duration: deepDuration,
      description: 'Use the extra time for real-life dialogue or careful reading with follow-up questions.',
      accent: 'amber',
    });
  }

  return {
    level,
    minutes,
    focus: normalizedSkills,
    goals: normalizedGoals,
    tasks,
  };
};

export const generatePracticeLab = (level: string = 'A1', minutes: number = 20, skills: string[] = [], goals: string[] = []) => {
  const preparedSkills = skills.length ? skills : ['Vocabulary', 'Grammar'];
  const preparedGoals = goals.length ? goals : ['Everyday communication'];
  const daySeed = getDaySeed();

  const taskPool: PracticeTask[] = [];
  const taskCount = Math.max(4, Math.min(6, Math.ceil(minutes / 8) + 1));

  for (let index = 0; index < taskCount; index += 1) {
    const skill = preparedSkills[index % preparedSkills.length];
    const goal = preparedGoals[index % preparedGoals.length];
    const templateList = PRACTICE_BANK[skill] ?? PRACTICE_BANK.Vocabulary;
    const template = templateList[(daySeed + index) % templateList.length];
    taskPool.push(makeTaskFromTemplate(skill, goal, level, daySeed, index, template));
  }

  return taskPool;
};

export const buildDailyLesson = (
  profile: { level?: string; skills?: string[]; goals?: string[]; dailyGoalMinutes?: number } = {},
  dayNumber: number = 1,
) => {
  const level = profile.level ?? 'A1';
  const goal = profile.goals?.[0] ?? 'Everyday communication';
  const skill = profile.skills?.[0] ?? 'Vocabulary';
  const normalizedDay = Math.max(1, dayNumber);
  const levelTopics: Record<string, { grammar: string; vocabulary: string[]; tip: string; objective: string; phrase: string; challenge: { question: string; options: string[]; answer: string; explanation: string } }> = {
    'Pre-A1': {
      grammar: 'to be, present simple, short answers',
      vocabulary: ['hello', 'work', 'break', 'home', 'coffee'],
      tip: 'Use short, clear sentences and repeat them aloud.',
      objective: 'Introduce yourself and talk about daily routines.',
      phrase: 'I am ready to start my day.',
      challenge: {
        question: 'Which sentence is correct?',
        options: ['I am ready to start my day.', 'I ready to start my day.', 'I is ready to start my day.', 'I am ready starting my day.'],
        answer: 'I am ready to start my day.',
        explanation: 'The correct structure is subject + am/is/are + adjective/noun phrase.',
      },
    },
    A1: {
      grammar: 'present simple, adverbs of frequency, articles',
      vocabulary: ['usually', 'schedule', 'commute', 'tired', 'practice'],
      tip: 'Focus on one daily routine and repeat it in different forms.',
      objective: 'Talk about habits, routines, and work or study schedules.',
      phrase: 'I usually wake up at 7 a.m. and start work on time.',
      challenge: {
        question: 'Choose the best sentence for a daily routine.',
        options: ['I usually wake up at 7 a.m.', 'I wake usually at 7 a.m.', 'I at 7 a.m. wake usually.', 'I wake up usually 7 a.m.'],
        answer: 'I usually wake up at 7 a.m.',
        explanation: '“Usually” comes before the main verb in present simple routines.',
      },
    },
    A2: {
      grammar: 'past simple, there is/there are, comparison',
      vocabulary: ['appointment', 'delayed', 'neighbourhood', 'review', 'on time'],
      tip: 'Use time markers like yesterday, last week, and in the morning.',
      objective: 'Describe recent events, plans, and simple comparisons.',
      phrase: 'I had a busy day, but I finished my tasks before the meeting.',
      challenge: {
        question: 'Which sentence is correct?',
        options: ['I had a busy day yesterday.', 'I have a busy day yesterday.', 'I was have a busy day yesterday.', 'I had been a busy day yesterday.'],
        answer: 'I had a busy day yesterday.',
        explanation: 'Past simple is used for completed actions in the past.',
      },
    },
    B1: {
      grammar: 'present perfect, modals for advice, linking words',
      vocabulary: ['improve', 'deadline', 'solution', 'efficient', 'priority'],
      tip: 'Connect ideas with because, although, and however to sound more natural.',
      objective: 'Explain progress, solve problems, and talk about experience.',
      phrase: 'I have already improved my speaking by listening every day.',
      challenge: {
        question: 'Choose the best answer.',
        options: ['I have already improved my speaking.', 'I already improved my speaking now.', 'I have improve my speaking.', 'I improved already my speaking.'],
        answer: 'I have already improved my speaking.',
        explanation: 'Present perfect is used for actions that are connected to the present.',
      },
    },
    B2: {
      grammar: 'conditionals, passive voice, hedging language',
      vocabulary: ['insight', 'outcome', 'predict', 'strategy', 'approach'],
      tip: 'Use natural, measured language to sound more fluent and persuasive.',
      objective: 'Discuss strategies, decisions, and professional communication.',
      phrase: 'If we improve our routine, the outcome will be much more consistent.',
      challenge: {
        question: 'Which sentence is most natural?',
        options: ['If we improve our routine, the outcome will be more consistent.', 'If we improved our routine, the outcome would be more consistent.', 'If we improve our routine, the outcome has been more consistent.', 'If we would improve our routine, the outcome is more consistent.'],
        answer: 'If we improve our routine, the outcome will be more consistent.',
        explanation: 'This is a first conditional sentence about a realistic future result.',
      },
    },
    C1: {
      grammar: 'advanced linking, inversion, nuanced conditionals',
      vocabulary: ['nuance', 'framework', 'assess', 'coherent', 'sophisticated'],
      tip: 'Aim for precision and connection between ideas instead of short fragments.',
      objective: 'Summarise complex decisions, outcomes, and professional points of view.',
      phrase: 'The key is to assess the data carefully before drawing a firm conclusion.',
      challenge: {
        question: 'Choose the most precise sentence.',
        options: ['The key is to assess the data carefully before drawing a firm conclusion.', 'The key is assessing the data carefully before draw a conclusion.', 'The key is to assess carefully the data before drawing conclusion.', 'The key is to assess the data careful before to draw a firm conclusion.'],
        answer: 'The key is to assess the data carefully before drawing a firm conclusion.',
        explanation: 'This sentence is grammatically correct and natural in advanced academic or professional English.',
      },
    },
    C2: {
      grammar: 'register control, idiomatic precision, advanced nuance',
      vocabulary: ['deliberately', 'contextual', 'subtle', 'sophisticated', 'implication'],
      tip: 'Aim for precise word choice and a polished, audience-aware tone.',
      objective: 'Handle nuanced arguments, leadership communication, and advanced discussion.',
      phrase: 'The underlying implication is that the strategy must evolve with the market rather than react to it.',
      challenge: {
        question: 'Choose the most natural advanced sentence.',
        options: ['The underlying implication is that the strategy must evolve with the market.', 'The underlying implication is that the strategy must evolve with market.', 'The underlying implication is that the strategy must evolves with the market.', 'The implication underlying is that strategy must evolve with the market.'],
        answer: 'The underlying implication is that the strategy must evolve with the market.',
        explanation: 'This sentence is grammatically accurate and uses precise abstract vocabulary effectively.',
      },
    },
  };

  const lessonTheme = levelTopics[level] ?? levelTopics.A1;
  const dayProgression = normalizedDay % 7 || 7;
  const lessonGoal = goal || 'Everyday communication';
  const lessonSkill = skill || 'Vocabulary';
  const minutes = [10, 20, 30].includes(profile.dailyGoalMinutes ?? 20) ? profile.dailyGoalMinutes ?? 20 : 20;
  const questionCount = (minutes / 10) * 3;
  const lessonQuestionPool: LessonQuestion[] = [
    {
      id: 'lesson-focus',
      skill: lessonSkill,
      prompt: lessonTheme.challenge.question,
      options: lessonTheme.challenge.options,
      answer: lessonTheme.challenge.answer,
      explanation: lessonTheme.challenge.explanation,
    },
    ...Object.entries(PRACTICE_BANK).flatMap(([bankSkill, templates]) =>
      templates.map((template, index) => ({
        id: `${bankSkill.toLowerCase()}-${index}`,
        skill: bankSkill,
        prompt: template.prompt,
        options: template.options,
        answer: template.answer,
        explanation: template.explanation,
      })),
    ),
  ];
  const rotatedQuestionPool = [
    ...lessonQuestionPool.slice(dayProgression % lessonQuestionPool.length),
    ...lessonQuestionPool.slice(0, dayProgression % lessonQuestionPool.length),
  ];
  const questions = rotatedQuestionPool.slice(0, questionCount).map((question, index) => ({
    ...question,
    id: `${question.id}-${normalizedDay}-${index}`,
  }));

  return {
    id: `daily-lesson-${normalizedDay}-${level}`,
    dayNumber: normalizedDay,
    title: `${lessonGoal} • day ${normalizedDay}`,
    level,
    duration: minutes,
    questionCount,
    questions,
    focus: lessonSkill,
    objective: `${lessonTheme.objective} (${lessonSkill.toLowerCase()} focus)`,
    grammarPoint: lessonTheme.grammar,
    vocabulary: lessonTheme.vocabulary.slice(0, 4 + (dayProgression % 2)),
    phrase: lessonTheme.phrase,
    dialogue: [
      { speaker: 'Teacher', text: `Today we focus on ${lessonTheme.grammar}.` },
      { speaker: 'Student', text: `I want to practice ${lessonGoal.toLowerCase()} so I can improve my ${lessonSkill.toLowerCase()}.` },
      { speaker: 'Teacher', text: `Great. Let’s use this sentence: “${lessonTheme.phrase}”` },
    ],
    exercise: `Write 3 sentences using the target phrase and today’s focus: ${lessonTheme.grammar}.`,
    challenge: lessonTheme.challenge,
    xp: 80 + normalizedDay * 15,
  };
};

export const getPlacementQuestions = (): PlacementQuestion[] => [
  {
    id: 'placement-1',
    skillCategory: 'Vocabulary',
    questionText: 'Choose the correct word: “I want to _____ a coffee before work.”',
    optionA: 'drink',
    optionB: 'drinks',
    optionC: 'drinking',
    optionD: 'drank',
    correctOption: 'A',
  },
  {
    id: 'placement-2',
    skillCategory: 'Grammar',
    questionText: 'Complete the sentence: “She _____ to the office every morning.”',
    optionA: 'go',
    optionB: 'goes',
    optionC: 'going',
    optionD: 'gone',
    correctOption: 'B',
  },
  {
    id: 'placement-3',
    skillCategory: 'Listening',
    questionText: 'Which phrase means the same as “I am not sure”?',
    optionA: 'I know exactly.',
    optionB: 'I am uncertain.',
    optionC: 'I am angry.',
    optionD: 'I am leaving now.',
    correctOption: 'B',
  },
  {
    id: 'placement-4',
    skillCategory: 'Grammar',
    questionText: 'Choose the correct sentence:',
    optionA: 'I have finished my homework yesterday.',
    optionB: 'I finished my homework yesterday.',
    optionC: 'I am finish my homework yesterday.',
    optionD: 'I was finish my homework yesterday.',
    correctOption: 'B',
  },
  {
    id: 'placement-5',
    skillCategory: 'Vocabulary',
    questionText: 'Which word best completes the sentence? “The meeting was very _____ and we made a decision quickly.”',
    optionA: 'effective',
    optionB: 'effectively',
    optionC: 'effect',
    optionD: 'effecting',
    correctOption: 'A',
  },
  {
    id: 'placement-6',
    skillCategory: 'Reading',
    questionText: 'If a person says, “I have mixed feelings about the plan,” they are:',
    optionA: 'very excited',
    optionB: 'fully convinced',
    optionC: 'uncertain or divided',
    optionD: 'completely unwilling',
    correctOption: 'C',
  },
  {
    id: 'placement-7',
    skillCategory: 'Grammar',
    questionText: 'Choose the correct form: “If I _____ enough money, I would travel more.”',
    optionA: 'have',
    optionB: 'had',
    optionC: 'will have',
    optionD: 'has',
    correctOption: 'B',
  },
  {
    id: 'placement-8',
    skillCategory: 'Speaking',
    questionText: 'Which reply is most natural?',
    optionA: 'I am very agree with you.',
    optionB: 'I completely agree with you.',
    optionC: 'I am compatibility with you.',
    optionD: 'I have agree to you.',
    correctOption: 'B',
  },
  {
    id: 'placement-9',
    skillCategory: 'Writing',
    questionText: 'Choose the best sentence for formal email writing:',
    optionA: 'Please send me the report ASAP.',
    optionB: 'Could you send me the report at your earliest convenience?',
    optionC: 'Send the report now or else.',
    optionD: 'I need the report right away, bro.',
    correctOption: 'B',
  },
  {
    id: 'placement-10',
    skillCategory: 'Listening',
    questionText: 'If someone says, “I’ll keep you posted,” they mean:',
    optionA: 'They will definitely stop contacting you.',
    optionB: 'They will send updates later.',
    optionC: 'They want you to leave.',
    optionD: 'They are not interested.',
    correctOption: 'B',
  },
  {
    id: 'placement-11',
    skillCategory: 'Grammar',
    questionText: 'Choose the sentence with the correct passive voice:',
    optionA: 'The project was finished by the team yesterday.',
    optionB: 'The project finished by the team yesterday.',
    optionC: 'The team was finished the project yesterday.',
    optionD: 'The team finishes the project yesterday.',
    correctOption: 'A',
  },
  {
    id: 'placement-12',
    skillCategory: 'Vocabulary',
    questionText: 'Which word is closest in meaning to “brief”?',
    optionA: 'Long',
    optionB: 'Short',
    optionC: 'Careful',
    optionD: 'Noisy',
    correctOption: 'B',
  },
];

export const evaluatePlacementScore = (answers: { questionId: string; selectedOption: string }[]) => {
  const questionsById = new Map(getPlacementQuestions().map((question) => [question.id, question]));
  const score = answers.reduce((total, answer) => {
    const question = questionsById.get(answer.questionId);
    if (!question) return total;
    return total + (question.correctOption === answer.selectedOption ? 1 : 0);
  }, 0);

  if (score >= 10) return 'C2';
  if (score >= 9) return 'C1';
  if (score >= 7) return 'B2';
  if (score >= 5) return 'B1';
  if (score >= 3) return 'A2';
  if (score >= 1) return 'A1';
  return 'Pre-A1';
};
