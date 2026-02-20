# Voortgang en tracking (na MVP)

## Doel

- **Terugkomen:** De gebruiker ziet wat hij al gedaan heeft (oefeningen, werkwoorden/zinnen).
- **Beheerst vs. te herhalen:** Per werkwoord of zin: is het voldoende geoefend en goed gegaan (beheerst), of moet het herhaald worden?
- **Later:** Op basis van deze data kan een "pad" of curriculum worden uitgezet (thema's, volgorde, suggesties).

## Uitgangspunten

- Geen wijziging aan de scope van Epic 4 of Epic 5: oefening genereren en in-app invullen blijven zoals gedefinieerd; we **voegen** opslag van antwoorden en afronding toe.
- Eén bron van waarheid: alle tracking gaat via **opgeslagen gebruikersantwoorden** (en eventueel afrondingsstatus).
- "Beheerst" en "herhalen" zijn **afgeleid** uit die data (geen aparte vinkjes die de gebruiker handmatig zet), zodat regels later kunnen worden verfijnd (bijv. 2× goed = beheerst).

## Datamodel (uitbreiding ERD)

Uitbreiding op de bestaande entiteiten: **gebruiker**, **oefening**, **vervoeging_item**, **invulzin_item**, **werkwoord**, **invulzin**. Zie ook [v3/erd.md](v3/erd.md) sectie "Uitbreiding: tracking (na MVP)".

### ExerciseAttempt (poging / sessie)

Eén "attempt": de gebruiker heeft een oefening gestart en (gedeeltelijk) ingevuld.

- `id`
- `exercise` (FK → Exercise)
- `user` (FK → User)
- `started_at`, `completed_at` (nullable)

"Wat heb ik gedaan" = lijst attempts van de gebruiker; `completed_at` = afgerond.

### ConjugationItemAnswer (antwoord per vervoegingsitem)

Per regel in een vervoegingsoefening: welk antwoord gaf de gebruiker, en was het correct?

- `id`
- `attempt` (FK → ExerciseAttempt)
- `conjugation_item` (FK → ConjugationItem)
- Antwoorden per vorm (bijv. `tt_ik`, `tt_jij`, …) of één veld (bijv. JSON) voor alle vormen
- Correctheid: af te leiden uit vergelijking met `VerbForm`, of gecached (bijv. `correct_count` / `total_count` per item) voor snelle queries

### FillInSentenceItemAnswer (antwoord per invulzin-item)

- `id`
- `attempt` (FK → ExerciseAttempt)
- `fill_in_sentence_item` (FK → FillInSentenceItem)
- `given_answer` (string)
- `is_correct` (boolean)

### Relaties

- Attempt → Exercise, User
- ConjugationItemAnswer → Attempt, ConjugationItem (en daarmee Werkwoord)
- FillInSentenceItemAnswer → Attempt, FillInSentenceItem (en daarmee Invulzin)

## Wanneer vastleggen

- **Start oefening (Epic 5):** Create **ExerciseAttempt** (exercise, user, started_at). Dan is "wat gedaan" = lijst van attempts.
- **Invoer per item:** Optioneel live opslaan bij blur/next, of alleen bij "Afronden". Voor MVP: **bij "Afronden" / "Nakijken"** alle item-antwoorden (ConjugationItemAnswer of FillInSentenceItemAnswer) aanmaken en `attempt.completed_at` zetten.
- **Nakijkmodel bekijken:** Geen extra tracking verplicht; de attempt staat er al. Optioneel later: `nakijkmodel_viewed_at` op attempt.

## Beheerst / herhalen (afgeleid)

Geen aparte tabel. "Beheerst" en "te herhalen" worden berekend via **selectors** op basis van attempts en item-answers.

**Werkwoorden (vervoeging):**

- **Beheerst:** Bijv. "gebruiker heeft dit werkwoord in een vervoegingsoefening gehad en alle vormen in die poging correct ingevuld", of "minimaal 2× geoefend en laatste keer 100% goed".
- **Te herhalen:** "Werkwoorden waar de gebruiker ooit een fout bij maakte", of "laatst > N dagen geleden geoefend", of "nog nooit geoefend".

**Invulzinnen:**

- **Beheerst:** "Deze zin is door deze gebruiker correct ingevuld" (eventueel: minimaal 1× of 2× correct).
- **Te herhalen:** "Fout ingevuld", of "lang niet geoefend", of "nog nooit".

De exacte regels kunnen in een selector (bijv. `get_verbs_to_repeat(user_id)`, `get_mastered_verbs(user_id)`) worden geïmplementeerd; de UI toont "Beheerst" / "Te herhalen" op basis daarvan. Later kunnen de regels worden aangescherpt of in config worden gezet.

## Pad / curriculum (later)

Met bovenstaande data kan later:

- **Voortgang per gebruiker:** "Deze werkwoorden beheerst, deze nog te doen, deze herhalen."
- **Suggestie volgende oefening:** Bijv. "Genereer een oefening met 10 werkwoorden uit 'te herhalen'."
- **Thema's:** Als werkwoorden of zinnen later een `thema_id` krijgen: dezelfde attempt/answer-tabellen gebruiken en "pad" filteren op thema (bijv. "oefen alleen thema X" of "volg curriculum thema 1 → 2 → 3").

Geen extra tracking-tabellen nodig voor het pad; wel uitbreiding van **welke** items in een oefening worden gestopt (uitbreiding Epic 4: filter op "te herhalen" of thema).

## Verwijzing naar epics

Deze uitbreiding valt onder **Epic 8** of een uitbreiding van **Epic 5**; zie de sectie "Uitbreidingen na MVP (backlog)" in [v3/epics.md](v3/epics.md).
