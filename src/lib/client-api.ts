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
