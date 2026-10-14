import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import { buildDailyLesson } from '../data/learningData';
import DailyLesson from './DailyLesson';

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const renderLesson = () => render(
  <MemoryRouter>
    <DailyLesson />
  </MemoryRouter>,
);

describe('daily lesson flow', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockRejectedValue(new Error('offline'));
    vi.mocked(api.post).mockResolvedValue({ data: {} });
    localStorage.setItem('lingoreva-profile', JSON.stringify({
      level: 'A1',
      dailyGoalMinutes: 10,
      skills: ['Grammar'],
      goals: ['Everyday communication'],
      xp: 0,
      streakDays: 0,
    }));
  });

  it('awards XP only for correct answers, persists progress, and requires every timed question', async () => {
    const user = userEvent.setup();
    const lesson = buildDailyLesson(
      { level: 'A1', dailyGoalMinutes: 10, skills: ['Grammar'], goals: ['Everyday communication'] },
      1,
    );
    const { unmount } = renderLesson();

    expect(await screen.findByText('Question 1 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: lesson.questions[0].options.find((option) => option !== lesson.questions[0].answer)! }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(await screen.findByText('Not quite — try again')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).xp).toBe(0);

    await user.click(screen.getByRole('button', { name: lesson.questions[0].answer }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(await screen.findByText('Correct answer — XP added')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).xp).toBe(20);
    await user.click(screen.getByRole('button', { name: 'Continue to next question' }));
    expect(await screen.findByText('Question 2 of 3')).toBeInTheDocument();

    unmount();
    renderLesson();
    expect(await screen.findByText('Question 2 of 3')).toBeInTheDocument();

    for (const question of lesson.questions.slice(1)) {
      await user.click(await screen.findByRole('button', { name: question.answer }));
      await user.click(screen.getByRole('button', { name: 'Check answer' }));
      await waitFor(() => expect(screen.getByText('Correct answer — XP added')).toBeInTheDocument());
      const continueName = question === lesson.questions[lesson.questions.length - 1]
        ? 'Finish lesson'
        : 'Continue to next question';
      await user.click(screen.getByRole('button', { name: continueName }));
    }

    expect(await screen.findByText(/You earned 60 XP/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).xp).toBe(60);
  });
});
