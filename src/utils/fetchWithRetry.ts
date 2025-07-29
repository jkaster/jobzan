/**
 * Fetches a resource with retry logic, exponential backoff, and jitter.
 * Retries are attempted for HTTP status codes 202 (Accepted), 429 (Too Many Requests), and 503 (Service Unavailable).
 * The retry delay defaults to the 'Retry-After' header value if present, otherwise it uses exponential backoff.
 * A random jitter is added to the delay to prevent thundering herd problems.
 *
 * @param url The URL to fetch.
 * @param options Optional RequestInit object for the fetch request.
 * @param maxRetries The maximum number of retry attempts. Defaults to 3.
 * @returns A Promise that resolves with the Response object if the fetch is successful.
 * @throws An Error if the request fails after maxRetries or for non-retryable HTTP status codes.
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3,
): Promise<Response> {
  let retryCount = 0;
  let delay = 1000; // Initial delay in milliseconds

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      if (
        response.status === 202 ||
        response.status === 429 ||
        response.status === 503
      ) {
        retryCount++;
        if (retryCount >= maxRetries) {
          throw new Error(
            `Request failed after ${maxRetries} retries: ${response.statusText}`,
          );
        }

        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
          // Retry-After can be a date or a number of seconds
          const parsedRetryAfter = parseInt(retryAfter, 10);
          if (!isNaN(parsedRetryAfter)) {
            delay = parsedRetryAfter * 1000; // Convert seconds to milliseconds
          } else {
            // If it's a date, calculate delay until that date
            const retryDate = new Date(retryAfter);
            delay = retryDate.getTime() - Date.now();
            if (delay < 0) delay = 1000; // Ensure positive delay
          }
        } else {
          delay *= 2; // Exponential backoff
        }
        const jitter = Math.random() * 500; // Add random jitter up to 500ms
        const finalDelay = delay + jitter;

        console.warn(
          `Retrying request to ${url} in ${finalDelay / 1000} seconds (attempt ${retryCount}/${maxRetries})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, finalDelay));
      } else {
        // For other non-OK responses (e.g., 400, 401, 404), don't retry
        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error) {
      if (retryCount >= maxRetries) {
        throw error; // Re-throw if max retries reached or it's a non-retryable error
      }
      retryCount++;
      delay *= 2; // Exponential backoff for network errors
      const jitter = Math.random() * 500; // Add random jitter up to 500ms
      const finalDelay = delay + jitter;
      console.warn(
        `Network error, retrying request to ${url} in ${finalDelay / 1000} seconds (attempt ${retryCount}/${maxRetries})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, finalDelay));
    }
  }
  throw new Error('Max retries reached without successful response.');
}
