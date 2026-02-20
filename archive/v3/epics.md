# Epics

Deze epics zijn geschreven als "MVP eerst", en sluiten aan op `v3/casus.md`, `v3/usecases.md` en het domein/ERD. **Epic 1 t/m 7 bouwen voort op Epic 0 (Foundation).**

## Epic 0: Foundation (gebruikers, sessie, migraties)
**Beschrijving:** Alles wat klaar moet zijn voordat domeinfunctionaliteit (werkwoorden, zinnen, oefeningen) gebouwd wordt: backend (gebruikers, sessie, migraties) én frontend (SPA-stack, build, auth-integratie). Zie ook [v3/adr-002-frontend-stack.md](v3/adr-002-frontend-stack.md). Andere epics veronderstellen dat dit afgerond is.

**Acceptatiecriteria**
- Het project beschikt over migraties; het databaseschema kan versioned worden aangepast.
- Er is een gebruikersmodel (o.a. identifier, wachtwoord-hash, rol); migratie bestaat en is toegepast.
- Een eerste beheerder kan worden aangemaakt (via seed, script of beveiligd endpoint).
- Gebruikers kunnen inloggen (credentials → sessie of token) en uitloggen (sessie/token invalideren).
- Geauthenticeerde requests worden herkend; er is een endpoint om de huidige gebruiker (en rol) op te vragen (bijv. GET /me).
- Wachtwoorden worden alleen gehashed opgeslagen; er is geen plain-text wachtwoord in de database.
- De frontend is een Vite + React (TypeScript) SPA; de build draait lokaal en levert een bruikbare bundle.
- TanStack Query is geïnstalleerd en geconfigureerd (`QueryClientProvider`); ten minste één API-call (bijv. GET /me na login) gebruikt TanStack Query.
- shadcn/ui, Tailwind en Lucide icons zijn geïnstalleerd; er is een minimale layout (bijv. shell met navigatie) waarop latere schermen kunnen bouwen.
- Er is client-side routing (bijv. React Router); een login-scherm kan tegen de bestaande auth-API aan (inloggen en uitloggen werken end-to-end).
- (Optioneel) Niet-geauthenticeerde toegang tot beschermde endpoints wordt geweigerd met duidelijke statuscode.

## Epic 1: Rollen & autorisatie
**Beschrijving:** Rollen en rechten afdwingen, gegeven dat gebruikers en sessie (Epic 0) werken. Eenvoudige accounts zodat `gebruiker` kan oefenen en `beheerder` kan beheren. Veronderstelt dat Epic 0 is afgerond.

**Acceptatiecriteria**
- Rollen bestaan minimaal uit `gebruiker` en `beheerder`.
- Alleen `beheerder` kan werkwoorden en zinnen beheren.
- Alleen geauthenticeerde gebruikers kunnen oefenen en nakijkmodellen zien.

## Epic 2: Werkwoorden Beheren (incl. Vormen)
**Beschrijving:** Werkwoorden en bijbehorende werkwoordsvormen kunnen beheren (CRUD) met duidelijke validatie.

**Acceptatiecriteria**
- Beheerder kan een werkwoord (infinitief) toevoegen, wijzigen en verwijderen.
- Beheerder kan per werkwoord de set werkwoordsvormen beheren (zoals in `v3/domeindiagram.md`).
- Validatie voorkomt ongeldige invoer (minimaal: infinitief verplicht; vormvelden mogen leeg in MVP).
- Data kan worden opgeslagen en later weer opgehaald voor oefeninggeneratie.

## Epic 3: Invulzinnen Beheren
**Beschrijving:** Oefenzinnen zijn een uitbreiding op werkwoorden: ze worden altijd aan een bestaand werkwoord gekoppeld. Zinnen met invulplek kunnen beheren, inclusief het juiste antwoord (werkwoord of vorm). Het beheer van invulzinnen bouwt voort op de werkwoorden uit Epic 2.

**Acceptatiecriteria**
- Beheerder kan invulzinnen toevoegen, wijzigen en verwijderen.
- Een invulzin heeft minimaal `sentence_template` en `answer` (zie `v3/erd.md`); daarnaast geeft de beheerder aan **welke werkwoordsvorm** het antwoord is (bijv. ik-tt, hij-vt, voltooid deelwoord), zodat eenduidig is of "loop" of "liep" e.d. bedoeld is.
- Bij het toevoegen of wijzigen van een invulzin kiest de beheerder een werkwoord uit de lijst van bestaande werkwoorden (bijv. dropdown of zoeklijst); het systeem toont bestaande werkwoorden zodat oefenzinnen eenvoudig aan werkwoorden gekoppeld kunnen worden.
- Vanuit het detail van een werkwoord kan de beheerder oefenzinnen voor dat werkwoord toevoegen (werkwoord is dan vooringevuld).
- Als er nog geen werkwoorden bestaan, toont het systeem een duidelijke melding en verwijs naar Werkwoorden beheren (Epic 2).
- Het systeem toont een foutmelding als er geen zinnen beschikbaar zijn bij een invulzin-oefening. (Contract voor implementatie in Epic 4/5: [docs/epic-3-invulzinnen-beheren.md](docs/epic-3-invulzinnen-beheren.md#5-contract-foutmelding-bij-invulzin-oefening-zonder-zinnen-epic-45).)

## Epic 4: Oefeningen Genereren
**Beschrijving:** Oefeningen genereren op basis van beschikbare werkwoorden/zinnen (vervoegingsoefening of invulzin-oefening).

**Acceptatiecriteria**
- Beheerder kan kiezen tussen vervoegingsoefening en invulzin-oefening (UC3).
- Beheerder kan het aantal items kiezen (een "rijtje").
- Het systeem maakt een oefening aan met geordende items (zie `v3/erd.md`).
- Het systeem toont een melding als er te weinig items beschikbaar zijn.

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
**Beschrijving:** Starten met bestaande datasets (bijv. `verbs.json`) en optioneel een eenmalige invoerhulp om ontbrekende vormen in te vullen. Daarnaast: eenmalig invulzinnen laten genereren via een externe API (bijv. Claude), opslaan in de database en daarna hergebruiken (randvoorwaarde uit `v3/casus.md`).

**Acceptatiecriteria**
- Het systeem kan een initiële set werkwoorden/vormen en (optioneel) zinnen laden (seed of import).
- Het systeem kan ontbrekende velden herkennen en expliciet markeren als "nog in te vullen".
- Eventuele AI-ondersteuning is beperkt tot eenmalig invullen van ontbrekende data; resultaten worden opgeslagen en hergebruikt (randvoorwaarde uit `v3/casus.md`).
- Beheerder kan voor een gekozen werkwoord eenmalig een aantal invulzinnen laten genereren via een externe API (bijv. LLM); de gegenereerde zinnen worden opgeslagen als invulzinnen (sentence_template + answer, gekoppeld aan werkwoord) en daarna hergebruikt.

## Uitbreidingen na MVP (backlog)

- **Voortgang en tracking:** De gebruiker ziet wat hij al gedaan heeft; welke werkwoorden/zinnen beheerst vs. te herhalen; opslaan van antwoorden en afronding. Zie [docs/voortgang-tracking.md](docs/voortgang-tracking.md). Later: dashboard en suggestie "oefen wat te herhalen".
- **Thema's / curriculum:** Oefenen per thema of volgorde; werkwoorden of zinnen groeperen; een pad uitzetten. Sluit aan op de open vragen in `v3/casus.md`.
