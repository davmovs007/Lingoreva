import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://lingoreva.onrender.com').replace(/\/+$/, '');

const pages: Record<string, { title: string; description: string; indexable: boolean }> = {
  '/': {
    title: 'Learn English with a Personal Study Plan | Lingoreva',
    description: 'Learn English with a personalized plan, CEFR level test, short daily lessons, practical exercises, and vocabulary review tailored to your goals.',
    indexable: true,
  },
  '/login': { title: 'Sign in | Lingoreva', description: 'Sign in to continue your English learning plan on Lingoreva.', indexable: false },
  '/register': { title: 'Create a Free English Study Plan | Lingoreva', description: 'Start your personalized English learning path with Lingoreva.', indexable: false },
  '/onboarding': { title: 'Set Your English Learning Goals | Lingoreva', description: 'Personalize your English study plan, goals, skills, and daily study time.', indexable: false },
  '/dashboard': { title: 'Your English Learning Dashboard | Lingoreva', description: 'See your English study plan, learning streak, and progress.', indexable: false },
  '/review': { title: 'English Vocabulary Review | Lingoreva', description: 'Practice English vocabulary with translations and example sentences.', indexable: false },
  '/lesson': { title: 'Daily English Lesson | Lingoreva', description: 'Practice English with a focused daily lesson.', indexable: false },
  '/practice': { title: 'English Practice Exercises | Lingoreva', description: 'Build practical English skills with interactive exercises.', indexable: false },
  '/placement': { title: 'English Level Test | Lingoreva', description: 'Find your English starting level with a CEFR-aligned placement test.', indexable: false },
};

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
};

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pages[pathname] ?? {
      title: 'Page not found | Lingoreva',
      description: 'The requested Lingoreva page could not be found.',
      indexable: false,
    };
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '/' : pathname}`;

    document.title = page.title;
    setMeta('name', 'description', page.description);
    setMeta('name', 'robots', page.indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pathname]);

  return null;
};

export default RouteSeo;
