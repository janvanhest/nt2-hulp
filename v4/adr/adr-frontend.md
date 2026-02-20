Oorspronkelijk: archive/v3/adr-002-frontend-stack.md

# ADR 002: Frontend stack (SPA)

## Status
Besluit

## Context
De v3 web-app is een React SPA die tegen een bestaande API (Django, zie ADR-001) praat. De doelgroep omvat o.a. een 12-jarige; de UI moet laagdrempelig en aantrekkelijk zijn, zonder zwaar framework. Het team wil snel kunnen bouwen en componenten eenvoudig kunnen aanpassen (kleuren, spacing, speelse elementen).

## Besluit
We gebruiken een **lichte SPA-stack** (geen Next.js):

- **Build & framework:** Vite + React (TypeScript)
- **Server state / API:** TanStack Query (`@tanstack/react-query`)
- **UI:** shadcn/ui + Tailwind CSS + Lucide icons
- **Routing:** React Router

Optioneel later: Framer Motion (animaties), sonner (toast), recharts (voortgang).

## Rationale

### Geen Next.js
- Next.js is overkill voor een SPA die alleen een externe API aanroept; geen behoefte aan SSR of file-based routing.
- Vite levert snellere dev-builds en een eenvoudiger mental model.

### Vite + React (TypeScript)
- Officiële Vite-templates ondersteunen React + TypeScript (`npm create vite@latest` met template `react-ts`).
- Snelle HMR en geoptimaliseerde productie-builds.

### TanStack Query
- Library, geen framework: incrementeel in te zetten voor de endpoints waar caching en loading states nodig zijn.
- Geschikt voor GET /me, werkwoorden, oefeningen, nakijkmodel; mutaties (login, CRUD) met `useMutation` en `queryClient.invalidateQueries`.
- Package: `@tanstack/react-query`; app wordt gewrapped met `QueryClientProvider`.

### shadcn/ui + Tailwind + Lucide
- Componenten leven in de repo; kleine tweaks (grotere knoppen, rondere hoeken, kindvriendelijk kleurpalet) zijn direct mogelijk.
- shadcn ondersteunt Vite officieel (path alias `@`, Tailwind geïntegreerd).
- Geen zwaar "zakelijk" UI-framework; geschikt voor speelse elementen (progress, badges, cards).

## Consequenties
- Frontend draait als aparte app (bijv. `frontend/` of `web/`); praat via HTTP naar de API.
- Epic 0 omvat naast backend-foundation ook frontend-foundation: Vite-project, TanStack Query geconfigureerd, shadcn/Tailwind/Lucide beschikbaar, routing en login-flow end-to-end.
- Requirements (dev) kunnen worden aangescherpt met deze stack (zie `v3/requirements-dev.md`).

## Referenties
- [Vite – create vite](https://vite.dev/guide/) (o.a. React + TypeScript template)
- [TanStack Query – React](https://tanstack.com/query/latest) (`QueryClientProvider`, `useQuery`, `useMutation`)
- [shadcn/ui – Vite](https://ui.shadcn.com/docs/installation/vite) (installatie met path alias en Tailwind)
