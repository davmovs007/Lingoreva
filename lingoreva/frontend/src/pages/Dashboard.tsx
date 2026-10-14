import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { generateTodayPlan } from '../data/learningData';

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [nextLesson, setNextLesson] = useState<any>(null);
  const [wordsToReview, setWordsToReview] = useState<any[]>([]);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, lessonRes, reviewRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: null })),
          api.get('/lessons/next').catch(() => ({ data: null })),
          api.get('/vocabulary/review').catch(() => ({ data: [] })),
        ]);

        const localProfile = (() => {
          const saved = localStorage.getItem('lingoreva-profile') ?? localStorage.getItem('lingopath-profile');
          if (!saved) return null;
          try {
            return JSON.parse(saved);
          } catch {
            return null;
          }
        })();

        const backendProfile = profileRes.data ?? {};
        const resolvedProfile = {
          currentLevel: backendProfile.currentLevel ?? localProfile?.currentLevel ?? localProfile?.level ?? 'A1',
          dailyGoalMinutes: backendProfile.dailyGoalMinutes ?? localProfile?.dailyGoalMinutes ?? 20,
          streakDays: backendProfile.streakDays ?? localProfile?.streakDays ?? 0,
          xp: localProfile?.xp ?? backendProfile.xp ?? 0,
          courseDurationMonths: backendProfile.courseDurationMonths ?? localProfile?.courseDurationMonths ?? 2,
          targetSkills: backendProfile.targetSkills ?? localProfile?.targetSkills ?? localProfile?.skills ?? ['Vocabulary', 'Grammar'],
          learningGoals: backendProfile.learningGoals ?? localProfile?.learningGoals ?? localProfile?.goals ?? ['Everyday communication'],
        };

        setProfile(resolvedProfile);
        setNextLesson(lessonRes.data);
        setWordsToReview(reviewRes.data ?? []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    fetchData();
  }, []);

  const todayPlan = useMemo(() => {
    if (!profile) return null;
    return generateTodayPlan(
      profile.dailyGoalMinutes ?? 20,
      profile.currentLevel ?? 'A1',
      profile.targetSkills ?? ['Vocabulary', 'Grammar'],
      profile.learningGoals ?? ['Everyday communication'],
    );
  }, [profile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profile) return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading dashboard...</div>;

  const completionProgress = Math.min(92, ((profile.streakDays ?? 0) * 10) + 30);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white md:px-8">
      <nav className="mx-auto mb-8 flex max-w-7xl items-center justify-between rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <img src="/favicon.png?v=2" alt="" aria-hidden="true" className="h-11 w-11 rounded-2xl object-cover" />
          <div>
            <p className="text-lg font-black tracking-tight">Lingoreva</p>
            <p className="text-xs text-slate-300">English growth system</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/practice')} className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20">
            Practice Lab
          </button>
          <button onClick={handleLogout} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10">
            Sign out
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900/90 to-violet-500/10 p-6 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Welcome back</p>
                <h1 className="mt-3 text-3xl font-black md:text-5xl">Your path to confident English starts today.</h1>
              </div>
              <button onClick={() => navigate('/lesson')} className="rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-violet-500/30">
                Continue lesson
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Level</p>
                <p className="mt-3 text-2xl font-black text-cyan-300">{profile.currentLevel || 'A1'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Streak</p>
                <p className="mt-3 text-2xl font-black text-amber-300">{profile.streakDays || 0} days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">XP</p>
                <p className="mt-3 text-2xl font-black text-emerald-300">{profile.xp || 0}</p>
              </div>
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Progress</p>
              <span className="text-xs text-slate-300">{Math.round(completionProgress)}%</span>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.18)_0%,_rgba(15,23,42,1)_58%)]">
                <div className="absolute inset-2 rounded-full border border-cyan-400/30" />
                <div className="absolute inset-4 rounded-full border border-violet-400/30" />
                <div className="text-3xl font-black text-white">{Math.round(completionProgress)}%</div>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-3">
                <span>Daily goal</span>
                <span className="font-semibold text-white">{profile.dailyGoalMinutes ?? 20} min</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-3">
                <span>Study plan</span>
                <span className="font-semibold text-white">{profile.courseDurationMonths ?? 2} months</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">Today’s plan</h2>
              <button onClick={() => navigate('/onboarding')} className="text-sm text-cyan-300 hover:text-cyan-200">Edit goals</button>
            </div>

            {todayPlan && (
              <div className="space-y-3">
                {todayPlan.tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{task.type}</p>
                      <h3 className="mt-2 text-lg font-bold text-white">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{task.description}</p>
                    </div>
                    <div className="min-w-[86px] rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 px-3 py-2 text-center text-sm font-bold text-cyan-200">
                      {task.duration}m
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">Quick stats</h2>
              <button onClick={() => navigate('/review')} className="text-sm text-emerald-300 hover:text-emerald-200">Review now</button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Words ready</p>
                <p className="mt-2 text-3xl font-black text-emerald-300">{wordsToReview.length || 12}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next lesson</p>
                <p className="mt-2 text-lg font-bold text-white">{nextLesson?.title || 'Daily speaking warm-up'}</p>
              </div>
              <button onClick={() => navigate('/practice')} className="w-full rounded-full bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 px-4 py-3 text-sm font-black text-slate-950">
                Open Practice Lab
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
