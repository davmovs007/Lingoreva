import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { buildDailyLesson } from '../data/learningData';

type LessonProgress = {
  currentIndex: number;
  earnedXp: number;
  results: Record<string, boolean>;
  answers: Record<string, string>;
  completed: boolean;
};

const readProfile = () => {
  const saved = localStorage.getItem('lingoreva-profile') ?? localStorage.getItem('lingopath-profile');
  if (!saved) {
    return {
      level: 'A1',
      dailyGoalMinutes: 20,
      skills: ['Vocabulary', 'Grammar'],
      goals: ['Everyday communication'],
      streakDays: 0,
      xp: 0,
    };
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {
      level: 'A1',
      dailyGoalMinutes: 20,
      skills: ['Vocabulary', 'Grammar'],
      goals: ['Everyday communication'],
      streakDays: 0,
      xp: 0,
    };
  }
};

const DailyLesson: React.FC = () => {
  const navigate = useNavigate();
  const profile = useMemo(() => readProfile(), []);
  const dayNumber = useMemo(() => {
    const stored = Number(localStorage.getItem('lingoreva-day-counter') ?? '1');
    return Number.isFinite(stored) && stored > 0 ? stored : 1;
  }, []);
  const progressKey = `lingoreva-lesson-progress-${dayNumber}`;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<LessonProgress>(() => {
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) return JSON.parse(saved) as LessonProgress;
    } catch (error) {
      console.warn('Could not restore lesson progress', error);
    }
    return { currentIndex: 0, earnedXp: 0, results: {}, answers: {}, completed: false };
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<{ correct: boolean; explanation: string } | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      const localLesson = buildDailyLesson(profile, dayNumber);
      try {
        const response = await api.get('/lessons/next');
        if (response.data) {
          setLesson({ ...response.data, ...localLesson });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('No backend lesson available, using adaptive local lesson flow.', error);
      }

      setLesson(localLesson);
      setLoading(false);
    };

    loadLesson();
  }, [dayNumber, profile]);

  const currentQuestion = lesson?.questions?.[progress.currentIndex];
  const completed = progress.completed;

  useEffect(() => {
    if (!lesson || progress.completed || progress.currentIndex < lesson.questionCount) return;
    const nextProgress = { ...progress, currentIndex: Math.max(0, lesson.questionCount - 1) };
    setProgress(nextProgress);
    localStorage.setItem(progressKey, JSON.stringify(nextProgress));
  }, [lesson, progress, progressKey]);

  useEffect(() => {
    if (!currentQuestion) return;
    setSelectedAnswer(progress.answers[currentQuestion.id] ?? null);
    setChallengeResult(
      progress.results[currentQuestion.id] === undefined
        ? null
        : {
            correct: progress.results[currentQuestion.id],
            explanation: currentQuestion.explanation,
          },
    );
  }, [currentQuestion, progress.answers, progress.results]);

  const persistProgress = (nextProgress: LessonProgress) => {
    setProgress(nextProgress);
    localStorage.setItem(progressKey, JSON.stringify(nextProgress));
  };

  const checkAnswer = () => {
    if (!currentQuestion || !selectedAnswer) {
      setChallengeResult({
        correct: false,
        explanation: 'Choose an answer to check your result.',
      });
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.answer;
    const alreadyEarned = progress.results[currentQuestion.id] === true;
    const questionXp = 15 + Math.max(0, ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(lesson.level)) * 5;
    const nextProgress: LessonProgress = {
      ...progress,
      results: { ...progress.results, [currentQuestion.id]: isCorrect || alreadyEarned },
      answers: { ...progress.answers, [currentQuestion.id]: selectedAnswer },
      earnedXp: progress.earnedXp + (isCorrect && !alreadyEarned ? questionXp : 0),
    };

    if (isCorrect && !alreadyEarned) {
      const nextProfile = readProfile();
      localStorage.setItem(
        'lingoreva-profile',
        JSON.stringify({ ...nextProfile, xp: (Number(nextProfile.xp) || 0) + questionXp }),
      );
    }

    persistProgress(nextProgress);
    setChallengeResult({
      correct: isCorrect,
      explanation: currentQuestion.explanation,
    });
  };

  const continueLesson = async () => {
    if (!lesson || !currentQuestion || !challengeResult?.correct) return;

    if (progress.currentIndex + 1 < lesson.questions.length) {
      setSelectedAnswer(null);
      setChallengeResult(null);
      persistProgress({ ...progress, currentIndex: progress.currentIndex + 1 });
      return;
    }

    const nextProfile = readProfile();
    localStorage.setItem(
      'lingoreva-profile',
      JSON.stringify({
        ...nextProfile,
        streakDays: (Number(nextProfile.streakDays) || 0) + 1,
        level: lesson.level,
      }),
    );
    localStorage.setItem('lingoreva-day-counter', String(dayNumber + 1));
    persistProgress({ ...progress, completed: true });

    try {
      await api.post('/lessons/complete', {
        lessonId: lesson.id,
        score: 100,
      });
    } catch (error) {
      console.warn('Skipping backend lesson completion update', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading lesson...</div>;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-white flex flex-col items-center justify-center">
        <h2 className="mb-3 text-3xl font-black">No lessons available!</h2>
        <p className="mb-6 text-slate-300">You’ve completed your current lesson track.</p>
        <button onClick={() => navigate('/dashboard')} className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-slate-950">
          Back to dashboard
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-white animate-fade-in-up">
        <div className="rounded-[30px] border border-emerald-400/30 bg-emerald-500/10 p-10 text-center shadow-xl shadow-emerald-500/10">
          <h2 className="mb-4 text-4xl font-black text-emerald-300">Excellent work! 🎉</h2>
          <p className="text-lg text-slate-200">You earned {progress.earnedXp} XP by answering correctly and completed today’s lesson.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-3 font-bold text-slate-950">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <button onClick={() => navigate('/dashboard')} className="mb-6 text-sm font-medium text-cyan-300 hover:text-cyan-200">
          ← Back to dashboard
        </button>

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-500/10">
          <div className="bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 px-8 py-7">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Level {lesson.level} • Day {lesson.dayNumber}</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">{lesson.title}</h1>
          </div>

          <div className="space-y-8 p-8">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-cyan-100">Daily lesson • {lesson.duration} minutes</span>
                <span className="text-slate-200">Question {Math.min(progress.currentIndex + 1, lesson.questionCount)} of {lesson.questionCount}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all" style={{ width: `${(progress.currentIndex / lesson.questionCount) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-300">Correct answers earn XP. Your lesson progress is saved automatically.</p>
              <p className="mt-1 text-xs font-semibold text-emerald-300">XP earned this lesson: {progress.earnedXp}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Objective</p>
              <p className="mt-3 text-base text-slate-200">{lesson.objective}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Focus grammar</p>
              <p className="mt-3 text-lg font-semibold text-white">{lesson.grammarPoint}</p>
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-400">Key vocabulary</p>
              <div className="flex flex-wrap gap-2">
                {lesson.vocabulary.map((word: string) => (
                  <span key={word} className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Model sentence</p>
              <p className="mt-3 text-lg font-medium text-slate-200">“{lesson.phrase}”</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Mini dialogue</p>
              <div className="mt-4 space-y-3 text-slate-200">
                {lesson.dialogue.map((line: { speaker: string; text: string }, index: number) => (
                  <div key={`${line.speaker}-${index}`} className="rounded-xl bg-slate-950/70 p-3">
                    <span className="mr-2 text-sm font-bold text-cyan-300">{line.speaker}:</span>
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Practice task</p>
              <p className="mt-3 text-base text-slate-200">{lesson.exercise}</p>
            </div>

            {currentQuestion && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">{currentQuestion.skill} challenge</p>
                <span className="text-xs font-semibold text-emerald-300">+{15 + Math.max(0, ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(lesson.level)) * 5} XP</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-white">{currentQuestion.prompt}</p>

              <div className="mt-4 space-y-3">
                {currentQuestion.options.map((option: string) => (
                  <button
                    key={option}
                    type="button"
                    disabled={Boolean(challengeResult?.correct)}
                    onClick={() => {
                      setSelectedAnswer(option);
                      setChallengeResult(null);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left text-sm transition ${selectedAnswer === option ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-white/10 bg-slate-950 text-slate-200 hover:border-cyan-400/40'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {challengeResult && (
                <div className={`mt-4 rounded-2xl border p-4 text-sm ${challengeResult.correct ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100' : 'border-amber-400/40 bg-amber-500/10 text-amber-100'}`}>
                  <p className="font-bold">{challengeResult.correct ? 'Correct answer — XP added' : 'Not quite — try again'}</p>
                  <p className="mt-2">{challengeResult.explanation}</p>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={checkAnswer}
                  disabled={!selectedAnswer || Boolean(challengeResult?.correct)}
                  className="flex-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-bold text-slate-950"
                >
                  Check answer
                </button>
                <button
                  type="button"
                  onClick={continueLesson}
                  disabled={!challengeResult?.correct}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {progress.currentIndex + 1 < lesson.questionCount ? 'Continue to next question' : 'Finish lesson'}
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLesson;
