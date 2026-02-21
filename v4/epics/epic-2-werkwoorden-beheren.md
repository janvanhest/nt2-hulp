# Epic 2: Werkwoorden Beheren (incl. Vormen)

Korte uitwerking; volledige beschrijving en acceptatiecriteria: [../epics.md#epic-2-werkwoorden-beheren-incl-vormen](../epics.md#epic-2-werkwoorden-beheren-incl-vormen).

## Samenvatting

Werkwoorden en bijbehorende werkwoordsvormen beheren (CRUD) met duidelijke validatie. Zie [../erd.md](../erd.md).

## Kernacceptatiecriteria

- Beheerder kan werkwoord (infinitief) toevoegen, wijzigen, verwijderen; per werkwoord de set werkwoordsvormen beheren.
- Validatie: minimaal infinitief verplicht; vormvelden mogen leeg in MVP.
- Uniciteit: bij toevoegen van een werkwoord met een bestaande infinitief geeft het systeem een duidelijke foutmelding; de API retourneert een passende status (bijv. 400) en een begrijpelijke message. (Implementatie: `Verb.infinitive` unique + serializer.)
- Data opgeslagen en op te halen voor oefeninggeneratie.

## v4-uitbreiding (Fase 2/3)

- Werkwoorden koppelen aan thema's (m:n); thema on-the-fly aanmaken.
- Filter op thema; zoeken op infinitief; schaalbaar beheer. Zie [../fasering.md](../fasering.md).
