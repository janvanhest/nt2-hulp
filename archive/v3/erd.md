# ERD (concept)

## Doel
Relaties en gegevensstructuur voor de eerste versie (zonder thema’s/badges/logging).

## Entiteiten
- gebruiker
- werkwoord
- werkwoordsvorm
- oefening
- invulzin
- vervoeging_item
- invulzin_item
- nakijkmodel

## Relaties (conceptueel)
- gebruiker 1..* oefening
- oefening 1..* vervoeging_item (alleen als type=vervoeging)
- oefening 1..* invulzin_item (alleen als type=invulzin)
- oefening 0..1 nakijkmodel
- werkwoord 1..1 werkwoordsvorm
- werkwoord 1..* invulzin
- vervoeging_item *..1 werkwoord
- invulzin_item *..1 invulzin

## Diagram (Mermaid)
```mermaid
erDiagram
    GEBRUIKER ||--o{ OEFENING : start
    OEFENING ||--o{ VERVOEGING_ITEM : bevat
    OEFENING ||--o{ INVULZIN_ITEM : bevat
    OEFENING ||--o| NAKIJKMODEL : heeft

    WERKWOORD ||--|| WERKWOORDSVORM : heeft
    WERKWOORD ||--o{ INVULZIN : heeft

    VERVOEGING_ITEM }|--|| WERKWOORD : oefent
    INVULZIN_ITEM }|--|| INVULZIN : oefent

    GEBRUIKER {
      int id PK
      string naam
      string rol
    }

    OEFENING {
      int id PK
      int gebruiker_id FK
      string type "vervoeging|invulzin"
      datetime aangemaakt_op
    }

    VERVOEGING_ITEM {
      int id PK
      int oefening_id FK
      int werkwoord_id FK
      int volgorde
    }

    INVULZIN_ITEM {
      int id PK
      int oefening_id FK
      int invulzin_id FK
      int volgorde
    }

    NAKIJKMODEL {
      int id PK
      int oefening_id FK
      string formaat
    }

    WERKWOORD {
      int id PK
      string infinitive
    }

    WERKWOORDSVORM {
      int id PK
      int werkwoord_id FK
      string tt_ik
      string tt_jij
      string tt_hij
      string vt_ev
      string vt_mv
      string vd
      string vd_hulpwerkwoord
    }

    INVULZIN {
      int id PK
      int werkwoord_id FK
      string sentence_template
      string answer
      string answer_form_key "tt_ik|tt_jij|tt_hij|vt_ev|vt_mv|vd|vd_hulpwerkwoord|infinitive"
    }
```

## Notities
- `OEFENING.type` bepaalt of er `VERVOEGING_ITEM` of `INVULZIN_ITEM` records zijn.
- Dit maakt de relatie tussen oefeningstype en het bijbehorende item expliciet.
- `NAKIJKMODEL` kan simpelweg een export‑record zijn in MVP; details kunnen later worden toegevoegd.
- Rollen kunnen simpel (string) in MVP, later uitbreiden naar tabel.

## Uitbreiding: tracking (na MVP)

Voor voortgang (wat gedaan, beheerst, te herhalen) en later pad/curriculum worden de volgende entiteiten toegevoegd:

- **ExerciseAttempt:** exercise (FK), user (FK), started_at, completed_at (nullable). Eén poging/sessie per gebruiker per oefening.
- **ConjugationItemAnswer:** attempt (FK), conjugation_item (FK), gegeven antwoorden per vorm + correctheid (of gecached correct_count/total_count).
- **FillInSentenceItemAnswer:** attempt (FK), fill_in_sentence_item (FK), given_answer, is_correct.

Relaties: Attempt → Exercise, User; answers → Attempt en het betreffende item (ConjugationItem resp. FillInSentenceItem).

Volledig voorstel: [docs/voortgang-tracking.md](../docs/voortgang-tracking.md).
