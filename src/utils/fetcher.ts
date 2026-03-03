export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const apiFetch = async (
  url: string,
  options: { method: string; body?: unknown },
) => {
  const res = await fetch(url, {
    method: options.method,
    ...(options.body != null && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options.body),
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res;
};
