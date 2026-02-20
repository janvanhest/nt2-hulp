# Casus

## Context

Deze app is bedoeld voor een huishouden (mijn vrouw en mijn zoon) om Nederlandse werkwoordsvormen te oefenen. De doelgroep bestaat uit twee gebruikers die werkwoordsvormen willen leren en controleren.

## Probleemstelling

Werkwoordsvormen oefenen is tijdrovend en het controleren van antwoorden is lastig zonder goed nakijkmodel. Er is behoefte aan een eenvoudige app die invuloefeningen kan genereren en een correctiemodel kan tonen.

## Doel

Een eenvoudige app waarmee gebruikers:

- werkwoordsvormen kunnen invullen (alle vormen per werkwoord)
- zinnen met een invulplek kunnen maken (werkwoord invullen in context)
- een nakijkmodel kunnen bekijken of exporteren

**Uitbreiding (v4):**

- **Thema's:** Werkwoorden en invulzinnen groeperen op thema (bijv. "beweging", "les 5"); oefenen en beheren op basis van thema.
- **Selectie bij genereren:** Beheerder kiest waaruit een oefening wordt samengesteld (werkwoorden en/of thema), niet alleen "N willekeurige items"; student heeft zo geruime tijd oefenmateriaal.
- **Schaalbaar beheer:** Bij veel werkwoorden en zinnen niet alles in één scherm; zoeken en filteren op thema en werkwoord (zie [scenarios.md](scenarios.md) en [fasering.md](fasering.md)).

Later: andere activiteiten toevoegen, thema's of onderwerpen doorlopen, voortgang bijhouden.

## Gebruikers

- Primaire gebruikers: mijn vrouw en mijn zoon (studenten)
- Begeleider/beheerder: ikzelf (beheer van werkwoorden, zinnen en thema's)

## Randvoorwaarden

- Laagdrempelig in gebruik
- Werkt zonder complexe setup
- Mogelijkheid om oefeningen te herhalen en antwoorden te controleren
- AI-ondersteuning is voorlopig simpel: eenmalig antwoorden invullen om ze daarna herbruikbaar op te slaan

## Noun-verb analyse

### Nouns (zelfstandige naamwoorden)

- gebruiker
- werkwoord
- werkwoordsvorm
- oefening
- invuloefening
- invulzin
- zin
- antwoord
- nakijkmodel
- lijst/rijtje
- beheerder
- dataset
- thema
- selectie
- activiteit
- AI-suggestie

### Verbs (werkwoorden/acties)

- oefenen
- invullen
- genereren
- controleren
- nakijken
- beheren
- exporteren
- selecteren
- herhalen
- thematisch doorlopen
- filteren (op thema/werkwoord)
- voorstellen (AI)

## Geplande uitbreidingen

Voortgang/score bijhouden en thema's/selectie zijn uitgewerkt in v4. Zie [fasering.md](fasering.md) (Fase 1–4) en [epics.md](epics.md). Voor voortgang (wat gedaan, beheerst, te herhalen): [docs/voortgang-tracking.md](../docs/voortgang-tracking.md).

## Open vragen

- Moeten er niveaus of subcategorieën komen (bijv. regelmatige/onregelmatige werkwoorden)?
- AI alleen als eenmalige invoerhulp, of ook dynamisch tijdens oefenen?

Voor open vragen rond thema en selectie: [open-vragen.md](open-vragen.md).
