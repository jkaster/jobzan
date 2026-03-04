import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAuth } from './useAuth';
import { AllTheProviders } from '../tests/setup';

describe('useAuth', () => {
  it('throws error when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    );
  });

  it('returns auth context when within AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AllTheProviders,
    });
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('token');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current.isAuthenticated).toBe(false);
  });
});
