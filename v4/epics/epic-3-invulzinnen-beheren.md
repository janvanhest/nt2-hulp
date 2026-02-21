# Epic 3: Invulzinnen Beheren

## Samenvatting

Oefenzinnen zijn een **uitbreiding op werkwoorden**: elke invulzin hoort bij een bestaand werkwoord. De beheerder kan invulzinnen toevoegen, wijzigen en verwijderen, waarbij bestaande werkwoorden zichtbaar zijn zodat zinnen eenvoudig aan werkwoorden gekoppeld kunnen worden.

Bouwt voort op Epic 0 (Foundation), Epic 1 (Rollen & autorisatie) en **Epic 2 (Werkwoorden Beheren)**. Er moeten werkwoorden bestaan voordat invulzinnen zinvol kunnen worden beheerd.

### Scope

| Wat | In scope | Toelichting |
|-----|----------|-------------|
| Invulzin CRUD | Ja | Toevoegen, wijzigen, verwijderen. |
| Koppeling aan werkwoord | Ja | Elke invulzin heeft een `werkwoord_id`; keuze uit bestaande werkwoorden. |
| Velden `sentence_template` en `answer` | Ja | Zie `../erd.md`. |
| Werkwoordsvorm van het antwoord | Ja | Veld `answer_form_key` (bijv. tt_ik, vt_ev, vd) zodat eenduidig is welke vorm bedoeld is (bijv. "loop" = ik-tt, "liep" = hij-vt). Dropdown in UI met labels uit werkwoordsvormen. |
| Werkwoorden tonen bij invoeren | Ja | Lijst/dropdown van bestaande werkwoorden bij toevoegen/wijzigen van een invulzin. |
| Oefenzinnen toevoegen vanuit werkwoord-detail | Ja | Vanuit een werkwoord kunnen oefenzinnen voor dat werkwoord worden toegevoegd (werkwoord vooringevuld). |
| Lege staat: geen werkwoorden | Ja | Duidelijke melding + verwijs naar Vervoegingen beheren. |
| Autorisatie | Ja | Alleen beheerder; hergebruik beheer-permissies. |
| Foutmelding bij oefening zonder zinnen | Ja | Bij invulzin-oefening zonder beschikbare zinnen (Epic 4/5). |
| Weergave "Alleen invulzinnen" | Ja | Beheerder kan op de zinnen-pagina kiezen voor weergave "Invulzinnen" (alleen lijst invulzinnen per werkwoord, zonder vormdekking) of "Vormdekking" (met vormdekking en streef per vorm). |

### Acceptatiecriteria (uit `../epics.md`)

1. Beheerder kan invulzinnen toevoegen, wijzigen en verwijderen.
2. Een invulzin heeft minimaal `sentence_template` en `answer` (zie `../erd.md`); de beheerder geeft aan welke werkwoordsvorm het antwoord is (bijv. ik-tt, hij-vt), zodat eenduidig is of "loop" of "liep" e.d. bedoeld is.
3. Bij het toevoegen of wijzigen van een invulzin kiest de beheerder een werkwoord uit de lijst van bestaande werkwoorden (bijv. dropdown of zoeklijst); het systeem toont bestaande werkwoorden zodat oefenzinnen eenvoudig aan werkwoorden gekoppeld kunnen worden.
4. Vanuit het detail van een werkwoord kan de beheerder oefenzinnen voor dat werkwoord toevoegen (werkwoord is dan vooringevuld).
5. Als er nog geen werkwoorden bestaan, toont het systeem een duidelijke melding en verwijs naar Vervoegingen beheren (Epic 2).
6. Het systeem toont een foutmelding als er geen zinnen beschikbaar zijn bij een invulzin-oefening.
7. Er is een duidelijke manier om alleen de invulzinnen per werkwoord te zien (zonder vormdekking in de kaarten), bijv. via tab "Invulzinnen".

### Relevante bronnen

- **Use case:** UC5 (Invulzinnen beheren) in `../usecases.md`.
- **ERD:** `INVULZIN` (o.a. `werkwoord_id`, `sentence_template`, `answer`, `answer_form_key`) en relatie `WERKWOORD ||--o{ INVULZIN` in `../erd.md`.
- **Afhankelijkheid:** Epic 2 (Werkwoorden Beheren) — werkwoorden-API en -UI bestaan; lijst werkwoorden wordt hergebruikt voor keuze bij invulzinnen.

---

## Ontwerpbeslissingen

### 1. Invulzinnen als uitbreiding op werkwoorden

Invulzinnen worden altijd aan een werkwoord gekoppeld (`werkwoord_id` verplicht). Er is geen "losse" invulzin. De UI ondersteunt twee manieren van toevoegen:

- **Flow A — Vanuit Zinnen beheren:** Overzicht van invulzinnen → "Nieuwe zin" → kies werkwoord uit lijst van bestaande werkwoorden → vul `sentence_template` en `answer` in.
- **Flow B — Vanuit Werkwoord-detail:** Bij een werkwoord (detail of rij) → "Oefenzinnen toevoegen" → werkwoord is vooringevuld → alleen `sentence_template` en `answer` invullen.

Beide flows leiden tot dezelfde data: een `INVULZIN` met `werkwoord_id`, `sentence_template`, `answer` en `answer_form_key`.

### 2. Werkwoordsvorm van het antwoord (answer_form_key)

Het antwoord ("loop", "liep", "gelopen" …) kan bij hetzelfde werkwoord voor meerdere vormen gelden. Om dubbelzinnigheid te voorkomen:

- Elke invulzin heeft een veld **`answer_form_key`**: welke werkwoordsvorm in de invulplek hoort. Waarden sluiten aan op de vormvelden van het werkwoord: `tt_ik`, `tt_jij`, `tt_hij`, `vt_ev`, `vt_mv`, `vd`, `vd_hulpwerkwoord`, en optioneel `infinitive` (heel werkwoord).
- **UI:** Bij het formulier "Invulzin toevoegen/bewerken" kiest de beheerder naast het antwoord ook "Werkwoordsvorm" uit een dropdown met dezelfde labels als bij werkwoordsvormen (bijv. "ik (tt)", "hij/zij (vt)", "voltooid deelwoord"). Zo is duidelijk: antwoord "loop" + vorm "ik (tt)" versus antwoord "liep" + vorm "hij/zij (vt)".
- **Weergave:** In lijst of detail kan het antwoord getoond worden als "loop (ik, tt)" of "liep (hij, vt)" voor snelle herkenning.
- Labels en keys hergebruiken uit `verbFormConfig` / werkwoordsvormen (Epic 2) voor consistentie.

### 3. Geen invulzinnen zonder werkwoorden

Als er nog geen werkwoorden zijn:

- Pagina "Zinnen beheren" (voorheen Overzicht per werkwoord) toont een duidelijke melding (bijv. "Voeg eerst werkwoorden toe om oefenzinnen te kunnen koppelen.") met link/verwijzing naar Vervoegingen beheren.
- "Nieuwe invulzin" is dan niet beschikbaar of toont dezelfde melding.

### 4. API en data

- Invulzinnen kunnen een eigen resource zijn (bijv. `GET/POST /api/beheer/invulzinnen/`) met `werkwoord_id` in de body, of genest onder werkwoorden voor aanmaken (bijv. `POST /api/beheer/werkwoorden/:id/invulzinnen/`). Beide kunnen naast elkaar bestaan: genest voor flow B, lijst + filter voor flow A.
- Lijst werkwoorden voor de dropdown/zoeklijst komt uit de bestaande werkwoorden-API (Epic 2).

### 5. Contract: foutmelding bij invulzin-oefening zonder zinnen (Epic 4/5)

Acceptatiecriterium 6: *"Het systeem toont een foutmelding als er geen zinnen beschikbaar zijn bij een invulzin-oefening."* Dit speelt bij het **aanmaken of starten** van een invulzin-oefening (Epic 4: Oefeningen genereren / Epic 5: Oefenen).

**Afspraak voor implementatie Epic 4/5:**

- **Backend:** Bij het aanmaken of ophalen van een invulzin-oefening: als er **0 beschikbare invulzinnen** zijn, retourneert de API een duidelijke fout (bijv. HTTP 400 of 422) met een message in de trant van: *"Geen invulzinnen beschikbaar voor een invulzin-oefening."*
- **Frontend:** Toon deze message als foutmelding aan de gebruiker (niet een generieke "Er is iets misgegaan"); de gebruiker moet begrijpen dat er eerst invulzinnen moeten bestaan.

Zo is bij bouw van de oefening-flow in één keer voldaan aan dit criterium.

---

## Afhankelijkheden

- **Epic 2 (Werkwoorden Beheren)** moet afgerond zijn: werkwoorden bestaan in de database en zijn via API en beheer-UI beschikbaar.
- De frontend voor invulzinnen hergebruikt de werkwoorden-lijst (of API-call) voor het tonen van bestaande werkwoorden bij het kiezen van een werkwoord voor een invulzin.
