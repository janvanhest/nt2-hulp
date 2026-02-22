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
 * Extracts per-field error messages from a 400 API response body (e.g. DRF validation errors).
 * Returns the first message per field key.
 */
export function getFieldErrors(error: ApiError): Record<string, string> {
  if (error.status !== 400 || error.body == null || typeof error.body !== 'object') {
    return {}
  }
  const body = error.body as Record<string, unknown>
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(body)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      out[key] = value[0]
    }
  }
  return out
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

/** Beheer thema's API base path. */
export const THEMAS_API_PATH = '/api/beheer/themas';

/** Thema from the API. */
export interface Theme {
  id: number;
  naam: string;
}

/** Beheer invulzinnen API base path. */
export const FILL_IN_SENTENCES_API_PATH = '/api/beheer/invulzinnen';

/** Werkwoordsvorm van het antwoord in een invulzin (sluit aan op VerbForm + infinitief). */
export type AnswerFormKey =
  | 'tt_ik'
  | 'tt_jij'
  | 'tt_hij'
  | 'vt_ev'
  | 'vt_mv'
  | 'vd'
  | 'vd_hulpwerkwoord'
  | 'infinitive'

/** Verb as returned in FillInSentence (nested). */
export interface FillInSentenceVerb {
  id: number;
  infinitive: string;
}

/** Invulzin (fill-in sentence) from the API. */
export interface FillInSentence {
  id: number;
  verb: FillInSentenceVerb;
  sentence_template: string;
  answer: string;
  answer_form_key?: AnswerFormKey | '';
  themas?: Theme[];
  created_at: string;
  updated_at: string;
}

/** Payload for creating or updating an invulzin. */
export interface FillInSentencePayload {
  verb: number;
  sentence_template: string;
  answer: string;
  answer_form_key?: AnswerFormKey | '';
  thema_ids?: number[];
}

/** Beheer oefeningen API base path (generate exercise). */
export const EXERCISES_API_PATH = '/api/beheer/oefeningen';

/** Oefeningstype voor genereren. */
export type ExerciseType = 'vervoeging' | 'invulzin';

/** Payload voor het aanmaken van een oefening. */
export interface CreateExercisePayload {
  exercise_type: ExerciseType;
  num_items: number;
  /** Optioneel: alleen uit deze werkwoorden trekken; ontbreekt of leeg = alle. */
  verb_ids?: number[];
}

/** Conjugation item in exercise response. */
export interface ConjugationItemResponse {
  id: number;
  order: number;
  verb: number;
}

/** Fill-in sentence item in exercise response. */
export interface FillInSentenceItemResponse {
  id: number;
  order: number;
  fill_in_sentence: number;
}

/** Oefening zoals teruggegeven na aanmaken of in lijst. */
export interface Exercise {
  id: number;
  exercise_type: ExerciseType;
  created_at: string;
  conjugation_items: ConjugationItemResponse[];
  fill_in_sentence_items: FillInSentenceItemResponse[];
}

/** Verb prompt for do-view (no forms/answers). */
export interface VerbPrompt {
  id: number;
  infinitive: string;
}

/** Fill-in sentence prompt for do-view (no answer). */
export interface FillInSentencePrompt {
  id: number;
  sentence_template: string;
  answer_form_key: string;
}

/** Conjugation item for do-view: verb with infinitive only. */
export interface ConjugationItemDoResponse {
  id: number;
  order: number;
  verb: VerbPrompt;
}

/** Fill-in sentence item for do-view: sentence template only. */
export interface FillInSentenceItemDoResponse {
  id: number;
  order: number;
  fill_in_sentence: FillInSentencePrompt;
}

/** Oefening-detail voor doen (prompts, geen antwoorden). */
export interface ExerciseDo {
  id: number;
  exercise_type: ExerciseType;
  created_at: string;
  conjugation_items: ConjugationItemDoResponse[];
  fill_in_sentence_items: FillInSentenceItemDoResponse[];
}

/** One conjugation item in nakijkmodel (correct forms). */
export interface NakijkConjugationItem {
  id: number;
  order: number;
  verb_id: number;
  infinitive: string;
  forms: VerbForm;
}

/** One fill-in item in nakijkmodel (correct answer). */
export interface NakijkFillInSentenceItem {
  id: number;
  order: number;
  fill_in_sentence_id: number;
  sentence_template: string;
  answer: string;
}

/** Nakijkmodel response (correcte antwoorden). */
export interface NakijkmodelResponse {
  exercise_id: number;
  exercise_type: ExerciseType;
  conjugation_items: NakijkConjugationItem[];
  fill_in_sentence_items: NakijkFillInSentenceItem[];
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
