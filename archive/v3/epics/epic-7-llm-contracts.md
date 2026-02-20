# Epic 7: LLM-contracten — request/response

## Doel

Eenduidige afspraken voor de service-laag die de LLM aanroept. Prompts en response-parsing volgen dit contract; tests en implementatie kunnen hierop leunen. Geen implementatiecode in dit document, wel exacte veldnamen en voorbeelden.

Model: **OpenAI GPT-4o-mini**. Gebruik **Structured Outputs** (JSON schema) zodat keys en types vaststaan.

---

## Product A — Vormen (batch)

Eén call per batch van 10–50 infinitieven; output per werkwoord: zeven vormvelden + vd_hulpwerkwoord.

### Input

- **Payload naar het model:** Een lijst infinitieven, bijvoorbeeld als JSON in de prompt of als gestructureerde user message.
- **Voorbeeld (concept):** `["werken", "lopen", "zwemmen"]`
- **Batchgrootte:** Minimaal 1, maximaal 50 (of 10 voor conservatief); grotere batches in meerdere calls opsplitsen.

### Output-schema

De response is één JSON-object met een array `results`. Elk element komt overeen met één werkwoord (zelfde volgorde als de input).

| Key | Type | Verplicht | Toelichting |
|-----|------|-----------|-------------|
| results | array | Ja | Array van objecten (zie hieronder). |
| results[].infinitive | string | Ja | Infinitief (echo van input). |
| results[].tt_ik | string | Ja | Ik-vorm, tegenwoordige tijd. |
| results[].tt_jij | string | Ja | Jij-vorm, tegenwoordige tijd. |
| results[].tt_hij | string | Ja | Hij/zij/het-vorm, tegenwoordige tijd. |
| results[].vt_ev | string | Ja | Enkelvoud verleden tijd. |
| results[].vt_mv | string | Ja | Meervoud verleden tijd. |
| results[].vd | string | Ja | Voltooid deelwoord. |
| results[].vd_hulpwerkwoord | string | Ja | Alleen `hebben` of `zijn`. |

### Voorbeeld response (product A)

```json
{
  "results": [
    {
      "infinitive": "werken",
      "tt_ik": "werk",
      "tt_jij": "werkt",
      "tt_hij": "werkt",
      "vt_ev": "werkte",
      "vt_mv": "werkten",
      "vd": "gewerkt",
      "vd_hulpwerkwoord": "hebben"
    },
    {
      "infinitive": "lopen",
      "tt_ik": "loop",
      "tt_jij": "loopt",
      "tt_hij": "loopt",
      "vt_ev": "liep",
      "vt_mv": "liepen",
      "vd": "gelopen",
      "vd_hulpwerkwoord": "hebben"
    }
  ]
}
```

### Model en parameters

- **Model:** `gpt-4o-mini` (of waarde uit `OPENAI_VERB_MODEL`).
- **Structured Outputs:** JSON schema met bovenstaande structuur; strict zodat geen extra keys of verkeerde types terugkomen.
- **temperature:** 0 (reproduceerbaar).
- **max_tokens:** Cap zetten (bijv. 2048) om kosten en time-outs te begrenzen.
- **Afspraak:** Geen extra tekst buiten de JSON; alleen het JSON-object in de response.

---

## Product B — Zinnen (per werkwoord)

Eén call per werkwoord, na het succesvol opslaan van de vormen. Input: infinitive + de opgeslagen vormvelden, zodat het model consistente zinnen produceert.

### Input

- **Infinitive:** string (bijv. `"lopen"`).
- **Vormen:** De zeven velden + vd_hulpwerkwoord zoals opgeslagen in VerbForm (tt_ik, tt_jij, tt_hij, vt_ev, vt_mv, vd, vd_hulpwerkwoord). Allemaal als strings meegeven zodat het model de juiste vormen in de zinnen gebruikt.
- **Aantal zinnen:** Bijv. 10 (in prompt vastleggen).
- **Mix van tijden (in prompt):** Bijv. 4× tegenwoordige tijd (tt), 3× verleden tijd (vt), 3× voltooid (vd).
- **Max lengte per zin:** Bijv. 120 tekens (of 500 als sentence_template groter mag); in prompt vermelden.

### Output-schema

| Key | Type | Verplicht | Toelichting |
|-----|------|-----------|-------------|
| sentences | array of strings | Ja | Lijst zinnen; elk element één zin. Geen markdown, geen genummerde lijsten. |

### Voorbeeld response (product B)

```json
{
  "sentences": [
    "Ik loop elke ochtend een rondje.",
    "Hij loopt snel naar de bus.",
    "Gisteren liep ze naar school.",
    "Wij liepen door het park.",
    "Ze hebben gisteren gelopen.",
    "Hij is naar huis gelopen.",
    "Jij loopt te hard.",
    "Zij liepen samen naar de winkel.",
    "Ik heb vorige week veel gelopen.",
    "De hond loopt naast zijn baasje."
  ]
}
```

### Model en parameters

- Zelfde model als product A (gpt-4o-mini).
- Structured Outputs: schema met één key `sentences` (array of strings).
- temperature: 0.
- max_tokens: cap (bijv. 1024).
- Geen extra tekst; alleen JSON.

### Constraints (in prompt vermelden)

- Elke zin bevat precies één van de opgegeven werkwoordsvormen (of infinitief).
- Geen markdown (geen **, geen #), geen rare quotes.
- Max lengte per zin (bijv. 120 of 500 tekens) afhankelijk van `FillInSentence.sentence_template` (max 500 in het huidige model).

---

## Algemene afspraken

- **Alleen JSON:** Geen toelichting of extra tekst in de model-output; de service parst alleen het JSON-object.
- **Keys exact:** Veldnamen zoals hierboven; geen andere spelling (bijv. geen `vdHulpwerkwoord`).
- **Bij fout of invalid schema:** Item status = failed; `raw_response` opslaan in VerbImportItem; `error_message` vullen met korte samenvatting (bijv. "Invalid JSON" of "Missing key: vd_hulpwerkwoord").
- **API-fout (rate limit, time-out, 5xx):** Item op failed; raw_response indien beschikbaar; retry via Celery of "Retry failed items".

---

## Referenties

- [docs/epic-7-validatie.md](epic-7-validatie.md) — businessvalidatie na ontvangst van de response.
- [docs/epic-7-datamodel-import.md](epic-7-datamodel-import.md) — VerbImportItem.raw_response.
- [backend/verbs/models.py](../backend/verbs/models.py) — VerbForm-veldnamen, VdHulp (hebben/zijn).
