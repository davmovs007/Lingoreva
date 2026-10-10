import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { evaluatePlacementScore, getPlacementQuestions } from '../data/learningData';

const PlacementTest: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignedLevel, setAssignedLevel] = useState<string | null>(null);
  const navigate = useNavigate();

  const fallbackQuestions = useMemo(() => getPlacementQuestions(), []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/placement');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setQuestions(response.data);
          return;
        }
        setQuestions(fallbackQuestions);
      } catch (err) {
        console.error('Failed to fetch placement test, using local assessment fallback', err);
        setQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [fallbackQuestions]);

  const handleSelectOption = (optionKey: string) => {
    const currentQ = questions[currentIndex];
    const nextAnswers = [...answers, { questionId: currentQ.id, selectedOption: optionKey }];
    setAnswers(nextAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitTest(nextAnswers);
    }
  };

  const submitTest = async (finalAnswers: any[]) => {
    setLoading(true);
    try {
      await api.post('/placement/evaluate', finalAnswers).catch(() => undefined);
      const finalLevel = evaluatePlacementScore(finalAnswers);
      setAssignedLevel(finalLevel);

      const saved = localStorage.getItem('lingoreva-profile');
      const profile = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        'lingoreva-profile',
        JSON.stringify({
          ...profile,
          level: finalLevel,
          lastPlacementDate: new Date().toISOString(),
          lastPlacementScore: finalAnswers.length,
        }),
      );
    } catch (err) {
      console.error('Failed to evaluate test', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading placement test...</div>;

  if (assignedLevel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 text-center text-white animate-fade-in-up">
        <div className="rounded-[32px] border border-cyan-400/30 bg-cyan-500/10 p-8 shadow-xl shadow-cyan-500/10">
          <h2 className="mb-4 text-4xl font-black text-cyan-300">Test complete!</h2>
          <p className="mb-2 text-xl text-slate-200">Your recommended starting level is:</p>
          <div className="mb-8 text-6xl font-black text-white">{assignedLevel}</div>
          <p className="mb-8 max-w-md text-slate-300">Your learning path has been adjusted to match your real proficiency and the next daily tasks will become more targeted and progressively harder.</p>
          <button onClick={() => navigate('/dashboard')} className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-3 font-bold text-slate-950">
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <div className="min-h-screen bg-slate-950 p-8 text-white">No test available.</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold">Placement test</h2>
            <span className="text-sm font-semibold text-cyan-300">{currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-all" style={{ width: `${(currentIndex / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-violet-500/10">
          <div className="mb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-violet-300">{currentQ.skillCategory}</p>
            <h3 className="text-2xl font-bold md:text-3xl">{currentQ.questionText}</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: 'A', text: currentQ.optionA },
              { key: 'B', text: currentQ.optionB },
              { key: 'C', text: currentQ.optionC },
              { key: 'D', text: currentQ.optionD },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-left font-medium text-slate-100 transition hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-cyan-300">{opt.key}</span>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementTest;
