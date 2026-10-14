import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { COURSE_LENGTH_OPTIONS, DAILY_GOAL_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS, SKILL_OPTIONS, generateTodayPlan } from '../data/learningData';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    level: 'A1',
    goals: ['Everyday communication'],
    skills: ['Vocabulary', 'Grammar'],
    dailyGoalMinutes: 20,
    courseDurationMonths: 2,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const progress = useMemo(() => ((step + 1) / 5) * 100, [step]);

  const toggleValue = (field: 'goals' | 'skills', value: string) => {
    setForm((prev) => {
      const selected = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: selected };
    });
  };

  const nextStep = () => setStep((current) => Math.min(current + 1, 4));
  const prevStep = () => setStep((current) => Math.max(current - 1, 0));

  const saveProfile = async () => {
    setSaving(true);
    setError('');

    try {
      await api.put('/profile', {
        currentLevel: form.level,
        dailyGoalMinutes: form.dailyGoalMinutes,
        courseDurationMonths: form.courseDurationMonths,
        targetSkills: form.skills,
        learningGoals: form.goals,
      });

      const plan = generateTodayPlan(form.dailyGoalMinutes, form.level, form.skills, form.goals);
      localStorage.setItem('lingoreva-profile', JSON.stringify({ ...form, plan, xp: 0, streakDays: 0 }));
      localStorage.removeItem('lingopath-profile');
      navigate('/placement');
    } catch (err) {
      console.error('Failed to save onboarding profile', err);
      setError('Could not save your onboarding settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const canContinue =
    (step === 0 && !!form.level) ||
    (step === 1 && form.goals.length > 0) ||
    (step === 2 && form.skills.length > 0) ||
    (step === 3 && form.dailyGoalMinutes > 0) ||
    (step === 4 && form.courseDurationMonths > 0);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <img src="/favicon.png?v=2" alt="" aria-hidden="true" className="h-10 w-10 rounded-2xl object-cover" />
            <div>
              <p className="font-semibold text-white">Lingoreva</p>
              <p>Personalised onboarding</p>
            </div>
          </div>
          <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
            Step {step + 1} of 5
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl md:p-8">
          <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500 transition-all" style={{ width: `${progress}%` }} />
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {step === 0 && (
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-300">Step 1</p>
              <h1 className="text-3xl font-bold md:text-4xl">Choose your starting level</h1>
              <p className="mt-3 max-w-xl text-slate-300">This helps us build a realistic and supportive learning path without overestimating your current level.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {LEVEL_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setForm((prev) => ({ ...prev, level: option.value }))}
                    className={`rounded-2xl border p-4 text-left transition ${form.level === option.value ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-slate-900/70 hover:border-cyan-400/50 hover:bg-slate-800'}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-lg font-bold">{option.label}</span>
                      {form.level === option.value && <span className="rounded-full bg-cyan-400 px-2 py-1 text-xs font-bold text-slate-950">Selected</span>}
                    </div>
                    <p className="text-sm text-slate-300">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-300">Step 2</p>
              <h2 className="text-3xl font-bold md:text-4xl">Select your learning goals</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {GOAL_OPTIONS.map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => toggleValue('goals', goal)}
                    className={`rounded-2xl border p-4 text-left transition ${form.goals.includes(goal) ? 'border-violet-400 bg-violet-500/10' : 'border-white/10 bg-slate-900/70 hover:border-violet-400/40'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-white">{goal}</span>
                      {form.goals.includes(goal) && <span className="text-violet-300">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-300">Step 3</p>
              <h2 className="text-3xl font-bold md:text-4xl">Choose the skills you want to improve</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => toggleValue('skills', skill)}
                    className={`rounded-2xl border p-4 text-left transition ${form.skills.includes(skill) ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 bg-slate-900/70 hover:border-emerald-400/40'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-white">{skill}</span>
                      {form.skills.includes(skill) && <span className="text-emerald-300">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-300">Step 4</p>
              <h2 className="text-3xl font-bold md:text-4xl">How much time can you study per day?</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {DAILY_GOAL_OPTIONS.map((minutes) => (
                  <button
                    type="button"
                    key={minutes}
                    onClick={() => setForm((prev) => ({ ...prev, dailyGoalMinutes: minutes }))}
                    className={`rounded-2xl border p-5 text-left transition ${form.dailyGoalMinutes === minutes ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-white/10 bg-slate-900/70 text-slate-200 hover:border-cyan-400/40'}`}
                  >
                    <div className="text-3xl font-black">{minutes}</div>
                    <div className="mt-2 text-sm text-slate-300">minutes</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-300">Step 5</p>
              <h2 className="text-3xl font-bold md:text-4xl">Choose your learning horizon</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {COURSE_LENGTH_OPTIONS.map((months) => (
                  <button
                    type="button"
                    key={months}
                    onClick={() => setForm((prev) => ({ ...prev, courseDurationMonths: months }))}
                    className={`rounded-2xl border p-5 text-left transition ${form.courseDurationMonths === months ? 'border-fuchsia-400 bg-fuchsia-500/10 text-white' : 'border-white/10 bg-slate-900/70 text-slate-200 hover:border-fuchsia-400/40'}`}
                  >
                    <div className="text-2xl font-black">{months} month{months > 1 ? 's' : ''}</div>
                    <div className="mt-2 text-sm text-slate-300">~{months * 30} practice days</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canContinue}
                className="rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving || !canContinue}
                className="rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Start my placement test'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
