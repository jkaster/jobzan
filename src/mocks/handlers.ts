import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://example.com/success', () => {
    return HttpResponse.text('Success', { status: 200 });
  }),

  http.get('https://example.com/retryable', ({ request }) => {
    const url = new URL(request.url);
    const attempt = Number(url.searchParams.get('attempt')) || 1;

    if (attempt < 3) {
      return HttpResponse.text('Service Unavailable', { status: 503, headers: { 'Retry-After': '1' } });
    } else {
      return HttpResponse.text('Success after retries', { status: 200 });
    }
  }),

  http.get('https://example.com/fail-always', () => {
    return HttpResponse.text('Service Unavailable', { status: 503 });
  }),

  http.get('https://example.com/not-found', () => {
    return HttpResponse.text('Not Found', { status: 404 });
  }),

  http.get('https://example.com/network-error', () => {
    return HttpResponse.error();
  }),
];
