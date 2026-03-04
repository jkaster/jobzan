import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'jest-axe';
import Login from './Login';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        welcome_to_jobzan: 'Welcome to Jobzan',
        sign_in_to_continue: 'Sign in to continue',
        sign_in_with_google: 'Sign in with Google',
        sign_in_with_github: 'Sign in with GitHub',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Login', () => {
  it('renders sign-in buttons for Google and GitHub', () => {
    render(<Login />);
    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in with github/i }),
    ).toBeInTheDocument();
  });

  it('renders welcome text', () => {
    render(<Login />);
    expect(screen.getByText('Welcome to Jobzan')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Login />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
