# Requirements

## Open vragen
Zie `v3/open-questions.md`.

## Functioneel (MVP)
- Foundation (gebruikers, inloggen, uitloggen, sessie, migraties) wordt gerealiseerd in Epic 0.
- Gebruikers kunnen inloggen en uitloggen (UC7; Epic 0).
- Rollen bestaan minimaal uit `gebruiker` en `beheerder` (UC7; Epic 1).
- Beheerder kan werkwoorden beheren (CRUD) inclusief werkwoordsvormen (UC4).
- Beheerder kan invulzinnen beheren (CRUD) (UC5).
- Beheerder kan een oefening genereren op basis van beschikbare data (UC3).
- Gebruiker kan een vervoegingsoefening invullen en daarna het nakijkmodel bekijken (UC1).
- Gebruiker kan een invulzin-oefening invullen en daarna het nakijkmodel bekijken (UC2).
- Beheerder kan een nakijkmodel exporteren in minimaal 1 formaat (bijv. PDF of Markdown) (UC6).
- Beheerder kan eenmalig invulzinnen laten genereren via een externe API (bijv. LLM); resultaten worden opgeslagen en hergebruikt (Epic 7).

## Niet-functioneel (MVP)
- Laagdrempelig: werkt zonder complexe setup voor de eindgebruiker (randvoorwaarde uit `v3/casus.md`).
- Begrijpelijke fouten: bij te weinig data (werkwoorden/zinnen) toont het systeem een duidelijke melding.
- Data-integriteit: invoer wordt gevalideerd (minimaal: geen lege infinitieven; zinnen hebben template + antwoord).
- Beveiliging: wachtwoorden worden veilig opgeslagen (hashing) en rollen worden server-side afgedwongen.
- Performance: een oefening genereren en het nakijkmodel tonen voelt "direct" (richtlijn: seconden, niet minuten).

## Data & Domein
- Werkwoorden bestaan uit een infinitief met een set werkwoordsvormen (zie `v3/domeindiagram.md`).
- Invulzinnen hebben een `sentence_template` met invulplek en een `answer` (zie `v3/erd.md`).
- Oefeningen worden opgeslagen met geordende items, zodat een sessie reproduceerbaar is (zie `v3/erd.md`).

## Buiten scope (voor nu)
- Thema's/onderwerpen, badges, voortgang en scores (zie `v3/domeindiagram.md`).
- Dynamische AI-oefeninggeneratie; AI is hoogstens een invoerhulp die resultaten opslaat (randvoorwaarde uit `v3/casus.md`).
