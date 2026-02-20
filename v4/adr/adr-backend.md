Oorspronkelijk: archive/v3/adr-001-stack-choice.md

# ADR 001: Stackkeuze voor API

## Status
Voorstel

## Context
We bouwen een React SPA. De API moet:
- werkwoorden beheren
- vervoegingsoefeningen en invulzin‑oefeningen genereren
- nakijkmodel en exports leveren
- simpele accounts/rollen ondersteunen

Het team heeft sterke PHP/JS ervaring. Er is bestaande Python‑logica, maar hergebruik is niet strikt vereist.

## Opties
### A. Laravel API
**Voordelen**
- Snel bouwen met bestaande ervaring
- Mature auth/roles ecosysteem
- Eenvoudig beheer en CRUD

**Nadelen**
- Python‑logica herbouw nodig
- Minder direct voordeel van Python‑ecosysteem

### B. Python API (FastAPI of Django)
**Voordelen**
- Hergebruik van bestaande Python‑logica mogelijk
- Goede fit voor toekomstige AI‑invoer
- Modern API ecosysteem

**Nadelen**
- Leercurve hoger voor team
- Minder snelheid in MVP

### C. Hybrid: Laravel API + Python Service
**Voordelen**
- Laravel voor auth/CRUD, Python voor oefening/exports
- Maximaal hergebruik van Python‑logica

**Nadelen**
- Extra deployment‑complexiteit
- Inter‑service communicatie en monitoring

## Databasekeuze: PostgreSQL vs MySQL
**PostgreSQL**
- Gratis en open‑source (PostgreSQL License)
- Officiële Docker‑images en brede ondersteuning
- Sterk in JSON‑kolommen (JSONB), indexing en complexe queries

**MySQL**
- Breed ondersteund, eenvoudig te hosten
- JSON support is prima, maar minder krachtig dan Postgres

**Voorkeur**
- **PostgreSQL** (gratis/OSS en uitstekend te draaien met Docker)

## Beslissingscriteria
- MVP snelheid
- Hergebruik bestaande Python‑logica
- Complexity / onderhoudskosten
- Toekomstige AI‑integratie
- JSON‑flexibiliteit in database

## Besluit
**TBD** (kies na prototype‑discussie)

## Consequenties
- Bij Laravel: snelle MVP, herbouw oefen‑logica.
- Bij Python: langzamer opstart, hergebruik mogelijk.
- Bij Hybrid: hoogste complexiteit, maar scheiding van verantwoordelijkheden.
- Bij PostgreSQL: krachtiger JSON en queries.
- Bij MySQL: eenvoudiger setup, minder JSON‑kracht.
