# ADR 003: LLM bulk-import — OpenAI en Celery

## Status
Voorstel

## Context

Epic 7 (Data Import/Seed en "AI als invoerhulp") vereist bulk-import van werkwoorden en invulzinnen via een externe API (LLM). Randvoorwaarden:

- **Traceability:** Welke werkwoorden zijn verwerkt, welke zijn gefaald en waarom?
- **Geen time-outs:** Bulk-verwerking mag niet in de HTTP-request van de beheerder draaien.
- **Retries:** Transiente API-fouten moeten opnieuw geprobeerd kunnen worden; partial success moet mogelijk zijn (sommige items slagen, andere niet).
- **Reproduceerbaarheid:** Welk model en welke parameters zijn gebruikt per job?
- **Twee soorten output:** Werkwoordsvormen (compact, strikt, goed te valideren) en invulzinnen (meer tokens, meer kans op stijl/kwaliteit-issues). Als zinnen mislukken, mogen de vormen wél opgeslagen zijn.

## Besluit

We kiezen voor:

1. **LLM-provider en model:** OpenAI **GPT-4o-mini**, met **Structured Outputs** (JSON schema) voor voorspelbare response-vorm. Voldoende kwaliteit voor Nederlandse werkwoordsvormen en korte zinnen; lage kosten; ondersteuning voor strict JSON output.

2. **Twee aparte API-calls per werkwoord (of per batch):**
   - **Product A — Vormen:** Eén call per batch van 10–50 infinitieven; output: per werkwoord de zeven vormvelden + vd_hulpwerkwoord. Compact en strikt te valideren.
   - **Product B — Zinnen:** Eén call per werkwoord (na succesvolle vormen), met de opgeslagen vormen als input zodat het model consistente zinnen produceert. Output: lijst zinnen. Zo blokkeren zinnen-fouten niet het opslaan van vormen.

3. **Async verwerking:** **Celery** met een broker (bijv. Redis). De admin-view maakt een job en items aan en queue’t een task; de worker voert de LLM-calls, validatie en upsert uit. Retries en backoff voor transiente fouten zijn mogelijk.

4. **Job- en item-model:** **VerbImportJob** (status, input_text, requested_count, created_by, model/params) en **VerbImportItem** (per werkwoord: infinitive, status, error_message, raw_response). Zo is per job en per item zichtbaar wat er gebeurd is; retry "failed items" is mogelijk zonder de hele job over te doen.

## Consequenties

- **Dependencies:** Python-package `openai`; Celery + broker (Redis aanbevolen).
- **Configuratie:** `OPENAI_API_KEY` uit omgeving (geen key in code); optioneel `OPENAI_VERB_MODEL` (default: gpt-4o-mini).
- **Toegang:** Alleen beheerder; job en items zijn audit-informatie.
- **Infra:** Celery worker moet draaien naast de Django-app; broker moet beschikbaar zijn voor queuing.

## Referenties

- Epic 7: [v3/epics.md](epics.md)
- Datamodel import: [docs/epic-7-datamodel-import.md](../docs/epic-7-datamodel-import.md)
- Technisch overzicht: [docs/epic-7-technisch-overzicht.md](../docs/epic-7-technisch-overzicht.md)
