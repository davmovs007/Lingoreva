import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Home from './Home';

describe('home page', () => {
  it('presents the public English learning landing page and clear next steps', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /learn english with a plan/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /frequently asked questions/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /start learning|create your free learning plan/i }).length).toBeGreaterThan(0);
  });
});
