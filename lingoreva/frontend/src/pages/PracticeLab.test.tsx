import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { generatePracticeLab } from '../data/learningData';
import PracticeLab from './PracticeLab';

describe('Practice Lab', () => {
  it('awards XP once for a correct answer and none for an incorrect answer', async () => {
    const user = userEvent.setup();
    const profile = {
      level: 'A1',
      dailyGoalMinutes: 10,
      skills: ['Vocabulary'],
      goals: ['Travel English'],
      xp: 0,
    };
    localStorage.setItem('lingoreva-profile', JSON.stringify(profile));
    const task = generatePracticeLab(profile.level, profile.dailyGoalMinutes, profile.skills, profile.goals)[0];

    render(
      <MemoryRouter>
        <PracticeLab />
      </MemoryRouter>,
    );

    expect((await screen.findAllByRole('heading', { name: task.title })).length).toBeGreaterThanOrEqual(2);
    await user.click(screen.getByRole('button', { name: task.options.find((option) => option !== task.answer)! }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(await screen.findByText('Review')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).xp).toBe(0);

    await user.click(screen.getByRole('button', { name: task.answer }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).xp).toBe(task.xp));

    await user.click(screen.getByRole('button', { name: task.answer }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(JSON.parse(localStorage.getItem('lingoreva-profile')!).xp).toBe(task.xp);
  });
});
