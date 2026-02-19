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

#### Backend Python: lint, format, typecheck
Configuratie staat in **`backend/pyproject.toml`** (Black, Ruff, Mypy). Dev-dependencies: **`backend/requirements-dev.txt`**. Alle onderstaande commando’s voer je uit met **`backend/`** als werkmap.

**Waar installeren?**

- **Lokaal (aanbevolen):** Installeer in je eigen virtualenv in **`backend/`**. Dan kun je `black`, `ruff` en `mypy` in je IDE of terminal gebruiken zonder Docker. De **web**-container gebruikt alleen `requirements.txt` en heeft deze tools standaard niet.
- **In Docker (optioneel):** De **web**-image installeert standaard alleen `requirements.txt`. Voor een eenmalige check in de container:  
  `docker compose run --rm web sh -c "pip install -r requirements-dev.txt && ruff check ."`  
  Voor structureel gebruik in Docker zou je in het Dockerfile (of een apart dev-stage) ook `requirements-dev.txt` kunnen installeren.

1. **Installeren** (lokaal, in een venv): vanuit **`backend/`**:  
   `pip install -r requirements-dev.txt`

2. **Formatteren:** vanuit **`backend/`**:  
   `black .`

3. **Linting (Ruff):** vanuit **`backend/`**:  
   `ruff check .`  
   Optioneel met auto-fix: `ruff check . --fix`

4. **Import-sortering / format (Ruff):** vanuit **`backend/`**:  
   `ruff format .`

5. **Typecheck (Mypy):** vanuit **`backend/`** (zodat `config.settings` vindbaar is):  
   `mypy .`

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
