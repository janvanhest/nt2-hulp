# Fasering

Vier fases voor thema, selectie en schaal beheer. Per fase: doel, wat wel/niet in scope, en welk document wordt aangepast (erd, epics, usecases).

---

## Fase 1: Selectie op werkwoord

**Doel:** Beheerder kan bij het genereren van een oefening een selectie maken op basis van werkwoorden (expliciet gekozen werkwoorden of subset), in plaats van alleen "N willekeurige items".

**In scope:**
- Kiezen van werkwoorden (of subset) waaruit vervoegingsoefening wordt samengesteld.
- Bij invulzin-oefening: kiezen van werkwoorden (of subset) waaruit zinnen komen.
- Geen thema in de UI.

**Niet in scope:** Thema, filter op thema, schaal beheer (alles in één lijst blijft mogelijk).

**Documenten:** Aanpassing [v3/erd.md](../v3/erd.md) alleen indien nodig (bijv. geen nieuwe entiteit); [v3/epics.md](../v3/epics.md) Epic 4 uitbreiden (selectie bij genereren); usecases UC3.

---

## Fase 2: Thema als entiteit

**Doel:** Thema als label; koppelen aan werkwoord en/of invulzin; filter op thema bij genereren en bij beheer.

**In scope:**
- Entiteit Thema (naam/label); relaties Werkwoord–Thema, Invulzin–Thema (keuze m:n of n:1 vastleggen).
- Bij genereren: selectie op thema (en/of werkwoorden).
- Bij beheer: filter op thema; thema on-the-fly kunnen aanmaken.

**Niet in scope:** Volledig schaalbaar beheer (Fase 3); AI-generatie (Fase 4).

**Documenten:** [v3/erd.md](../v3/erd.md) uitbreiden met Thema en relaties; [v3/epics.md](../v3/epics.md) Epic 2, 3, 4 aanpassen; [v4/conceptueel-model.md](conceptueel-model.md) en [v4/terminologie.md](terminologie.md) bijwerken.

---

## Fase 3: Beheer schaalbaar

**Doel:** Bij veel werkwoorden en zinnen niet alles in één lijst; zoeken, filter op thema/werkwoord.

**In scope:**
- Zoeken op infinitief, thema.
- Filter op thema en/of werkwoord bij beheer van werkwoorden en invulzinnen.
- Geen "toon alles" als default bij honderden items.

**Niet in scope:** AI-generatie (Fase 4).

**Documenten:** [v3/epics.md](../v3/epics.md) Epic 2, 3 (acceptatiecriteria beheer-UI); eventueel nieuwe usecases of uitbreiding bestaande.

---

## Fase 4: AI-generatie

**Doel:** Oefenmateriaal (werkwoorden, invulzinnen) laten genereren op basis van thema en/of werkwoorden; bestaand materiaal aanvullen met AI-gegenereerd materiaal.

**In scope:**
- Selectie op thema en/of werkwoorden als input voor AI-generatie.
- Nieuw materiaal opslaan en hergebruiken (zoals in [v3/epics.md](../v3/epics.md) Epic 7).

**Documenten:** [v3/epics.md](../v3/epics.md) Epic 7 uitbreiden of nieuwe epic; [v3/adr-003-llm-import-openai-celery.md](../v3/adr-003-llm-import-openai-celery.md) en gerelateerde docs.

---

## Volgorde

1 → 2 → 3 → 4. Fase 1 kan zonder thema; Fase 2 introduceert thema; Fase 3 en 4 bouwen daarop voort.
