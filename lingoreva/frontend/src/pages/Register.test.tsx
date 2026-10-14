import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import api from '../services/api';
import Register from './Register';

vi.mock('../services/api', () => ({
  default: { post: vi.fn() },
}));

const renderRegister = () => render(
  <MemoryRouter initialEntries={['/register']}>
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<h1>Onboarding screen</h1>} />
      </Routes>
    </AuthProvider>
  </MemoryRouter>,
);

describe('registration flow', () => {
  beforeEach(() => {
    vi.mocked(api.post).mockReset();
  });

  it('shows password rules and prevents submit until all rules pass', async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText('Email'), 'learner@example.com');
    await user.type(screen.getByLabelText('Password'), 'weak');
    expect(screen.getByRole('button', { name: 'Create account' })).toBeDisabled();

    await user.clear(screen.getByLabelText('Password'));
    await user.type(screen.getByLabelText('Password'), 'ValidPass1!');
    expect(screen.getByRole('button', { name: 'Create account' })).toBeEnabled();
    expect(screen.getByText('At least 8 characters')).toHaveClass('text-emerald-300');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('registers valid credentials and continues to onboarding', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: { token: 'test-token' } });
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText('Email'), 'learner@example.com');
    await user.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Onboarding screen' })).toBeInTheDocument());
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'learner@example.com',
      password: 'ValidPass1!',
    });
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('shows server errors and does not navigate on failed registration', async () => {
    vi.mocked(api.post).mockRejectedValue({ response: { data: { message: 'Email already in use' } } });
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText('Email'), 'existing@example.com');
    await user.type(screen.getByLabelText('Password'), 'ValidPass1!');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Registration failed: Email already in use')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Onboarding screen' })).not.toBeInTheDocument();
  });
});
