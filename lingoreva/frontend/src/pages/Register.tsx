import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least 1 number', met: /\d/.test(password) },
    { label: 'At least 1 special character', met: /[^A-Za-z0-9\s]/.test(password) },
  ];
  const passwordIsValid = passwordRequirements.every((requirement) => requirement.met);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!passwordIsValid) {
      setError('Please meet all password requirements before creating your account.');
      return;
    }

    try {
      const response = await api.post('/auth/register', { email, password });
      login(response.data.token);
      navigate('/onboarding');
    } catch (err: any) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.error
        || err?.response?.data
        || err?.message
        || 'Unknown error';
      setError(`Registration failed: ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Why learners choose Lingoreva</p>
            <h1 className="mt-4 text-4xl font-black md:text-5xl">A clear path from beginner to confident speaker.</h1>
            <ul className="mt-6 space-y-4 text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">Adaptive lessons based on your level and goals</li>
              <li className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">Daily time-aware tasks from quick to deep practice</li>
              <li className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">Vocabulary, grammar, speaking, reading, and review in one place</li>
            </ul>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl md:p-8">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Create account</p>
              <h2 className="mt-3 text-3xl font-black">Get started</h2>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 break-all">{error}</div>}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                  placeholder="Create a strong password"
                  aria-describedby="password-requirements"
                  required
                />
                <ul id="password-requirements" className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
                  {passwordRequirements.map((requirement) => (
                    <li key={requirement.label} className={requirement.met ? 'text-emerald-300' : 'text-slate-400'}>
                      <span aria-hidden="true">{requirement.met ? '✓' : '○'}</span> {requirement.label}
                    </li>
                  ))}
                </ul>
              </div>

              <button type="submit" disabled={!passwordIsValid} className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40">
                Create account
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-300">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')} className="font-semibold text-emerald-300 hover:text-emerald-200">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
