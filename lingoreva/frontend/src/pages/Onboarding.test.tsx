import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import Onboarding from './Onboarding';

vi.mock('../services/api', () => ({
  default: { put: vi.fn() },
}));

describe('onboarding flow', () => {
  it('saves the selected study settings and proceeds to placement testing', async () => {
    vi.mocked(api.put).mockResolvedValue({ data: {} });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/placement" element={<h1>Placement test screen</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: /10 minutes/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: /1 month/ }));
    await user.click(screen.getByRole('button', { name: 'Start my placement test' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Placement test screen' })).toBeInTheDocument());
    expect(api.put).toHaveBeenCalledWith('/profile', expect.objectContaining({
      dailyGoalMinutes: 10,
      courseDurationMonths: 1,
    }));
    expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).dailyGoalMinutes).toBe(10);
  });
});
