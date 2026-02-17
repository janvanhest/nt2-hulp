/**
 * Centralized app route paths. Single source of truth for navigation and route config.
 */
export const ROUTES = {
  login: '/login',
  home: '/',
} as const

export type AppPath = (typeof ROUTES)[keyof typeof ROUTES]
