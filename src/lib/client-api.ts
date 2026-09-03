/**
 * Client-side API helper.
 * Automatically attaches the student's secret token header to every
 * request so all data is scoped to the logged-in student.
 */

export const TOKEN_STORAGE_KEY = 'ba-student-token';

export function getStoredToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/** fetch with the auth header merged in. */
export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('x-student-token', token);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  return fetch(url, { ...init, headers });
}

/**
 * Safely read a JSON API response. When the server returns non-JSON
 * (crash page, proxy error, timeout body), the raw JSON.parse SyntaxError
 * would bubble up as "unexpected character at line 1 column 1" — this
 * converts it into an actionable message instead.
 */
export async function readJson<T = Record<string, unknown>>(res: Response): Promise<T> {
  const text = await res.text().catch(() => '');
  try {
    return JSON.parse(text) as T;
  } catch {
    const hint = text.trim()
      ? text.replace(/<[^>]+>/g, ' ').trim().slice(0, 140)
      : `empty response (HTTP ${res.status})`;
    throw new Error(`The server sent an invalid response — ${hint}`);
  }
}
