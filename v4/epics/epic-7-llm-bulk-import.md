# Epic 7: LLM bulk-import — werkwoorden en invulzinnen

## Samenvatting

Epic 7 omvat het **bulk importeren van werkwoorden en invulzinnen** met behulp van een externe LLM (OpenAI GPT-4o-mini). De flow: **bulk input** (werkwoorden per regel) → **async job** (Celery) → **twee soorten LLM-calls** — (A) werkwoordsvormen, (B) invulzinnen → **validatie** → **upsert in DB** → **admin feedback** (job-detail, per-item status, retry failed).

Twee aparte API-calls (product A en B) zorgen ervoor dat als zinnen mislukken, de vormen wél opgeslagen kunnen zijn; vormen zijn compact en strikt te valideren, zinnen kosten meer tokens en hebben meer kans op stijl- of kwaliteitsissues.

Bouwt voort op Epic 0 (Foundation), Epic 1 (Rollen & autorisatie), **Epic 2 (Werkwoorden Beheren)** en **Epic 3 (Invulzinnen Beheren)**. Zie [../epics.md](../epics.md).

### Scope

| Wat | In scope | Toelichting |
|-----|----------|-------------|
| Bulk input werkwoorden | Ja | Textarea: één per regel of comma-separated; dedupe, lowercase, strip. |
| Alleen vormen genereren | Ja | Optie "Alleen vormen" (product A). |
| Vormen + zinnen genereren | Ja | Standaard: product A en B. |
| Async verwerking (Celery) | Ja | Geen time-out in de request; retries en backoff mogelijk. |
| Job- en item-model | Ja | VerbImportJob, VerbImportItem voor traceability en retry. |
| Retry failed items | Ja | Knop op job-detail om alleen gefaalde items opnieuw te proberen. |
| Idempotentie | Ja | update_or_create op Verb.infinitive; geen dubbele werkwoorden bij herhaalde run. |
| Admin bulk-form en job-detail | Ja | Zie [epic-7-admin-ux.md](epic-7-admin-ux.md). |
| Seed/import bestaande data | Ja | Uit [../epics.md](../epics.md); kan naast LLM-import worden uitgewerkt. |
| Handmatig één werkwoord LLM-zinnen | Nee | Epic 7 focust op bulk; enkelvoudige "genereer zinnen" voor één werkwoord kan later. |

### Acceptatiecriteria (uit en uitgebreid t.o.v. `../epics.md`)

1. Het systeem kan een initiële set werkwoorden/vormen en (optioneel) zinnen laden (seed of import).
2. Het systeem kan ontbrekende velden herkennen en expliciet markeren als "nog in te vullen".
3. Eventuele AI-ondersteuning is beperkt tot eenmalig invullen van ontbrekende data; resultaten worden opgeslagen en hergebruikt (randvoorwaarde uit `../casus.md`).
4. Beheerder kan een bulk-lijst werkwoorden (infinitieven) invoeren en een generatie-job starten; de job wordt asynchroon verwerkt (geen time-out).
5. Per job zijn totaal, geslaagd en gefaald items zichtbaar; per item zijn status en eventuele foutmelding (en optioneel raw_response) beschikbaar.
6. Bij succes worden werkwoorden en vormen idempotent opgeslagen (update_or_create op infinitive); gegenereerde zinnen worden opgeslagen als invulzinnen (sentence_template + answer + answer_form_key, gekoppeld aan werkwoord) en daarna hergebruikt.
7. Beheerder kan gefaalde items van een job opnieuw laten verwerken ("Retry failed items").
8. Alleen beheerder heeft toegang tot import en job-overzicht.

### Relevante bronnen

- **Epic 7 in epics:** [../epics.md](../epics.md) (Data Import/Seed en "AI als invoerhulp").
- **ADR (OpenAI, Celery, twee calls):** [../adr/adr-llm.md](../adr/adr-llm.md).
- **Datamodel (Job, Item):** [epic-7-datamodel-import.md](epic-7-datamodel-import.md).
- **LLM-contracten (request/response A en B):** [epic-7-llm-contracts.md](epic-7-llm-contracts.md).
- **Validatieregels:** [epic-7-validatie.md](epic-7-validatie.md).
- **Technisch overzicht (flow, componenten):** [epic-7-technisch-overzicht.md](epic-7-technisch-overzicht.md).
- **Admin UX (formulier, job-detail):** [epic-7-admin-ux.md](epic-7-admin-ux.md).
- **Bestaande modellen en ERD:** [../erd.md](../erd.md), [../../backend/verbs/models.py](../../backend/verbs/models.py).

---

## Implementatievolgorde

Volgorde om snel aan de slag te gaan; elk stap bouwt op de vorige.

1. **Datamodel:** VerbImportJob en VerbImportItem (+ migraties). Geen aparte ExampleSentence als gegenereerde zinnen direct als FillInSentence worden opgeslagen.
2. **Config:** OPENAI_API_KEY en OPENAI_VERB_MODEL in Django settings (uit env).
3. **OpenAI-service:** Client; product A (vormen batch) met Structured Output; product B (zinnen) met schema.
4. **Validatie:** Module voor vormen (vd_hulpwerkwoord, max length, lege strings); daarna zinnen (bevat vorm, max length, geen markdown).
5. **Upsert:** Servicefunctie(s) update_or_create Verb + VerbForm; voor zinnen: aanmaken FillInSentence met sentence_template, answer, answer_form_key.
6. **Celery:** Broker config; task `run_import_job` (in eerste iteratie alleen vormen).
7. **Admin:** Bulk-form (textarea), view die job + items aanmaakt en task queue't; redirect naar job-detail.
8. **Job-detailpagina:** Status, counts, lijst items met status/fouten; optioneel raw_response.
9. **Uitbreiden task:** Na vormen ook zinnen-call + validatie + FillInSentence aanmaken.
10. **Retry failed items:** Knop + task of parameter om alleen failed items opnieuw te verwerken.
11. **(Optioneel)** Logging/metrics: tokens, foutpercentages.
