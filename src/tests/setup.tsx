import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { AuthProvider } from '../AuthProvider';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { toHaveNoViolations } from 'jest-axe';

// extends Vitest's expect method with methods from testing-library
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
expect.extend(toHaveNoViolations);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Global wrapper for tests that need AuthProvider and BrowserRouter
// This can be used in render options: render(ui, { wrapper: AllTheProviders })
export const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);
