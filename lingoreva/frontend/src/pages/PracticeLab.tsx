import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePracticeLab, type PracticeTask } from '../data/learningData';

const readSavedProfile = () => {
  const saved = localStorage.getItem('lingoreva-profile') ?? localStorage.getItem('lingopath-profile');
  if (!saved) {
    return {
      level: 'A1',
      dailyGoalMinutes: 20,
      skills: ['Vocabulary', 'Grammar'],
      goals: ['Everyday communication'],
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
    };
  }
};

const readPracticeProgress = () => {
  try {
    return JSON.parse(localStorage.getItem('lingoreva-practice-progress') ?? '{}');
  } catch {
    return {};
  }
};

const PracticeLab: React.FC = () => {
  const navigate = useNavigate();
  const profile = useMemo(() => readSavedProfile(), []);

  const tasks = useMemo<PracticeTask[]>(
    () => generatePracticeLab(profile.level, profile.dailyGoalMinutes, profile.skills, profile.goals),
    [profile.dailyGoalMinutes, profile.goals, profile.level, profile.skills],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (tasks.length > 0 && !selectedId) {
      setSelectedId(tasks[0].id);
    }
  }, [selectedId, tasks]);

  useEffect(() => {
    const progress = readPracticeProgress();
    setAnswers((prev) => ({ ...prev, ...progress.answers }));
    setResults((prev) => ({ ...prev, ...progress.results }));
  }, []);

  const activeTask = tasks.find((task) => task.id === selectedId) ?? tasks[0];

  const saveProgress = (taskId: string, selectedAnswer: string, isCorrect: boolean) => {
    const previousCorrect = Boolean(results[taskId]);
    const nextAnswers = { ...answers, [taskId]: selectedAnswer };
    const nextResults = { ...results, [taskId]: isCorrect };
    setAnswers(nextAnswers);
    setResults(nextResults);
    localStorage.setItem('lingoreva-practice-progress', JSON.stringify({ answers: nextAnswers, results: nextResults }));

    if (isCorrect && !previousCorrect) {
      const profileData = readSavedProfile();
      const nextXp = (profileData.xp ?? 0) + (activeTask?.xp ?? 40);
      const updated = { ...profileData, xp: nextXp };
      localStorage.setItem('lingoreva-profile', JSON.stringify(updated));
    }
  };

  const handleAnswer = () => {
    if (!activeTask || !answers[activeTask.id]) {
      return;
    }

    const isCorrect = answers[activeTask.id] === activeTask.answer;
    setShowExplanation(true);
    saveProgress(activeTask.id, answers[activeTask.id], isCorrect);
  };

  const completedCount = tasks.filter((task) => results[task.id]).length;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Practice Lab</p>
            <h1 className="mt-2 text-4xl font-black">Real tasks for your daily English growth</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Back to dashboard
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          <span className="rounded-full bg-cyan-400/20 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.2em]">Daily progress</span>
          <span>{completedCount} / {tasks.length} exercises completed</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <button
                type="button"
                key={task.id}
                onClick={() => {
                  setSelectedId(task.id);
                  setShowExplanation(false);
                }}
                className={`rounded-[24px] border p-5 text-left transition ${activeTask?.id === task.id ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-cyan-400/50'}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                    {task.type}
                  </span>
                  <span className="text-xs text-slate-300">{task.duration} min</span>
                </div>
                <h3 className="text-xl font-bold text-white">{task.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{task.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
                  <span>{task.skill}</span>
                  <span className="font-semibold text-amber-300">+{task.xp} XP</span>
                </div>
                {results[task.id] !== undefined && (
                  <div className="mt-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                    {results[task.id] ? 'Correct' : 'Try again'}
                  </div>
                )}
              </button>
            ))}
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            {activeTask && (
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Selected task</p>
                <h2 className="mt-3 text-2xl font-bold">{activeTask.title}</h2>
                <div className="mt-6 space-y-4 text-sm text-slate-300">
                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus</p>
                    <p className="mt-2 text-base text-white">{activeTask.skill} • {activeTask.goal}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Difficulty</p>
                    <p className="mt-2 text-base text-white">{activeTask.difficulty}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Estimated time</p>
                    <p className="mt-2 text-base text-white">{activeTask.duration} minutes</p>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Task</p>
                  <p className="mt-3 text-lg font-semibold text-white">{activeTask.prompt}</p>

                  <div className="mt-5 space-y-3">
                    {activeTask.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [activeTask.id]: option }))}
                        className={`w-full rounded-2xl border p-3 text-left text-sm transition ${answers[activeTask.id] === option ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-white/10 bg-slate-950 text-slate-200 hover:border-cyan-400/40'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showExplanation && (
                    <div className={`mt-5 rounded-2xl border p-4 text-sm ${answers[activeTask.id] === activeTask.answer ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100' : 'border-amber-400/40 bg-amber-500/10 text-amber-100'}`}>
                      <p className="font-bold">{answers[activeTask.id] === activeTask.answer ? 'Correct answer' : 'Review'}</p>
                      <p className="mt-2">{activeTask.explanation}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAnswer}
                    className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-400 px-4 py-3 text-sm font-bold text-slate-950"
                  >
                    Check answer
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PracticeLab;
