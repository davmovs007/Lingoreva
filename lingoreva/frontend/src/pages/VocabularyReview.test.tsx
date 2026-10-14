import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import VocabularyReview from './VocabularyReview';

vi.mock('../services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

describe('vocabulary review flow', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue({
      data: [
        { word: { id: 1, word: 'practice', translation: 'practicar', partOfSpeech: 'verb', cefrLevel: 'A1' } },
        { word: { id: 2, word: 'improve', translation: 'mejorar', partOfSpeech: 'verb', cefrLevel: 'A2' } },
      ],
    });
    vi.mocked(api.post).mockResolvedValue({ data: {} });
  });

  it('reveals translations and persists each review before advancing', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VocabularyReview />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'practice' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reveal answer' }));
    expect(screen.getByText('practicar')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Good' }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/vocabulary/review', {
      wordId: 1,
      correct: true,
      difficultyScore: 1,
    }));
    expect(await screen.findByRole('heading', { name: 'improve' })).toBeInTheDocument();
  });
});
