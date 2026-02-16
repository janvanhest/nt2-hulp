# v3 Docs (Reading Order)

Deze map bevat ontwerpdocumentatie voor een "v3" web-app (React SPA + API).

## Lokaal draaien (Docker)

De backend (Django) en database (PostgreSQL) staan in de map **`backend/`** en kunnen daar met Docker worden gestart. Je hebt alleen Docker en Docker Compose nodig; er hoeft geen Python of Postgres lokaal geïnstalleerd te zijn. Voor stappen, vereisten en troubleshooting: **[docs/docker.md](docs/docker.md)**. Env-variabelen: kopieer `backend/.env.example` naar `backend/.env` en vul die in.

## Aanbevolen leesvolgorde

1. [Casus](v3/casus.md) — context, doel, scope  
2. [Domeindiagram](v3/domeindiagram.md) — domeinbegrippen en relaties  
3. [Requirements](v3/requirements.md) — MVP requirements (functioneel/niet-functioneel)  
4. [Use cases](v3/usecases.md) — concrete flows (UC1..UC7)  
5. [ERD](v3/erd.md) — data model (concept)  
6. [Epics](v3/epics.md) — delivery slices (epics + acceptatiecriteria)  
7. [ADR-001 Stack choice](v3/adr-001-stack-choice.md) — stack/architectuurkeuzes (status: TBD)  
8. [Container diagram](v3/container-diagram.md) — containers (opties)  
9. [Component diagram](v3/component-diagram.md) — componenten per optie  
10. [Requirements (dev)](v3/requirements-dev.md) — dev setup/quality gates (stack-agnostisch)  
11. [Open questions](v3/open-questions.md) — open beslispunten  

## Notities

- Epic 0 (Foundation) wordt als eerste uitgevoerd; [Epics](v3/epics.md) 1–7 bouwen daarop voort.
- [ADR-001 Stack choice](v3/adr-001-stack-choice.md) is nog niet beslist; [Requirements (dev)](v3/requirements-dev.md) blijft daarom bewust algemeen.
- [Open questions](v3/open-questions.md) is bedoeld als backlog van beslissingen die het datamodel en de oefenlogica kunnen beïnvloeden.
