# Epic 0: Foundation (gebruikers, sessie, migraties)

Korte uitwerking; volledige beschrijving en acceptatiecriteria: [../epics.md#epic-0-foundation-gebruikers-sessie-migraties](../epics.md#epic-0-foundation-gebruikers-sessie-migraties).

## Samenvatting

Alles wat klaar moet zijn vóór domeinfunctionaliteit (werkwoorden, zinnen, oefeningen): backend (gebruikers, sessie, migraties) én frontend (SPA-stack, build, auth-integratie). Zie ook [../adr/adr-frontend.md](../adr/adr-frontend.md).

## Kernacceptatiecriteria

- Migraties; versioned databaseschema.
- Gebruikersmodel (identifier, wachtwoord-hash, rol); eerste beheerder aanmaken.
- Inloggen/uitloggen; geauthenticeerde requests; GET /me (gebruiker + rol).
- Frontend: Vite + React (TypeScript), TanStack Query, shadcn/ui, Tailwind, Lucide, React Router; login end-to-end.
