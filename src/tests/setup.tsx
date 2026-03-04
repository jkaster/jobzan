import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { AuthProvider } from '../AuthProvider';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { toHaveNoViolations } from 'jest-axe';

// extends Vitest's expect method with methods from testing-library
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
expect.extend(toHaveNoViolations);

// In-memory localStorage mock for jsdom
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Global wrapper for tests that need AuthProvider and BrowserRouter
// This can be used in render options: render(ui, { wrapper: AllTheProviders })
export const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  </SWRConfig>
);
