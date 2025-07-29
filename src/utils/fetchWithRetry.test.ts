import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
} from 'vitest';
import { fetchWithRetry } from './fetchWithRetry';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our setup
// (i.e. for testing one-off scenarios).
afterEach(() => server.resetHandlers());

// Clean up once the tests are done.
afterAll(() => server.close());

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should return a successful response on the first try', async () => {
    const response = await fetchWithRetry('https://example.com/success');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Success');
  });

  it('should retry on 503 and eventually succeed', async () => {
    let attempt = 0;
    server.use(
      http.get('https://example.com/retryable', () => {
        attempt++;
        if (attempt < 3) {
          return HttpResponse.text('Service Unavailable', {
            status: 503,
            headers: { 'Retry-After': '1' },
          });
        } else {
          return HttpResponse.text('Success after retries', { status: 200 });
        }
      }),
    );

    const promise = fetchWithRetry('https://example.com/retryable');

    await vi.advanceTimersToNextTimerAsync(); // Advance for first retry
    await vi.advanceTimersToNextTimerAsync(); // Advance for second retry

    const response = await promise;

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Success after retries');
    expect(attempt).toBe(3);
  });

  it('should fail after max retries', async () => {
    server.use(
      http.get('https://example.com/fail-always', () => {
        return HttpResponse.text('Service Unavailable', { status: 503 });
      }),
    );

    const promise = fetchWithRetry('https://example.com/fail-always', {}, 3);

    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow(
      'Request failed after 3 retries: 503 Service Unavailable',
    );
  });

  it('should not retry on a 404 error', async () => {
    server.use(
      http.get('https://example.com/not-found', () => {
        return HttpResponse.text('Not Found', { status: 404 });
      }),
    );

    const promise = fetchWithRetry('https://example.com/not-found');

    await expect(promise).rejects.toThrow(
      'Request failed with status 404: Not Found',
    );
  });

  it.skip('should retry on network error and eventually fail', async () => {
    vi.spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const promise = fetchWithRetry('https://example.com/network-error', {}, 3);

    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow('Failed to fetch');
  });
});
