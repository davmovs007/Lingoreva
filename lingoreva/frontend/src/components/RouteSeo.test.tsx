import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import RouteSeo from './RouteSeo';

describe('route SEO metadata', () => {
  it('marks the public homepage as indexable and sets its canonical URL', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RouteSeo />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Learn English with a Personal Study Plan | Lingoreva');
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow, max-image-preview:large');
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://lingoreva.onrender.com/');
    });
  });

  it('keeps account pages out of search results', async () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RouteSeo />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Create a Free English Study Plan | Lingoreva');
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow');
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://lingoreva.onrender.com/register');
    });
  });
});
