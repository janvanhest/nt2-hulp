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
| Weergave "Alleen invulzinnen" | Ja | Op de pagina Overzicht per werkwoord kan de beheerder kiezen voor weergave "Zinnen beheren" (`?view=zinnen`: alleen invulzinnen per werkwoord) of "Overzicht per werkwoord" (`?view=vormdekking`: met vormdekking en streef per vorm). |
| Thema per invulzin | Ja | Invulzin kan bij meerdere thema's horen (m:n). Backend: Theme-model en InvulzinThema-koppeltabel. In de form-dialog: thema's kiezen uit lijst of nieuw thema direct toevoegen (creatable). In de tabel: kolom "Vorm" (badge werkwoordsvorm) en "Thema's" (badges). |
| Stap 3 wizard Oefening toevoegen | Ja | In de wizard "Oefening toevoegen" biedt stap 3 inline beheer van invulzinnen voor het zojuist gekozen werkwoord: tabel (Zin, Vorm, Antwoord, Thema's, Acties), knop "Zin toevoegen" opent een **dialog** (werkwoord vast), bewerken/verwijderen in dialogs. Link "Naar Zinnen beheren" naar Overzicht per werkwoord. |

### Acceptatiecriteria (uit `../epics.md`)

1. Beheerder kan invulzinnen toevoegen, wijzigen en verwijderen.
2. Een invulzin heeft minimaal `sentence_template` en `answer` (zie `../erd.md`); de beheerder geeft aan welke werkwoordsvorm het antwoord is (bijv. ik-tt, hij-vt), zodat eenduidig is of "loop" of "liep" e.d. bedoeld is.
3. Bij het toevoegen of wijzigen van een invulzin kiest de beheerder een werkwoord uit de lijst van bestaande werkwoorden (bijv. dropdown of zoeklijst); het systeem toont bestaande werkwoorden zodat oefenzinnen eenvoudig aan werkwoorden gekoppeld kunnen worden.
4. Vanuit het detail van een werkwoord kan de beheerder oefenzinnen voor dat werkwoord toevoegen (werkwoord is dan vooringevuld).
5. Als er nog geen werkwoorden bestaan, toont het systeem een duidelijke melding en verwijs naar Vervoegingen beheren (Epic 2).
6. Het systeem toont een foutmelding als er geen zinnen beschikbaar zijn bij een invulzin-oefening.
7. Er is een duidelijke manier om alleen de invulzinnen per werkwoord te zien (zonder vormdekking in de kaarten): via de actie **Zinnen beheren** (zelfde pagina met `?view=zinnen`) of de weergave **Overzicht per werkwoord** (zonder view of `view=vormdekking`).

### Relevante bronnen

- **Use case:** UC5 (Invulzinnen beheren) in `../usecases.md`.
- **ERD:** `INVULZIN` (o.a. `werkwoord_id`, `sentence_template`, `answer`, `answer_form_key`) en relatie `WERKWOORD ||--o{ INVULZIN` in `../erd.md`.
- **Afhankelijkheid:** Epic 2 (Werkwoorden Beheren) — werkwoorden-API en -UI bestaan; lijst werkwoorden wordt hergebruikt voor keuze bij invulzinnen.

---

## Ontwerpbeslissingen

### 1. Invulzinnen als uitbreiding op werkwoorden

Invulzinnen worden altijd aan een werkwoord gekoppeld (`werkwoord_id` verplicht). Er is geen "losse" invulzin. De UI ondersteunt twee manieren van toevoegen:

- **Flow A — Overzicht per werkwoord / Zinnen beheren:** De pagina `/beheer/overzicht-per-werkwoord` toont bovenaan een **inline card** "Invulzin toevoegen" (geen modal). De beheerder kiest werkwoord → werkwoordsvorm → vult de volledige zin in; het antwoord wordt uit de gekozen werkwoordsvorm afgeleid, de invulplek (___) uit de zin. Bij bewerken schakelt dezelfde card naar "Invulzin bewerken" met vooringevulde velden.
- **Flow B — Vanuit werkwoord (link of wizard):** Bij een werkwoord (rij of in de wizard stap 3) → "Zin toevoegen" / "Oefenzinnen toevoegen" → werkwoord is vooringevuld (bij wizard in een **dialog**); daarna werkwoordsvorm kiezen en zin invullen (zelfde workflow als hierboven).

Beide flows leiden tot dezelfde data: een `INVULZIN` met `werkwoord_id`, `sentence_template`, `answer` en `answer_form_key`.

### 2. Werkwoordsvorm eerst; antwoord en invulplek afgeleid

Om dubbelzinnigheid te voorkomen en de invoer te vereenvoudigen:

- Elke invulzin heeft **`answer_form_key`** (welke werkwoordsvorm) en **`answer`** (het invulwoord). Het formulier volgt een vaste volgorde:
  1. **Werkwoord** kiezen (bijv. lopen).
  2. **Werkwoordsvorm** kiezen (bijv. "ik (tt)"); het **antwoord** wordt automatisch uit de vervoeging van dat werkwoord gehaald (bijv. "loop"). De dropdown toont per optie de waarde, bijv. "ik (tt) — loop". Het antwoord wordt niet handmatig getypt.
  3. **Zin** invullen: de beheerder typt de **volledige zin** met het antwoord erin (bijv. "Ik loop naar mijn werk"). Het systeem vervangt het eerste voorkomen van het antwoord in de zin door `___` en slaat dat op als `sentence_template`. Als het antwoord niet in de zin voorkomt, toont het systeem een foutmelding.
- **Bewerken:** De opgeslagen template (met `___`) wordt in het formulier getoond als volledige zin (___ vervangen door het opgeslagen antwoord), zodat de beheerder de zin kan aanpassen en opnieuw opslaan.
- Labels en keys hergebruiken uit `verbFormConfig` / werkwoordsvormen (Epic 2). Als een werkwoordsvorm nog niet is ingevuld (lege vervoeging), toont de dropdown "(nog niet ingevuld)" en bij opslaan een melding om eerst de vervoeging in te vullen.

### 3. Geen invulzinnen zonder werkwoorden

Als er nog geen werkwoorden zijn:

- De pagina Overzicht per werkwoord (`/beheer/overzicht-per-werkwoord`) toont een duidelijke melding (bijv. "Voeg eerst werkwoorden toe om oefenzinnen te kunnen koppelen.") met link naar Vervoegingen beheren.
- De card "Invulzin toevoegen" is dan niet zichtbaar; pas zodra er werkwoorden zijn wordt de card met het formulier getoond.

### 4. API en data

- Invulzinnen: `GET/POST /api/beheer/invulzinnen/` met `werkwoord_id` in de body; lijst ondersteunt filter `?verb=<id>`. Lijst werkwoorden voor de dropdown komt uit de werkwoorden-API (Epic 2).
- **Thema's:** `GET /api/beheer/themas/` en `POST /api/beheer/themas/` (met **trailing slash** in de request-URL, anders kan redirect bij POST de body doen verliezen). Payload voor aanmaken: `{ "naam": "..." }`. Invulzin-response bevat `themas` (id, naam); create/update accepteren optioneel `thema_ids: number[]`. Bij succesvol aanmaken van een thema in het formulier: toast "Thema toegevoegd." en het nieuwe thema wordt aan de geselecteerde thema's toegevoegd.

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
