import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import { getPlacementQuestions } from '../data/learningData';
import PlacementTest from './PlacementTest';

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

describe('placement assessment', () => {
  beforeEach(() => {
    const questionsWithoutAnswers = getPlacementQuestions().map(({ correctOption: _correctOption, ...question }) => question);
    vi.mocked(api.get).mockResolvedValue({ data: questionsWithoutAnswers });
    vi.mocked(api.post).mockResolvedValue({ data: { assignedLevel: 'B1' } });
    localStorage.setItem('lingoreva-profile', JSON.stringify({ dailyGoalMinutes: 20 }));
  });

  it('submits every response to the server and stores the assessed level', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PlacementTest />
      </MemoryRouter>,
    );

    for (const question of getPlacementQuestions()) {
      await screen.findByRole('heading', { name: question.questionText });
      const correctOptionIndex = question.correctOption.charCodeAt(0) - 'A'.charCodeAt(0);
      await user.click(screen.getAllByRole('button')[correctOptionIndex]);
    }

    await waitFor(() => expect(screen.getByText('B1')).toBeInTheDocument());
    expect(api.post).toHaveBeenCalledWith('/placement/evaluate', expect.arrayContaining([
      expect.objectContaining({ questionId: 'placement-1', selectedOption: 'A' }),
    ]));
    expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).level).toBe('B1');
  });
});
