# v4 — Documentatie (single source of truth)

**v4 is nu de bron voor casus, erd, usecases en epics.** Alle functionele documentatie voor verdere ontwikkeling staat in deze map.

## Waarom v4

v4 bundelt de uitbreiding **thema**, **selectie** en **schaal beheer** met de bestaande scope. Terminologie, scenario's, conceptueel model en fasering zijn vastgelegd; casus, ERD, usecases en epics zijn hier in v4 op basis daarvan uitgewerkt.

## Leesvolgorde

**Basis (thema & selectie):**
1. [terminologie.md](terminologie.md) — Eenduidige begrippen
2. [scenarios.md](scenarios.md) — User journeys student en beheerder
3. [conceptueel-model.md](conceptueel-model.md) — Thema, selectie, relaties
4. [fasering.md](fasering.md) — Wat wanneer (Fase 1–4)
5. [open-vragen.md](open-vragen.md) — Vastgelegde keuzes en open punten

**Functionele docs:**
6. [casus.md](casus.md) — Context, doel, gebruikers, randvoorwaarden
7. [erd.md](erd.md) — Datamodel (inclusief thema en koppeltabellen). Optioneel: [domeindiagram.md](domeindiagram.md) (conceptueel domein, class diagram).
8. [usecases.md](usecases.md) — Use cases (inclusief selectie en beheer-uitbreidingen)
9. [epics.md](epics.md) — Epics en acceptatiecriteria (inclusief v4-uitbreidingen)

## ADR's

Architecture Decision Records voor stack en LLM-import: [adr/adr-backend.md](adr/adr-backend.md), [adr/adr-frontend.md](adr/adr-frontend.md), [adr/adr-llm.md](adr/adr-llm.md).

## Epic-uitwerkingen

Gedetailleerde uitwerkingen (contracts, validatie, LLM, technisch overzicht): [epics/](epics/).

## Relatie met v3

- **v3** ([../v3/](../v3/)) is de vorige referentie; de bestaande app is op v3 gebaseerd. v3 en [archive/v3/](../archive/v3/) worden in dit plan niet gewijzigd.
- **v4** is leidend voor verdere ontwikkeling: nieuwe features (thema, selectie, schaal beheer) en bijbehorende aanpassingen aan ERD, usecases en epics staan in v4.
- ADR's en epic-uitwerkingen staan nu in v4 (overname uit archive/v3 en docs); v4 is self-contained.

## Overzicht v4-documenten

| Document | Inhoud |
|----------|--------|
| [casus.md](casus.md) | Context, doel, gebruikers, v4-doelen (thema, selectie, schaal) |
| [erd.md](erd.md) | Entiteiten en relaties; thema, werkwoord_thema, invulzin_thema |
| [domeindiagram.md](domeindiagram.md) | Conceptueel domein (begrippen, class diagram); oorspronkelijk v3 |
| [usecases.md](usecases.md) | UC1–UC7; UC3 uitgebreid met selectie; UC4/UC5 met filter/thema |
| [epics.md](epics.md) | Epic 0–7; Epic 4 selectie; Epic 2/3 thema en schaal; Epic 7 AI (Fase 4). Implementatiestatus (wat is af in code vs. open voor v4) staat per epic in epics.md. |
| [terminologie.md](terminologie.md) | Thema, selectie, oefening, item, sessie |
| [scenarios.md](scenarios.md) | Scenario's student en beheerder |
| [conceptueel-model.md](conceptueel-model.md) | Relaties thema–werkwoord, thema–invulzin (m:n) |
| [fasering.md](fasering.md) | Fase 1–4: selectie, thema, beheer schaalbaar, AI |
| [open-vragen.md](open-vragen.md) | Vastgelegde beslissingen en eventuele open punten |
| [adr/](adr/) | ADR's: backend-, frontend- en LLM-stack |
| [epics/](epics/) | Epic-uitwerkingen: contracts, validatie, technisch ontwerp |
