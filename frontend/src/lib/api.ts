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
 * Role values returned by the API. Used for route guards and navigation.
 */
export type UserRole = 'gebruiker' | 'beheerder';

/** Role value for beheerder; single source of truth for guards and nav. */
export const ROLE_BEHEERDER: UserRole = 'beheerder';

/** Display label for each role (for header/UI). */
export const ROLE_LABELS: Record<UserRole, string> = {
  gebruiker: 'Gebruiker',
  beheerder: 'Beheerder',
}

/**
 * Type-safe check for beheerder (admin) role. Use in AdminLayout and AppLayout nav.
 */
export function isAdmin(user: User | null | undefined): user is User & { role: 'beheerder' } {
  return user?.role === ROLE_BEHEERDER;
}

/**
 * Current user returned by GET /api/auth/me/ and included in login response.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

/**
 * Response body from POST /api/auth/login/.
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/** Beheer werkwoorden API base path. */
export const VERBS_API_PATH = '/api/beheer/werkwoorden';

/** Workword form fields (conjugation) from the API. */
export interface VerbForm {
  tt_ik: string;
  tt_jij: string;
  tt_hij: string;
  vt_ev: string;
  vt_mv: string;
  vd: string;
  vd_hulpwerkwoord: '' | 'hebben' | 'zijn';
}

/** Workword returned by the API (list/detail). */
export interface Verb {
  id: number;
  infinitive: string;
  forms: VerbForm;
  created_at: string;
  updated_at: string;
}

/** Payload for creating or updating a verb. */
export interface VerbPayload {
  infinitive: string;
  forms?: VerbForm;
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

/** Called on 401 so the app can clear auth state (e.g. AuthContext). Set from inside AuthProvider. */
let unauthorizedHandler: (() => void) | null = null;

/**
 * Registers a handler to run on every 401 from apiFetch (e.g. clear token in AuthContext).
 * Pass null to unregister. Should be set once inside AuthProvider and cleared on unmount.
 */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export interface ApiFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * Fetches from the API with optional auth header. On 401, clears the token and calls the
 * registered unauthorized handler (so AuthContext updates and app redirects to login).
 * On 403, leaves token intact; callers should check res.status and show body.detail to the user.
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
    unauthorizedHandler?.();
  }
  return res;
}
