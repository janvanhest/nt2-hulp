# Epic 4: Oefeningen Genereren

## Samenvatting

De beheerder genereert een oefening door type (vervoegingsoefening of invulzin-oefening) en aantal items te kiezen. Het systeem maakt één oefening aan met geordende items en een nakijkmodel. De oefening is daarna beschikbaar voor in-app oefenen (Epic 5) en voor export (Epic 6).

Bouwt voort op Epic 0 (Foundation), Epic 1 (Rollen & autorisatie), **Epic 2 (Werkwoorden Beheren)** en **Epic 3 (Invulzinnen Beheren)**.

### Scope

| Wat | In scope | Toelichting |
|-----|----------|-------------|
| Type kiezen | Ja | Vervoegingsoefening of invulzin-oefening (UC3). |
| Aantal items kiezen | Ja | Een "rijtje"; min 1, max = beschikbare werkwoorden/zinnen. |
| Oefening + items aanmaken | Ja | Geordende items (zie `../erd.md`); random selectie zonder teruglegging. |
| Nakijkmodel bij aanmaak | Ja | Bij genereren wordt het nakijkmodel aangemaakt; direct beschikbaar voor Epic 5 en Epic 6. |
| Melding bij te weinig data | Ja | Geen werkwoorden / geen zinnen / gevraagd aantal > beschikbaar. |
| Contract Epic 3 (geen zinnen) | Ja | Bij invulzin-oefening zonder beschikbare zinnen: API-fout met duidelijke message; frontend toont deze. |
| Autorisatie | Ja | Alleen beheerder; hergebruik beheer-permissies. |

### Twee gebruiksmomenten (verduidelijking, geen scope-wijziging)

- **In de app (Epic 5):** De gegenereerde oefening wordt in de app gestart; de gebruiker vult in en roept het nakijkmodel op. Het nakijkmodel is al bij generatie aangemaakt.
- **PDF (Epic 6):** De oefening-PDF en nakijk-PDF worden op het moment van export gegenereerd; het onderliggende nakijkmodel bestaat al in de database.

### Wanneer nakijkmodel

Het nakijkmodel (correcte antwoorden) wordt **bij het aanmaken van de oefening (Epic 4)** aangemaakt. Zo is het direct beschikbaar voor het tonen in de app (Epic 5) en voor export (Epic 6).

### Acceptatiecriteria (uit `../epics.md`)

1. Beheerder kan kiezen tussen vervoegingsoefening en invulzin-oefening (UC3).
2. Beheerder kan het aantal items kiezen (een "rijtje").
3. Het systeem maakt een oefening aan met geordende items (zie `../erd.md`).
4. Het systeem toont een melding als er te weinig items beschikbaar zijn.

### Relevante bronnen

- **Use case:** UC3 (Oefening genereren) in `../usecases.md`.
- **ERD:** `OEFENING`, `VERVOEGING_ITEM`, `INVULZIN_ITEM`, `NAKIJKMODEL` in `../erd.md`.
- **Contract:** Foutmelding bij invulzin-oefening zonder zinnen — [epic-3-invulzinnen-beheren.md](epic-3-invulzinnen-beheren.md#5-contract-foutmelding-bij-invulzin-oefening-zonder-zinnen-epic-45).

---

## Relatie met tracking

Epic 4 levert alleen **Exercise + items + nakijkmodel**. Voortgang (wat gedaan, beheerst, herhalen) wordt later toegevoegd via tracking (ExerciseAttempt, item-antwoorden) zoals beschreven in [docs/voortgang-tracking.md](../../docs/voortgang-tracking.md). Dat vereist **geen wijziging** van Epic 4: dezelfde oefening en items worden gebruikt; tracking voegt alleen attempts en antwoorden toe. Het implementatieplan voor Epic 4 (vier fases: data model, service/API, frontend hook, frontend formulier) blijft van toepassing; geen aanpassing van de fases nodig.
