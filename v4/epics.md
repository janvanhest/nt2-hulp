# Epics

Deze epics sluiten aan op [casus.md](casus.md), [usecases.md](usecases.md) en [erd.md](erd.md). **Epic 1 t/m 7 bouwen voort op Epic 0 (Foundation).** v4-uitbreidingen (thema, selectie, schaal beheer) zijn verwerkt volgens [fasering.md](fasering.md). Uitgewerkte epic-documenten (contracts, validatie, technisch ontwerp): [epics/](epics/).

### Implementatiestatus

| Epic | v3-scope | v4-uitbreiding |
|------|----------|----------------|
| 0 Foundation | Af* | — |
| 1 Rollen & autorisatie | Af* | — |
| 2 Werkwoorden Beheren | Af* | Open (Fase 2/3: thema, filter) |
| 3 Invulzinnen Beheren | Af* | Open (Fase 2/3: thema, filter) |
| 4 Oefeningen Genereren | Af* | Open (Fase 1/2: selectie) |
| 5 Oefenen + Nakijkmodel | Af* | — |
| 6 Export | Niet af | — |
| 7 Data Import/Seed | Niet af | Open (Fase 4: AI) |

\* Te verifiëren tegen code.

## Epic 0: Foundation (gebruikers, sessie, migraties)

**Beschrijving:** Alles wat klaar moet zijn voordat domeinfunctionaliteit (werkwoorden, zinnen, oefeningen) gebouwd wordt: backend (gebruikers, sessie, migraties) én frontend (SPA-stack, build, auth-integratie). Zie ook [adr/adr-frontend.md](adr/adr-frontend.md). Andere epics veronderstellen dat dit afgerond is.

**Acceptatiecriteria**
- Het project beschikt over migraties; het databaseschema kan versioned worden aangepast.
- Er is een gebruikersmodel (o.a. identifier, wachtwoord-hash, rol); migratie bestaat en is toegepast.
- Een eerste beheerder kan worden aangemaakt (via seed, script of beveiligd endpoint).
- Gebruikers kunnen inloggen (credentials → sessie of token) en uitloggen (sessie/token invalideren).
- Geauthenticeerde requests worden herkend; er is een endpoint om de huidige gebruiker (en rol) op te vragen (bijv. GET /me).
- Wachtwoorden worden alleen gehashed opgeslagen; er is geen plain-text wachtwoord in de database.
- De frontend is een Vite + React (TypeScript) SPA; de build draait lokaal en levert een bruikbare bundle.
- TanStack Query is geïnstalleerd en geconfigureerd; ten minste één API-call (bijv. GET /me na login) gebruikt TanStack Query.
- shadcn/ui, Tailwind en Lucide icons zijn geïnstalleerd; een minimale layout (shell met navigatie) waarop latere schermen kunnen bouwen.
- Client-side routing (bijv. React Router); login-scherm kan tegen de bestaande auth-API aan (inloggen en uitloggen werken end-to-end).
- (Optioneel) Niet-geauthenticeerde toegang tot beschermde endpoints wordt geweigerd met duidelijke statuscode.

## Epic 1: Rollen & autorisatie

**Beschrijving:** Rollen en rechten afdwingen. Eenvoudige accounts zodat `gebruiker` kan oefenen en `beheerder` kan beheren.

**Acceptatiecriteria**
- Rollen bestaan minimaal uit `gebruiker` en `beheerder`.
- Alleen `beheerder` kan werkwoorden, zinnen en (later) thema's beheren.
- Alleen geauthenticeerde gebruikers kunnen oefenen en nakijkmodellen zien.

## Epic 2: Werkwoorden Beheren (incl. Vormen)

**Beschrijving:** Werkwoorden en bijbehorende werkwoordsvormen kunnen beheren (CRUD) met duidelijke validatie.

**Acceptatiecriteria**
- Beheerder kan een werkwoord (infinitief) toevoegen, wijzigen en verwijderen.
- Beheerder kan per werkwoord de set werkwoordsvormen beheren (zie [erd.md](erd.md)).
- Validatie voorkomt ongeldige invoer (minimaal: infinitief verplicht; vormvelden mogen leeg in MVP).
- Data kan worden opgeslagen en later weer opgehaald voor oefeninggeneratie.

**Uitbreiding (v4 Fase 2/3):**
- Beheerder kan werkwoorden koppelen aan thema's (m:n); thema on-the-fly aanmaken.
- Filter op thema; zoeken op infinitief. Bij veel werkwoorden: geen "alles in één lijst" maar zoeken/filteren (zie [fasering.md](fasering.md)).

## Epic 3: Invulzinnen Beheren

**Beschrijving:** Oefenzinnen zijn een uitbreiding op werkwoorden: altijd aan een bestaand werkwoord gekoppeld. Zinnen met invulplek beheren, inclusief het juiste antwoord (werkwoord of vorm).

**Acceptatiecriteria**
- Beheerder kan invulzinnen toevoegen, wijzigen en verwijderen.
- Een invulzin heeft minimaal `sentence_template` en `answer` (zie [erd.md](erd.md)); daarnaast **welke werkwoordsvorm** het antwoord is (answer_form_key).
- Bij toevoegen/wijzigen kiest de beheerder een werkwoord (bijv. dropdown of zoeklijst); vanuit werkwoord-detail kan de beheerder oefenzinnen voor dat werkwoord toevoegen (werkwoord vooringevuld).
- Als er nog geen werkwoorden bestaan, toont het systeem een duidelijke melding en verwijs naar Werkwoorden beheren (Epic 2).
- Het systeem toont een foutmelding als er geen zinnen beschikbaar zijn bij een invulzin-oefening (contract Epic 4/5).

**Uitbreiding (v4 Fase 2/3):**
- Beheerder kan invulzinnen koppelen aan thema's (m:n); thema on-the-fly aanmaken.
- Filter op thema en/of werkwoord; zoeken; schaalbaar beheer (zie [fasering.md](fasering.md)).

## Epic 4: Oefeningen Genereren

**Beschrijving:** Oefeningen genereren op basis van een **selectie** (werkwoorden en/of thema) en aantal items (zie [terminologie.md](terminologie.md)).

**Acceptatiecriteria**
- Beheerder kan kiezen tussen vervoegingsoefening en invulzin-oefening (UC3).
- Beheerder maakt een **selectie**: kiest werkwoorden (expliciet) en/of een thema waaruit items worden gekozen (Fase 1: alleen werkwoorden; Fase 2: ook thema).
- Beheerder kan het aantal items kiezen (rijtje); richtlijn minimaal 5 voor voldoende oefenlengte.
- Het systeem maakt een oefening aan met geordende items (zie [erd.md](erd.md)) en nakijkmodel.
- Het systeem toont een melding als er te weinig items beschikbaar zijn in de gekozen selectie.

## Epic 5: Oefenen + Nakijkmodel Tonen

**Beschrijving:** Gebruikers kunnen oefeningen invullen en daarna het nakijkmodel bekijken. Het nakijkmodel wordt bij aanmaak van de oefening (Epic 4) aangemaakt; de gebruiker roept het op in de app.

**Acceptatiecriteria**
- Gebruiker kan een vervoegingsoefening doorlopen en invoer per werkwoordsvorm doen (UC1).
- Gebruiker kan een invulzin-oefening doorlopen en per zin een antwoord invullen (UC2).
- Na afronden kan de gebruiker het nakijkmodel bekijken met correcte antwoorden.
- "Nakijken" werkt ook als de oefening niet volledig is ingevuld (toon alsnog de correcte antwoorden).

## Epic 6: Export (Oefening + Nakijkmodel)

**Beschrijving:** Oefeningen en nakijkmodellen kunnen exporteren (minimaal PDF of Markdown). De nakijk-PDF wordt gegenereerd op het moment van export.

**Acceptatiecriteria**
- Beheerder kan een exportformaat kiezen (UC6).
- Het systeem kan minimaal een nakijkmodel exporteren (PDF of Markdown).
- Exports zijn downloadbaar en bevatten duidelijk: datum/tijd, oefeningstype en de items met antwoorden.

## Epic 7: Data Import/Seed (en "AI als invoerhulp")

**Beschrijving:** Starten met bestaande datasets (bijv. `verbs.json`) en optioneel eenmalige invoerhulp voor ontbrekende vormen. Eenmalig invulzinnen laten genereren via een externe API (bijv. LLM), opslaan en hergebruiken (zie [casus.md](casus.md)).

**Acceptatiecriteria**
- Het systeem kan een initiële set werkwoorden/vormen en (optioneel) zinnen laden (seed of import).
- Het systeem kan ontbrekende velden herkennen en expliciet markeren als "nog in te vullen".
- Eventuele AI-ondersteuning is beperkt tot eenmalig invullen van ontbrekende data; resultaten worden opgeslagen en hergebruikt.
- Beheerder kan voor een gekozen werkwoord eenmalig een aantal invulzinnen laten genereren via een externe API (LLM); gegenereerde zinnen worden opgeslagen als invulzinnen en daarna hergebruikt.

**Uitbreiding (v4 Fase 4):** AI-generatie van materiaal op basis van thema en/of werkwoorden; selectie als input; zie [fasering.md](fasering.md) en [adr/adr-llm.md](adr/adr-llm.md).

## Uitbreidingen na MVP (backlog)

- **Voortgang en tracking:** De gebruiker ziet wat hij al gedaan heeft; welke werkwoorden/zinnen beheerst vs. te herhalen; opslaan van antwoorden en afronding. Zie [../docs/voortgang-tracking.md](../docs/voortgang-tracking.md). Later: dashboard en suggestie "oefen wat te herhalen".
- **Thema's / selectie / schaal beheer:** Uitgewerkt in v4; zie [fasering.md](fasering.md) (Fase 1–4) en [casus.md](casus.md).
