# NT-2 Hulp

Ontwerpdocumentatie en code voor een web-app om Nederlands als tweede taal te oefenen (werkwoorden, invulzinnen). React SPA + API (Django).

## Documentatie (v4)

**De actuele specificatie staat in [v4/](v4/).** Daar vind je casus, ERD, use cases, epics, fasering en ADR's. Aanbevolen start: [v4/README.md](v4/README.md) (leesvolgorde en overzicht).

- **Epics & uitwerkingen:** [v4/epics.md](v4/epics.md), [v4/epics/](v4/epics/)
- **ADR's:** [v4/adr/](v4/adr/)
- **Archief v3:** [archive/v3/](archive/v3/) (historische referentie)

## Lokaal draaien

- **Backend (Django + Postgres):** [docs/docker.md](docs/docker.md). Env: kopieer `backend/.env.example` naar `backend/.env` en vul in.
- **Frontend (React SPA):** [frontend/README.md](frontend/README.md) — install, scripts, dev server en proxy naar de API.
