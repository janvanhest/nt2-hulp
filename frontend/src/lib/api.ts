/**
 * API client and auth token helpers for the NT-2 frontend.
 * Talks to the Django auth API (login, logout, me) via fetch.
 */

const TOKEN_STORAGE_KEY = 'nt2_token';

/**
 * Standard error for non-OK API responses. Callers can read status and optional body (e.g. detail).
 */
export class ApiError extends Error {
  readonly status: number
  readonly body?: unknown

  constructor(status: number, body?: unknown) {
    const message =
      typeof body === 'object' && body !== null && 'detail' in body && typeof (body as { detail: unknown }).detail === 'string'
        ? (body as { detail: string }).detail
        : `HTTP ${status}`
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Current user returned by GET /api/auth/me/ and included in login response.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

/**
 * Response body from POST /api/auth/login/.
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Returns the base URL for API requests. Empty string when using the Vite proxy (dev);
 * otherwise the value of VITE_API_URL without trailing slash.
 */
export function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL;
  if (url == null || String(url).trim() === '') {
    return '';
  }
  return String(url).replace(/\/+$/, '');
}

/**
 * Returns the stored auth token, or null if none.
 */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Stores the auth token in localStorage.
 */
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * Removes the stored auth token.
 */
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export interface ApiFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * Fetches from the API with optional auth header. On 401, clears the token and throws.
 * Path should start with / (e.g. /api/auth/me/). JSON is not automatically parsed.
 */
export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const base = getApiBaseUrl();
  const url = base ? `${base}${path}` : path;
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  const res = await fetch(url, {
    ...options,
    headers,
  });
  if (res.status === 401) {
    clearStoredToken();
  }
  return res;
}
