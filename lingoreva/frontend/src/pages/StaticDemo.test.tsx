import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';
import { getPlacementQuestions } from '../data/learningData';
import Login from './Login';
import PlacementTest from './PlacementTest';

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const staticDemoEnabled = import.meta.env.VITE_DEMO_MODE === 'true';

describe('static guest site', () => {
  it.skipIf(!staticDemoEnabled)('starts a guest session without calling the backend', async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start learning' }));

    await waitFor(() => expect(localStorage.getItem('token')).toBe('local-device-session'));
    expect(api.post).not.toHaveBeenCalled();
  });

  it.skipIf(!staticDemoEnabled)('loads and grades the placement test locally', async () => {
    render(
      <MemoryRouter>
        <PlacementTest />
      </MemoryRouter>,
    );

    for (const question of getPlacementQuestions()) {
      await screen.findByRole('heading', { name: question.questionText });
      const correctOptionIndex = question.correctOption.charCodeAt(0) - 'A'.charCodeAt(0);
      fireEvent.click(screen.getAllByRole('button')[correctOptionIndex]);
    }

    expect(await screen.findByText('C2')).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
    expect(api.post).not.toHaveBeenCalled();
  });
});
