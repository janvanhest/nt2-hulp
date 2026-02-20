# Epic 7: Validatieregels — vormen en zinnen

## Doel

Expliciete businessregels voor de import-pipeline. De validatielaag in code is een directe vertaling van deze regels; bij een overtreding wordt het VerbImportItem op failed gezet en geen partial upsert uitgevoerd voor dat item.

Bestaande velden en choices: [../../backend/verbs/models.py](../../backend/verbs/models.py) (VerbForm, VdHulp, FillInSentence).

---

## Vormen (na LLM-response, product A)

Validatie vindt plaats nadat de JSON van de LLM is geparsed en vóór `update_or_create` van Verb/VerbForm.

### Verplichte regels

1. **vd_hulpwerkwoord**
   - Waarde moet in `{"hebben", "zijn"}` liggen (overeenkomstig [VdHulp](../../backend/verbs/models.py)).
   - Anders: validatiefout; item failed.

2. **Max lengte vormvelden**
   - Alle velden tt_ik, tt_jij, tt_hij, vt_ev, vt_mv, vd: maximaal 100 tekens (sluit aan op `VerbForm`: `max_length=100`).
   - Keuze implementatie: **reject** met duidelijke foutmelding (bijv. "tt_ik te lang") of **truncate** tot 100 tekens. In dit document: **reject** aanbevolen zodat geen stille dataverlies optreedt; truncate alleen als expliciet gekozen.

3. **Lege strings**
   - Normaliseren naar lege string of leeg laten; het model heeft `blank=True` voor de vormvelden. Geen None in stringvelden als het Django-model geen null toestaat; lege string is voldoende.

### Optionele regels (kwaliteitspoort)

- **tt_ik ≠ infinitive:** Voor de ik-vorm in tt mag in veel gevallen de stam gelijk zijn aan de infinitief minus -en; afwijking is niet per se fout, maar kan als waarschuwing of strikte check worden toegevoegd.
- **vd niet leeg:** Voor bekende werkwoorden hoort een voltooid deelwoord; vd leeg kan een waarschuwing geven of (bij strikte modus) als fout worden gemarkeerd.

Implementatie beslist of deze optionele regels als harde fout of alleen als logging worden toegepast.

---

## Zinnen (na LLM-response, product B)

Validatie van de array `sentences` vóór het aanmaken van FillInSentence-records.

### Verplichte regels

1. **Bevat werkwoordsvorm**
   - Elke zin moet minstens één van de opgegeven vormen (of de infinitief) bevatten. Controle: string-contains als baseline (bijv. of de zin één van tt_ik, tt_jij, tt_hij, vt_ev, vt_mv, vd, infinitive bevat).
   - Zinnen die geen enkele vorm bevatten: weglaten of het hele item op failed zetten (bijv. als meer dan de helft van de zinnen faalt). Exacte drempel is implementatiekeuze; in dit document: **minstens één zin moet een vorm bevatten**, anders item failed.

2. **Max lengte per zin**
   - Sluit aan op [FillInSentence.sentence_template](../../backend/verbs/models.py): `max_length=500`. Aanbevolen: zinnen korter dan 500 tekens; langere zinnen afkappen of weigeren (per zin of voor de hele set).

3. **Geen markdown / rare quotes**
   - Geen markdown (geen **, #, ```).
   - Geen onnodige escape- of aanhalingstekens in de zin zelf. Korte definitie: strip leading/trailing quotes als die alleen om de hele zin staan; binnen de zin geen control characters. Wat precies geweigerd wordt kan in code worden uitgewerkt (bijv. regex of een allowlist van karakters).

### Bij validatiefout zinnen

- Item status = failed; error_message = samenvatting (bijv. "Geen geldige zinnen: geen vorm gevonden" of "Zin te lang").
- Raw_response van de zinnen-call bewaren in VerbImportItem.
- Geen FillInSentence-records aanmaken voor dit werkwoord in deze job.

---

## Gedrag bij validatiefout (algemeen)

- **Item:** status = `failed`; `error_message` = korte, leesbare samenvatting; `raw_response` bewaren (voor product A en/of B, afhankelijk van waar de fout optrad).
- **Geen partial upsert:** Voor dat item worden geen Verb, VerbForm of FillInSentence aangemaakt of geüpdatet. Andere items in dezelfde job kunnen wel success hebben.
- **Admin:** Kan op de job-detailpagina de fout en (optioneel) raw_response zien en kiezen voor handmatige correctie of "Retry failed items".

---

## Referenties

- [../../backend/verbs/models.py](../../backend/verbs/models.py) — VerbForm (max_length=100, vd_hulpwerkwoord choices), FillInSentence (sentence_template max_length=500), VdHulp.
- [epic-7-llm-contracts.md](epic-7-llm-contracts.md) — response-structuur product A en B.
- [epic-7-datamodel-import.md](epic-7-datamodel-import.md) — VerbImportItem.status, error_message, raw_response.
