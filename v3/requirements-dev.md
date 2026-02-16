# Development Requirements

Deze file beschrijft de dev-setup voor de "v3" web-app (React SPA + API), en is bewust deels stack-agnostisch omdat de API-keuze nog `TBD` is (zie `v3/adr-001-stack-choice.md`).

## Doelen
- Lokale setup in minuten, zonder handmatige installatie-pijn.
- Reproduceerbaar: iedereen draait dezelfde versies en krijgt dezelfde output.
- Snelle feedback: tests/lint/format in de CI en lokaal.

## Minimale benodigdheden (voor iedereen)
- `git`
- `docker` + `docker compose` (aanrader voor DB en lokale services)
- Node.js LTS (voor React SPA)
- Een package manager: `npm` of `pnpm`

## Backend keuze (afhankelijk van ADR)
### Als we Laravel (Optie A) kiezen
- PHP 8.x
- `composer`
- Bij voorkeur Laravel Sail of een vergelijkbare Docker-setup

### Als we Python (Optie B) kiezen
- Python 3.11+ (of het project-specifieke minimum)
- `pip` en een virtualenv of `uv`/`poetry`
- Code quality: `ruff`, `black`, `mypy`, `pytest`

### Als we Hybrid (Optie C) kiezen
- Alles van Laravel + alles van Python
- Extra: duidelijke contract tests tussen gateway en Python service

## Database & Storage (lokaal)
- PostgreSQL (voorkeur uit ADR)
- Exports in lokale "file storage" (map/volume), niet in de database (zie `v3/container-diagram.md`)

## Configuratie (omgeving)
- Gebruik `.env` files per component (bijv. `web/.env`, `api/.env`).
- Secrets nooit committen; voorbeeldwaarden in `.env.example`.
- Minimaal nodig:
  - Database connectie
  - Auth secret(s)
  - Export storage path

## Quality gates (Definition of Done)
- Linting en formatting draaien lokaal en in CI.
- Minimaal 1 test-suite (unit tests voor oefeninggeneratie/validators).
- Alle nieuwe endpoints/flows hebben een happy-path test (API of service-level).
- Geen "silent failures": fouten geven een duidelijke melding terug (UI) of een duidelijke error response (API).

## Aanbevolen repo-structuur (richtinggevend)
- `web/` React SPA
- `api/` Laravel of Python API
- `services/` (alleen bij Hybrid) Python exercise/export service
- `docs/` of `v3/` voor ontwerpdocumentatie
