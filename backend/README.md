# NT-2 Backend (Django)

Django API voor NT-2 Hulp: gebruikers, werkwoorden, invulzinnen en oefeningen. Praat met de [frontend](../frontend/README.md) SPA (o.a. op port 5173); de frontend proxied `/api` naar deze backend.

## Lokaal draaien

**Aanbevolen:** Docker. Volledige stappen, vereisten en troubleshooting: **[docs/docker.md](../docs/docker.md)** (repo-root).

Kort:
1. Kopieer in `backend/` het bestand `.env.example` naar `.env` en vul o.a. `POSTGRES_PASSWORD` en `SECRET_KEY` in.
2. Vanuit `backend/`: `docker compose build` en `docker compose up -d`.
3. API: **http://localhost:8000** (Django admin: http://localhost:8000/admin/).

**Zonder Docker (alleen DB in Docker):** Zie [docs/docker.md – Alleen database in Docker](../docs/docker.md) (start alleen `db`, zet `DB_HOST=localhost`, run Django met `python manage.py runserver`).

## Env

Zie [.env.example](.env.example) voor alle variabelen. Minimaal: `POSTGRES_PASSWORD`, `SECRET_KEY`. Optioneel: `NT2_FIRST_ADMIN_PASSWORD`, `SEED_INITIAL_DATA=1`.

## Projectstructuur

| Map / bestand | Doel |
|---------------|------|
| `config/` | Django settings, root URLs, WSGI/ASGI |
| `accounts/` | Gebruikers, auth (login/sessie), rollen, API auth + beheer-endpoints |
| `verbs/` | Werkwoorden, vormen, invulzinnen (modellen + API) |
| `exercises/` | Oefeningen genereren, nakijkmodel |
| `manage.py` | Django CLI |
| `Dockerfile`, `docker-compose.yml` | Container-setup (zie [docs/docker.md](../docs/docker.md)) |

## Handige commando's (in container)

Vanuit repo-root: `docker compose -f backend/docker-compose.yml run --rm web python manage.py <command>`. Vanuit `backend/`: `docker compose run --rm web python manage.py <command>`.

- Migraties: `migrate`, `makemigrations`
- Eerste beheerder: `create_first_admin` (of zet `NT2_FIRST_ADMIN_PASSWORD` in `.env`)
- Seed data: `seed_initial_data` (of `SEED_INITIAL_DATA=1` in `.env`)
- Django superuser: `createsuperuser`

## Lint / format / typecheck

Project gebruikt [ruff](https://docs.astral.sh/ruff/), Black en mypy; config in [pyproject.toml](pyproject.toml).
