# Use Cases

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
1. Gebruiker genereert een oefen‑PDF.
2. Gebruiker vult de oefening met de hand in.
3. Gebruiker genereert een nakijk‑PDF.
4. Het systeem levert het nakijkmodel als PDF.

Het nakijkmodel (correcte antwoorden) wordt bij het genereren van de oefening (UC3) aangemaakt. Digitaal: de gebruiker ziet het in de app. Print: de nakijk‑PDF wordt gegenereerd bij export (UC6).

**Alternatieven/uitzonderingen:**
- Als er te weinig werkwoorden zijn, toont het systeem een melding.

**Resultaat:** De gebruiker kan antwoorden controleren met het nakijkmodel.

**Uitbreidingen (na MVP):**
- **Indeling:** Oefenen per thema, categorie of week (niet alleen alle werkwoorden).
- **Thema’s:** Bepaalde thema’s door de gebruiker laten kiezen, of thema’s aan een gebruiker koppelen.
- **Logging per gebruiker:** Resultaten bijhouden: welke werkwoorden en thema’s zijn behandeld, wat ging goed, wat ging fout, en wat herhaald moet worden.

**Toekomst (niet‑MVP):**
- Ingescande, handgeschreven antwoorden laten nakijken via OCR/AI.

## UC2: Invulzin‑oefening (werkwoord invullen in zin)
**Doel:** De gebruiker vult het juiste werkwoord in bestaande zinnen.

**Actoren:** Gebruiker

**Voorwaarden:** Zinnen met invulplek en correcte antwoorden zijn beschikbaar.

**Hoofdscenario:**
1. Gebruiker start een invulzin‑oefening.
2. Het systeem toont een lijst zinnen met invulplekken.
3. De gebruiker vult per zin het juiste werkwoord in.
4. De gebruiker voltooit de oefening.
5. Het systeem toont het nakijkmodel met correcte antwoorden.

**Alternatieven/uitzonderingen:**
- Als er geen zinnen beschikbaar zijn, toont het systeem een melding.

**Resultaat:** De gebruiker ziet correcte antwoorden en kan controleren.

## UC3: Oefening genereren
**Doel:** Een nieuwe oefening genereren op basis van beschikbare data.

**Actoren:** Beheerder

**Voorwaarden:** Werkwoorden/zinnen zijn beschikbaar.

**Hoofdscenario:**
1. Beheerder kiest oefeningstype (vervoegingsoefening of invulzin‑oefening).
2. Beheerder selecteert aantal items (rijtje) en optionele filters.
3. Systeem genereert oefening en optioneel nakijkmodel.

**Resultaat:** Oefening is klaar voor gebruik.

## UC4: Werkwoorden beheren
**Doel:** Werkwoorden toevoegen, wijzigen of verwijderen.

**Actoren:** Beheerder

**Voorwaarden:** Beheerder heeft toegang.

**Hoofdscenario:**
1. Beheerder voegt een werkwoord toe of wijzigt een bestaand werkwoord.
2. Systeem valideert invoer en slaat op.

**Resultaat:** Werkwoordenbestand is bijgewerkt.

## UC5: Invulzinnen beheren
**Doel:** Zinnen toevoegen, wijzigen of verwijderen.

**Actoren:** Beheerder

**Voorwaarden:** Beheerder heeft toegang.

**Hoofdscenario:**
1. Beheerder voegt een invulzin toe of wijzigt een bestaande invulzin.
2. Systeem valideert invoer en slaat op.

**Resultaat:** Zinnenbestand is bijgewerkt.

## UC6: Nakijkmodel exporteren
**Doel:** Antwoorden exporteren om na te kijken (bijv. PDF/Markdown).

**Actoren:** Beheerder

**Voorwaarden:** Oefening is gegenereerd.

**Hoofdscenario:**
1. Beheerder kiest exportformaat.
2. Systeem genereert en exporteert het nakijkmodel.

**Resultaat:** Een bestand met antwoorden is beschikbaar.

## UC7: Inloggen en rollen
**Doel:** Gebruikers kunnen inloggen met eenvoudige accounts.

**Actoren:** Gebruiker, Beheerder

**Voorwaarden:** Accounts zijn aangemaakt.

**Hoofdscenario:**
1. Gebruiker logt in.
2. Het systeem herkent de rol (gebruiker of beheerder).
3. Gebruiker kan alleen oefenen; beheerder kan ook beheren.

**Resultaat:** Toegang is beperkt op basis van rol.
