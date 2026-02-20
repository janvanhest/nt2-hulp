# Docker – development setup

De applicatie draait in Docker met twee services: **db** (PostgreSQL) en **web** (Django). Configuratie komt uit het `.env`-bestand in de map `backend/`. Zie [backend/.env.example](../backend/.env.example) voor alle variabelen.

**Alle onderstaande commando's voer je uit in de map `backend/`** (de map waarin `docker-compose.yml` en `Dockerfile` staan). Vanuit de repo-root kan het ook: `docker compose -f backend/docker-compose.yml ...`.

## Vereisten

- [Docker](https://docs.docker.com/get-docker/) geïnstalleerd
- [Docker Compose](https://docs.docker.com/compose/install/) (vaak meegeleverd met Docker Desktop)

## Eerste keer

1. **.env vullen**  
   Ga naar `backend/` en kopieer `.env.example` naar `.env` als dat nog niet bestaat. Vul minimaal in:
   - `POSTGRES_PASSWORD` – wachtwoord voor de database
   - `SECRET_KEY` – lange, willekeurige string voor Django (bijv. gegenereerd met `python -c "import secrets; print(secrets.token_urlsafe(50))"`)

2. **Image bouwen (eerste keer, of na wijziging van Dockerfile/requirements.txt)**  
   ```bash
   cd backend && docker compose build
   ```

3. **Stack starten**  
   ```bash
   docker compose up -d
   ```
   (Vanuit `backend/`.) Of zonder `-d` om logs in de terminal te zien. Bij de eerste keer bouwt `up` het image ook als je stap 2 overslaat; expliciet `build` doen maakt de volgorde duidelijker.

   Bij het starten van de **web**-container voert het entrypoint automatisch uit:
   - **Migraties** (`migrate --noinput`)
   - **Eerste beheerder** (als `NT2_FIRST_ADMIN_PASSWORD` in `.env` staat): aanmaken van gebruiker `admin` met dat wachtwoord; anders wordt niets gedaan
   - **Seed data** (als `SEED_INITIAL_DATA=1` in `.env` staat): 3 voorbeeldwerkwoorden (lopen, zwemmen, fietsen) met vormen en invulzinnen
   - Daarna start de server (`runserver`)

4. **Handmatig migraties uitvoeren** (bijv. na toevoegen van een nieuwe migratie, als de stack al draait)  
   ```bash
   docker compose exec web python manage.py migrate
   ```
   (Vanuit `backend/`.) Als de web-container niet draait: `docker compose run --rm web python manage.py migrate`.

5. **Optioneel: superuser aanmaken** (voor Django-admin /admin/)  
   ```bash
   docker compose run --rm web python manage.py createsuperuser
   ```
   Daarmee kun je inloggen op het Django-adminpaneel: **http://localhost:8000/admin/**

6. **Eerste beheerder voor de NT-2 app**  
   Zet in `.env`: `NT2_FIRST_ADMIN_PASSWORD=jouwwachtwoord` (en eventueel `SEED_INITIAL_DATA=1` voor voorbeelddata). Bij de volgende `docker compose up` wordt de beheerder automatisch aangemaakt. Zie [Rollen en autorisatie](rollen-autorisatie.md).

Daarna is de app bereikbaar op **http://localhost:8000**.

## Dagelijks gebruik

- **Starten:** `docker compose up` (of `docker compose up -d` voor op de achtergrond) — vanuit `backend/`
- **Stoppen:** `docker compose down`
- **Migraties uitvoeren** (na toevoegen van een migratie): `docker compose exec web python manage.py migrate`
- **Logs bekijken:** `docker compose logs web` of `docker compose logs db`

**Na wijziging van `requirements.txt` of `Dockerfile`:** voer opnieuw `docker compose build` uit en start eventueel de containers opnieuw (`docker compose up -d`). Bij wijziging van alleen Python-code is geen rebuild nodig (code staat via volume gemount).

## Alleen database in Docker (Django lokaal)

Als je Django op je eigen machine wilt draaien en alleen PostgreSQL in Docker:

1. Start alleen de db (vanuit `backend/`): `docker compose up -d db`
2. Zet in `backend/.env`: `DB_HOST=localhost` (zodat Django op de host naar de container praat)
3. Vanuit `backend/`: `pip install -r requirements.txt` en `python manage.py runserver`

De web-container gebruik je dan niet. Migraties voer je lokaal uit: `python manage.py migrate` (vanuit `backend/`).

## Problemen

- **Logs controleren**  
  `docker compose logs web` of `docker compose logs db` om foutmeldingen te zien.

- **Poort 5432 of 8000 in gebruik**  
  Stop andere processen die deze poorten gebruiken, of pas in `backend/docker-compose.yml` de poortmapping aan (bijv. `"8001:8000"` voor web).

- **"Set POSTGRES_PASSWORD in .env"**  
  Zorg dat `.env` in de map `backend/` staat en `POSTGRES_PASSWORD` bevat. Bij `docker compose run` wordt `.env` automatisch geladen.

- **Database niet bereikbaar / connection refused**  
  Wacht tot de db-service healthy is (enkele seconden na `docker compose up`). Met `depends_on: condition: service_healthy` start web pas daarna.

- **Web start niet / import errors**  
  Na toevoegen van een package in `requirements.txt`: `docker compose build` en daarna `docker compose up -d` (of `docker compose up`).
