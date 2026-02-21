# Use Cases

Sluiten aan op [casus.md](casus.md), [erd.md](erd.md) en [epics.md](epics.md).

## UC1: Vervoegingsoefening (alle vormen invullen)

**Doel:** De gebruiker vult alle vormen van een werkwoord in en kan deze controleren.

**Actoren:** Gebruiker

**Voorwaarden:** Werkwoorden en vormen zijn beschikbaar (uitgewerkt in UC3: Oefening genereren, UC4: Werkwoorden beheren).

**Hoofdscenario (digitaal invullen):**
1. Gebruiker start een vervoegingsoefening.
2. De gebruiker doorloopt de werkwoorden en vult per werkwoord alle vormen in.
3. De gebruiker vraagt het nakijkmodel op.
4. Het systeem toont het nakijkmodel met correcte antwoorden.

**Alternatief A (printen en handmatig invullen):**
1. Gebruiker genereert een oefen-PDF.
2. Gebruiker vult de oefening met de hand in.
3. Gebruiker genereert een nakijk-PDF.
4. Het systeem levert het nakijkmodel als PDF.

Het nakijkmodel wordt bij het genereren van de oefening (UC3) aangemaakt. Digitaal: de gebruiker ziet het in de app. Print: de nakijk-PDF wordt gegenereerd bij export (UC6).

**Alternatieven/uitzonderingen:**
- Als er te weinig werkwoorden zijn, toont het systeem een melding.

**Resultaat:** De gebruiker kan antwoorden controleren met het nakijkmodel.

**Uitbreidingen (v4 / na MVP):**
- Oefenen per thema (selectie op thema bij genereren); zie [fasering.md](fasering.md).
- Logging per gebruiker: resultaten bijhouden; zie docs/voortgang-tracking.

---

## UC2: Invulzin-oefening (werkwoord invullen in zin)

**Doel:** De gebruiker vult het juiste werkwoord in bestaande zinnen.

**Actoren:** Gebruiker

**Voorwaarden:** Zinnen met invulplek en correcte antwoorden zijn beschikbaar.

**Hoofdscenario:**
1. Gebruiker start een invulzin-oefening.
2. Het systeem toont een lijst zinnen met invulplekken.
3. De gebruiker vult per zin het juiste werkwoord in.
4. De gebruiker voltooit de oefening.
5. Het systeem toont het nakijkmodel met correcte antwoorden.

**Alternatieven/uitzonderingen:**
- Als er geen zinnen beschikbaar zijn, toont het systeem een melding.

**Resultaat:** De gebruiker ziet correcte antwoorden en kan controleren.

---

## UC3: Oefening genereren

**Doel:** Een nieuwe oefening genereren op basis van een **selectie** (op werkwoord/infinitief; Fase 2: ook thema) en aantal items.

**Actoren:** Beheerder

**Voorwaarden:** Werkwoorden/zinnen zijn beschikbaar (eventueel binnen gekozen thema).

**Hoofdscenario:**
1. Beheerder kiest oefeningstype (vervoegingsoefening of invulzin-oefening).
2. Beheerder maakt een **selectie**: kiest werkwoorden (infinitieven); daar hangen werkwoordsvormen en invulzinnen aan. (Fase 2: ook thema.) Zie [terminologie.md](terminologie.md) en [epics/epic-4-oefeningen-genereren.md](epics/epic-4-oefeningen-genereren.md).
3. Beheerder selecteert aantal items (rijtje); richtlijn minimaal 5 voor voldoende oefenlengte.
4. Systeem genereert oefening met geordende items en nakijkmodel.

**Resultaat:** Oefening is klaar voor gebruik (zie [terminologie.md](terminologie.md) Selectie).

### Scenario's Fase 1: selectie op werkwoord

**Scenario A – Vervoegingsoefening met gekozen werkwoorden**

1. Beheerder opent "Oefening genereren".
2. Beheerder kiest type **Vervoegingsoefening**.
3. Beheerder maakt een selectie: kiest één of meer werkwoorden uit de lijst van bestaande werkwoorden (bijv. multi-select of checkboxes). Optioneel: keuze "Alle werkwoorden" behouden voor backward compatibility.
4. Beheerder kiest aantal items (bijv. 10).
5. Beheerder bevestigt. Het systeem trekt willekeurig **alleen uit de geselecteerde werkwoorden** (zonder teruglegging), maakt oefening met geordende items en nakijkmodel.
6. Als er geen werkwoorden zijn geselecteerd: systeem toont foutmelding (bijv. "Kies minimaal één werkwoord").
7. Als het gekozen aantal items groter is dan het aantal geselecteerde werkwoorden: systeem toont foutmelding (bijv. "Er zijn maar N werkwoorden geselecteerd; kies maximaal N items.").

**Scenario B – Invulzin-oefening met gekozen werkwoorden**

1. Beheerder opent "Oefening genereren".
2. Beheerder kiest type **Invulzin-oefening**.
3. Beheerder maakt een selectie: kiest één of meer werkwoorden. Alleen **invulzinnen die aan die werkwoorden gekoppeld zijn** komen in de trekking. Optioneel: "Alle zinnen" (huidig gedrag).
4. Beheerder kiest aantal items.
5. Beheerder bevestigt. Het systeem trekt willekeurig alleen uit invulzinnen van de geselecteerde werkwoorden, maakt oefening + nakijkmodel.
6. Geen werkwoorden geselecteerd → foutmelding.
7. Geen invulzinnen beschikbaar voor de geselecteerde werkwoorden → foutmelding (bijv. "Geen invulzinnen voor de gekozen werkwoorden.").
8. Gevraagd aantal items groter dan beschikbare zinnen in selectie → foutmelding met maximaal aantal.

**Randgevallen**

- **Geen werkwoorden in het systeem:** bestaand gedrag: melding en verwijs naar Werkwoorden beheren (blijft van toepassing).
- **"Alle werkwoorden" / geen selectie:** indien UI een optie "Alle werkwoorden" biedt of selectie leeg mag zijn, dan gedrag zoals nu: trekking uit alle werkwoorden resp. alle invulzinnen. Anders: selectie verplicht en foutmelding bij lege selectie.

**Uitbreiding (Fase 2):** Selectie op thema; zie [fasering.md](fasering.md).

---

## UC4: Werkwoorden beheren

**Doel:** Werkwoorden toevoegen, wijzigen of verwijderen; optioneel koppelen aan thema's.

**Actoren:** Beheerder

**Voorwaarden:** Beheerder heeft toegang.

**Hoofdscenario:**
1. Beheerder voegt een werkwoord toe of wijzigt een bestaand werkwoord.
2. Systeem valideert invoer en slaat op.

**Resultaat:** Werkwoordenbestand is bijgewerkt.

**Uitbreiding (v4 Fase 2/3):** Filter op thema; zoeken op infinitief; thema on-the-fly aanmaken bij koppelen. Bij veel werkwoorden: geen "alles in één lijst" maar zoeken/filteren; zie [fasering.md](fasering.md).

---

## UC5: Invulzinnen beheren

**Doel:** Zinnen toevoegen, wijzigen of verwijderen; optioneel koppelen aan thema's.

**Actoren:** Beheerder

**Voorwaarden:** Beheerder heeft toegang.

**Hoofdscenario:**
1. Beheerder voegt een invulzin toe of wijzigt een bestaande invulzin (werkwoord kiezen, sentence_template, answer, answer_form_key).
2. Systeem valideert invoer en slaat op.

**Resultaat:** Zinnenbestand is bijgewerkt.

**Uitbreiding (v4 Fase 2/3):** Filter op thema en/of werkwoord; zoeken; thema on-the-fly aanmaken. Schaalbaar beheer; zie [fasering.md](fasering.md).

---

## UC6: Nakijkmodel exporteren

**Doel:** Antwoorden exporteren om na te kijken (bijv. PDF/Markdown).

**Actoren:** Beheerder

**Voorwaarden:** Oefening is gegenereerd.

**Hoofdscenario:**
1. Beheerder kiest exportformaat.
2. Systeem genereert en exporteert het nakijkmodel.

**Resultaat:** Een bestand met antwoorden is beschikbaar.

---

## UC7: Inloggen en rollen

**Doel:** Gebruikers kunnen inloggen met eenvoudige accounts.

**Actoren:** Gebruiker, Beheerder

**Voorwaarden:** Accounts zijn aangemaakt.

**Hoofdscenario:**
1. Gebruiker logt in.
2. Het systeem herkent de rol (gebruiker of beheerder).
3. Gebruiker kan alleen oefenen; beheerder kan ook beheren.

**Resultaat:** Toegang is beperkt op basis van rol.
