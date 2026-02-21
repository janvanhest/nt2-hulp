/**
 * Centralized app route paths. Single source of truth for navigation and route config.
 */
export const ROUTES = {
  login: '/login',
  home: '/',
  beheer: '/beheer',
  beheerWerkwoorden: '/beheer/werkwoorden',
  beheerOverzichtPerWerkwoord: '/beheer/overzicht-per-werkwoord',
  /** Overzicht-per-werkwoord page with optional view: 'zinnen' | 'vormdekking'. */
  beheerOverzichtPerWerkwoordWithView: (view?: 'zinnen' | 'vormdekking') =>
    view ? `${ROUTES.beheerOverzichtPerWerkwoord}?view=${view}` : ROUTES.beheerOverzichtPerWerkwoord,
  beheerOefeningGenereren: '/beheer/oefening-genereren',
  oefenen: '/oefenen',
  oefenenDo: (id: number) => `/oefenen/${id}`,
  nakijk: '/nakijk',
} as const

export type AppPath =
  | (typeof ROUTES)[keyof Omit<typeof ROUTES, 'oefenenDo' | 'beheerOverzichtPerWerkwoordWithView'>]
  | ReturnType<typeof ROUTES.oefenenDo>
  | ReturnType<typeof ROUTES.beheerOverzichtPerWerkwoordWithView>
