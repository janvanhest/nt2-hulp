/**
 * Centralized app route paths. Single source of truth for navigation and route config.
 */
export const ROUTES = {
  login: '/login',
  home: '/',
  beheer: '/beheer',
  beheerWerkwoorden: '/beheer/werkwoorden',
  beheerZinnen: '/beheer/zinnen',
  beheerOefeningGenereren: '/beheer/oefening-genereren',
  oefenen: '/oefenen',
  oefenenDo: (id: number) => `/oefenen/${id}`,
  nakijk: '/nakijk',
} as const

export type AppPath =
  | (typeof ROUTES)[keyof Omit<typeof ROUTES, 'oefenenDo'>]
  | ReturnType<typeof ROUTES.oefenenDo>
