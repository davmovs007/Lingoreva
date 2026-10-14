import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur-xl">
              <img src="/favicon.png?v=2" alt="" aria-hidden="true" className="h-8 w-8 rounded-xl object-cover" />
              Lingoreva — your daily English rhythm
            </div>

            <div>
              <h1 className="max-w-lg text-4xl font-black tracking-tight md:text-6xl">Build confidence with structured daily practice.</h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300">
                Personalised courses, adaptive lessons, and quick daily tasks designed around your goals and time budget.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-2xl font-black text-cyan-300">10–30m</p>
                <p className="mt-2 text-sm text-slate-300">Flexible daily goals</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-2xl font-black text-violet-300">30/60/90</p>
                <p className="mt-2 text-sm text-slate-300">Course tracks</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-2xl font-black text-emerald-300">Daily</p>
                <p className="mt-2 text-sm text-slate-300">Progress and streaks</p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl md:p-8">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Welcome back</p>
              <h2 className="mt-3 text-3xl font-black">Sign in</h2>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="w-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-300">
              Don’t have an account?{' '}
              <button type="button" onClick={() => navigate('/register')} className="font-semibold text-cyan-300 hover:text-cyan-200">
                Create one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
