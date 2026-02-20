# Epic 7: Admin UX — bulk-invoer en job-detail

## Doel

Eenduidige beschrijving van het bulk-invoerformulier en de job-detailpagina zodat de admin-UI en -views direct zo gebouwd kunnen worden. Geen wireframes; wel duidelijke flows en velden.

---

## Bulk-invoer

### Formulier

- **Invoerveld:** Een **textarea** waarin de beheerder werkwoorden (infinitieven) invoert.
- **Formaat:** Eén werkwoord per regel, of comma-separated. Beide formaten ondersteunen (parsing: split op newline en comma, dan strip en dedupe).
- **Instructie bij het veld (placeholder of help-tekst):** Bijvoorbeeld: "Eén werkwoord per regel of gescheiden door komma's. Dubbele en lege regels worden genegeerd; invoer wordt omgezet naar kleine letters."
- **Preprocessing (server-side):** Dedupe op infinitive; lowercase en strip; lege regels negeren. Het aantal unieke werkwoorden bepaalt `requested_count` en het aantal VerbImportItems.

### Knoppen / opties

- **"Start generatie"** (primaire actie): Start een job met standaard "vormen + zinnen" (product A en B).
- **Optioneel:** Keuze "Alleen vormen" (alleen product A) via checkbox of radiobutton, zodat geen zinnen-call wordt gedaan. Standaard: vormen + zinnen.

### Gedrag na submit

1. VerbImportJob aanmaken: status `queued`, `input_text` = ruwe tekst, `requested_count` = aantal unieke infinitieven, `created_by` = huidige gebruiker (indien ingelogd).
2. Voor elke unieke infinitive: één VerbImportItem aanmaken (job, infinitive, status `pending`).
3. Celery-task triggeren met `job_id` (bijv. `run_import_job.delay(job.id)`).
4. Response naar de beheerder:
   - **Redirect** naar de job-detailpagina van de zojuist aangemaakte job, of
   - **Melding** "Job gestart. Bekijk de status op [link naar job-detail]."

Geen wachten op de LLM; de request eindigt direct na het queuen van de task.

---

## Job-detailpagina

### Doel

Status van één importjob bekijken: totaal, geslaagd, gefaald; per item de status en eventuele foutmelding; optioneel raw_response voor troubleshooting; mogelijkheid om gefaalde items opnieuw te proberen.

### Te tonen gegevens (job-niveau)

- **Status job:** queued, running, done, failed.
- **Aantal aangevraagd:** requested_count (aantal items).
- **Geslaagd:** Aantal items met status `success`.
- **Gefaald:** Aantal items met status `failed`.
- **Pending:** Aantal items met status `pending` (nog niet verwerkt of in uitvoering).
- **Aangemaakt op:** created_at (en optioneel created_by).
- **Optioneel:** model_name, model_params (voor reproduceerbaarheid).

### Te tonen per item

- **Infinitive** (werkwoord).
- **Status:** pending, success, failed.
- **Error message:** Alleen tonen indien status = failed; kort de validatie- of API-fout.
- **Raw response:** Optioneel — uitklapbaar sectie of link "Toon ruwe response" zodat beheerder de ruwe LLM-output kan zien voor debugging. Let op: kan lang zijn; niet standaard alles tonen.

### Acties

- **"Retry failed items":** Alleen zichtbaar als er ten minste één item met status `failed` is. Gedrag: een nieuwe task queue'n (of de bestaande task met een parameter) die alleen de items met status `failed` opnieuw verwerkt. Items worden dan weer `pending` en opnieuw door de worker gepickt. Bestaande success-items blijven ongewijzigd.

---

## Plaats in de admin

- **Menu:** Een duidelijk menu-item, bijv. "Import werkwoorden" of "Werkwoorden import", of als sub-item onder "Werkwoorden". Liefst alleen zichtbaar voor beheerders.
- **Lijst van jobs:** Overzicht van VerbImportJobs (laatste eerst, bijv. gesorteerd op created_at descending). Kolommen: id of datum, status, requested_count, geslaagd/gefaald counts, created_at.
- **Detail:** Klik op een job opent de job-detailpagina (zoals hierboven).
- **Start nieuwe import:** Vanuit hetzelfde menu of vanaf de jobs-lijst een duidelijke actie "Nieuwe import" of "Bulk generatie starten" die naar het bulk-invoerformulier leidt.

---

## Referenties

- [epic-7-datamodel-import.md](epic-7-datamodel-import.md) — VerbImportJob, VerbImportItem.
- [epic-7-technisch-overzicht.md](epic-7-technisch-overzicht.md) — Flow en task-trigger.
- [epic-7-llm-bulk-import.md](epic-7-llm-bulk-import.md) — Overzicht Epic 7.
