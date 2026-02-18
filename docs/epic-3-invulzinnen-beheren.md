# Epic 3: Invulzinnen Beheren

## Samenvatting

Oefenzinnen zijn een **uitbreiding op werkwoorden**: elke invulzin hoort bij een bestaand werkwoord. De beheerder kan invulzinnen toevoegen, wijzigen en verwijderen, waarbij bestaande werkwoorden zichtbaar zijn zodat zinnen eenvoudig aan werkwoorden gekoppeld kunnen worden.

Bouwt voort op Epic 0 (Foundation), Epic 1 (Rollen & autorisatie) en **Epic 2 (Werkwoorden Beheren)**. Er moeten werkwoorden bestaan voordat invulzinnen zinvol kunnen worden beheerd.

### Scope

| Wat | In scope | Toelichting |
|-----|----------|-------------|
| Invulzin CRUD | Ja | Toevoegen, wijzigen, verwijderen. |
| Koppeling aan werkwoord | Ja | Elke invulzin heeft een `werkwoord_id`; keuze uit bestaande werkwoorden. |
| Velden `sentence_template` en `answer` | Ja | Zie `v3/erd.md`. |
| Werkwoorden tonen bij invoeren | Ja | Lijst/dropdown van bestaande werkwoorden bij toevoegen/wijzigen van een invulzin. |
| Oefenzinnen toevoegen vanuit werkwoord-detail | Ja | Vanuit een werkwoord kunnen oefenzinnen voor dat werkwoord worden toegevoegd (werkwoord vooringevuld). |
| Lege staat: geen werkwoorden | Ja | Duidelijke melding + verwijs naar Werkwoorden beheren. |
| Autorisatie | Ja | Alleen beheerder; hergebruik beheer-permissies. |
| Foutmelding bij oefening zonder zinnen | Ja | Bij invulzin-oefening zonder beschikbare zinnen (Epic 4/5). |

### Acceptatiecriteria (uit `v3/epics.md`)

1. Beheerder kan invulzinnen toevoegen, wijzigen en verwijderen.
2. Een invulzin heeft minimaal `sentence_template` en `answer` (zie `v3/erd.md`).
3. Bij het toevoegen of wijzigen van een invulzin kiest de beheerder een werkwoord uit de lijst van bestaande werkwoorden (bijv. dropdown of zoeklijst); het systeem toont bestaande werkwoorden zodat oefenzinnen eenvoudig aan werkwoorden gekoppeld kunnen worden.
4. Vanuit het detail van een werkwoord kan de beheerder oefenzinnen voor dat werkwoord toevoegen (werkwoord is dan vooringevuld).
5. Als er nog geen werkwoorden bestaan, toont het systeem een duidelijke melding en verwijs naar Werkwoorden beheren (Epic 2).
6. Het systeem toont een foutmelding als er geen zinnen beschikbaar zijn bij een invulzin-oefening.

### Relevante bronnen

- **Use case:** UC5 (Invulzinnen beheren) in `v3/usecases.md`.
- **ERD:** `INVULZIN` (o.a. `werkwoord_id`, `sentence_template`, `answer`) en relatie `WERKWOORD ||--o{ INVULZIN` in `v3/erd.md`.
- **Afhankelijkheid:** Epic 2 (Werkwoorden Beheren) — werkwoorden-API en -UI bestaan; lijst werkwoorden wordt hergebruikt voor keuze bij invulzinnen.

---

## Ontwerpbeslissingen

### 1. Invulzinnen als uitbreiding op werkwoorden

Invulzinnen worden altijd aan een werkwoord gekoppeld (`werkwoord_id` verplicht). Er is geen "losse" invulzin. De UI ondersteunt twee manieren van toevoegen:

- **Flow A — Vanuit Invulzinnen beheren:** Overzicht van invulzinnen → "Nieuwe zin" → kies werkwoord uit lijst van bestaande werkwoorden → vul `sentence_template` en `answer` in.
- **Flow B — Vanuit Werkwoord-detail:** Bij een werkwoord (detail of rij) → "Oefenzinnen toevoegen" → werkwoord is vooringevuld → alleen `sentence_template` en `answer` invullen.

Beide flows leiden tot dezelfde data: een `INVULZIN` met `werkwoord_id`, `sentence_template` en `answer`.

### 2. Geen invulzinnen zonder werkwoorden

Als er nog geen werkwoorden zijn:

- Pagina "Invulzinnen beheren" toont een duidelijke melding (bijv. "Voeg eerst werkwoorden toe om oefenzinnen te kunnen koppelen.") met link/verwijzing naar Werkwoorden beheren.
- "Nieuwe invulzin" is dan niet beschikbaar of toont dezelfde melding.

### 3. API en data

- Invulzinnen kunnen een eigen resource zijn (bijv. `GET/POST /api/beheer/invulzinnen/`) met `werkwoord_id` in de body, of genest onder werkwoorden voor aanmaken (bijv. `POST /api/beheer/werkwoorden/:id/invulzinnen/`). Beide kunnen naast elkaar bestaan: genest voor flow B, lijst + filter voor flow A.
- Lijst werkwoorden voor de dropdown/zoeklijst komt uit de bestaande werkwoorden-API (Epic 2).

---

## Afhankelijkheden

- **Epic 2 (Werkwoorden Beheren)** moet afgerond zijn: werkwoorden bestaan in de database en zijn via API en beheer-UI beschikbaar.
- De frontend voor invulzinnen hergebruikt de werkwoorden-lijst (of API-call) voor het tonen van bestaande werkwoorden bij het kiezen van een werkwoord voor een invulzin.
