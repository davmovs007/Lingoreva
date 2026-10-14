import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';
import Dashboard from './Dashboard';

vi.mock('../services/api', () => ({
  default: { get: vi.fn() },
}));

describe('dashboard', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockImplementation(async (path) => {
      if (path === '/profile') return { data: { currentLevel: 'A1', dailyGoalMinutes: 10 } };
      if (path === '/lessons/next') return { data: { title: 'First lesson' } };
      return { data: [] };
    });
    localStorage.setItem('token', 'test-token');
  });

  it('shows learner progress and clears the session on sign out', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<p>Login page</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(await screen.findByText('First lesson')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(localStorage.getItem('token')).toBeNull());
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
