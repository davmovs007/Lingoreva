import { Link } from 'react-router-dom';

const Home = () => (
  <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
    <div className="mx-auto max-w-6xl">
      <header className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Lingoreva home">
          <img src="/favicon.png" alt="" className="h-11 w-11 rounded-2xl" width="128" height="128" />
          <span className="text-xl font-black tracking-tight">Lingoreva</span>
        </Link>
        <Link to="/register" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-white/10">
          Start learning
        </Link>
      </header>

      <section className="grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">A clearer path to English</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Learn English with a plan that fits your life.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Build confidence with a personalized English learning plan, short daily lessons,
            practical exercises, and vocabulary review adapted to your level and goals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
              Create your free learning plan
            </Link>
            <a href="#how-it-works" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5">
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">Start with a level check. Study at your own pace.</p>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/15 p-3 shadow-2xl shadow-cyan-950/30">
          <img
            src="/lingoreva-banner.jpg"
            alt="Lingoreva English learning"
            className="h-full min-h-56 w-full rounded-[24px] object-cover"
            width="1200"
            height="630"
          />
        </div>
      </section>

      <section aria-labelledby="features-title" className="py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">Everything in one learning path</p>
          <h2 id="features-title" className="mt-3 text-3xl font-black md:text-4xl">Make steady progress in English</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Find your level', 'Take a short English placement test and get a starting level from Pre-A1 to C2.'],
            ['Follow a personal plan', 'Choose your learning goals, focus skills, course length, and daily study time.'],
            ['Practice every day', 'Build English grammar, reading, writing, listening, and speaking skills with interactive tasks.'],
            ['Remember new words', 'Review useful vocabulary with examples and spaced practice designed to strengthen recall.'],
          ].map(([title, description]) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="steps-title" className="my-12 rounded-[32px] border border-cyan-400/15 bg-cyan-500/5 p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Simple to start</p>
        <h2 id="steps-title" className="mt-3 text-3xl font-black">Your English study plan in three steps</h2>
        <ol className="mt-7 grid gap-6 md:grid-cols-3">
          <li><span className="text-sm font-bold text-cyan-300">01</span><h3 className="mt-2 text-xl font-bold">Choose your goals</h3><p className="mt-2 leading-6 text-slate-300">Tell Lingoreva what you want to achieve and how much time you can study.</p></li>
          <li><span className="text-sm font-bold text-cyan-300">02</span><h3 className="mt-2 text-xl font-bold">Check your level</h3><p className="mt-2 leading-6 text-slate-300">Answer placement questions to find the right English learning starting point.</p></li>
          <li><span className="text-sm font-bold text-cyan-300">03</span><h3 className="mt-2 text-xl font-bold">Practice and progress</h3><p className="mt-2 leading-6 text-slate-300">Complete focused lessons, build a study habit, and revisit vocabulary regularly.</p></li>
        </ol>
      </section>

      <section aria-labelledby="faq-title" className="py-12">
        <h2 id="faq-title" className="text-3xl font-black">Frequently asked questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-bold">What English levels does Lingoreva support?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">The learning path covers CEFR levels from Pre-A1 beginner through C2 advanced.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-bold">Can I study in short daily sessions?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Yes. Set a daily target of 10, 20, or 30 minutes and build a routine around it.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-bold">What can I practice?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Choose vocabulary, grammar, reading, listening, writing, speaking, and pronunciation skills.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-bold">How does vocabulary review work?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">Review English words with translations and example sentences, then rate how well you remembered each one.</p>
          </article>
        </div>
      </section>

      <section className="my-10 rounded-[32px] bg-gradient-to-r from-cyan-500/15 to-violet-500/15 p-8 text-center md:p-12">
        <h2 className="text-3xl font-black">Start building your English habit today</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">Create a personal study plan and take your first step toward confident English.</p>
        <Link to="/register" className="mt-6 inline-flex rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-200">
          Start learning for free
        </Link>
      </section>

      <footer className="border-t border-white/10 py-6 text-sm text-slate-400">
        <p>Lingoreva — personalized English learning with daily lessons and vocabulary practice.</p>
      </footer>
    </div>
  </main>
);

export default Home;
