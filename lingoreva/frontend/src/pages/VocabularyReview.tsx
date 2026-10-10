import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const VocabularyReview: React.FC = () => {
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await api.get('/vocabulary/review');
        setWords(response.data);
      } catch (err) {
        console.error('Failed to fetch words for review', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWords();
  }, []);

  const handleReview = async (correct: boolean, difficulty: number) => {
    try {
      await api.post('/vocabulary/review', {
        wordId: words[currentIndex].word.id,
        correct,
        difficultyScore: difficulty,
      });

      setShowAnswer(false);
      if (currentIndex + 1 < words.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 p-8 text-white">Loading review...</div>;

  if (words.length === 0 || currentIndex >= words.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 text-white">
        <h2 className="text-3xl font-black mb-3">All caught up!</h2>
        <p className="text-slate-300 mb-6">You have no more words to review right now.</p>
        <button onClick={() => navigate('/dashboard')} className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 font-bold text-slate-950">
          Back to dashboard
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex].word;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white md:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-slate-300">Word {currentIndex + 1} of {words.length}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${(currentIndex / words.length) * 100}%` }} />
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-500/10">
          <div className="text-center">
            <h1 className="text-5xl font-black text-white">{currentWord.word}</h1>
            <p className="mt-3 text-sm italic text-slate-300">{currentWord.partOfSpeech} • {currentWord.cefrLevel}</p>

            {showAnswer ? (
              <div className="mt-8 animate-fade-in-up">
                <p className="text-3xl font-bold text-cyan-300">{currentWord.translation}</p>
                {currentWord.exampleEn && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-left">
                    <p className="text-base text-slate-200">“{currentWord.exampleEn}”</p>
                    <p className="mt-2 text-sm text-slate-400">“{currentWord.exampleTranslation}”</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-12 text-slate-400">Think of the translation, then reveal the answer.</div>
            )}
          </div>

          <div className="mt-8">
            {!showAnswer ? (
              <button onClick={() => setShowAnswer(true)} className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 px-4 py-4 text-lg font-bold text-slate-950">
                Reveal answer
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button onClick={() => handleReview(false, 3)} className="rounded-2xl bg-rose-500/15 px-3 py-3 text-sm font-bold text-rose-200">Again</button>
                <button onClick={() => handleReview(true, 3)} className="rounded-2xl bg-amber-500/15 px-3 py-3 text-sm font-bold text-amber-200">Hard</button>
                <button onClick={() => handleReview(true, 1)} className="rounded-2xl bg-emerald-500/15 px-3 py-3 text-sm font-bold text-emerald-200">Good</button>
                <button onClick={() => handleReview(true, 0)} className="rounded-2xl bg-cyan-500/15 px-3 py-3 text-sm font-bold text-cyan-200">Easy</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyReview;
