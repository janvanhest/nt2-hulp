# Testen – Django backend

De backend gebruikt het [Django testframework](https://docs.djangoproject.com/en/stable/topics/testing/), dat op Python’s `unittest` is gebouwd. Tests zorgen voor geïsoleerde runs (eigen testdatabase, geen productiedata) en kunnen models, serializers, views en management commands dekken.

## Testrunner

- **Commando:** `python manage.py test`
- **Database:** Django maakt voor testruns een aparte database (standaard `test_<DATABASE_NAME>`), voert migraties daarop uit en gooit die na de run weer weg. Productiedata blijft onaangeroerd.
- **Volgorde:** Tests worden normaal gesproken per app uitgevoerd; binnen een module in alfabetische volgorde van testclasses en testmethodes (tenzij je `--reverse` of specifieke labels gebruikt).

## Waar staan de tests?

Per Django-app staat de testcode in:

- **`<app>/tests.py`** – één bestand met alle tests van die app, of  
- **`<app>/tests/`** – een package met `__init__.py` en eventueel meerdere modules (bijv. `test_models.py`, `test_serializers.py`). In dat geval importeert Django alle `TestCase`-subclasses uit die package.

Voorbeelden in deze repo: `verbs/tests.py`, `accounts/tests.py`, `exercises/tests.py`.

## Tests uitvoeren

Alle commando’s hieronder draai je met `python manage.py test`. Vanuit de **backend**-map, of in Docker via de **web**-container.

### Alle tests

```bash
python manage.py test
```

### Eén app

```bash
python manage.py test verbs
python manage.py test accounts
python manage.py test exercises
```

### Eén testclass

```bash
python manage.py test verbs.tests.VerbInfinitiveUniquenessTests
```

### Eén testmethode

```bash
python manage.py test verbs.tests.VerbInfinitiveUniquenessTests.test_create_rejects_duplicate_infinitive
```

### Handige opties

| Optie | Betekenis |
|-------|-----------|
| `-v 2` | Meer output (per test) |
| `--keepdb` | Testdatabase niet verwijderen na run (sneller bij herhaald draaien) |
| `--parallel` | Tests parallel uitvoeren (meerdere processen) |
| `--failfast` | Stoppen bij de eerste fout |

Voorbeeld met meer verbose output:

```bash
python manage.py test verbs -v 2
```

## Tests in Docker

Als de backend in Docker draait, voer je de testrunner **in de web-container** uit.

Vanuit de map **`backend/`**:

```bash
docker compose run --rm web python manage.py test
docker compose run --rm web python manage.py test verbs -v 2
```

Als de containers al draaien (`docker compose up -d`):

```bash
docker compose exec web python manage.py test
docker compose exec web python manage.py test verbs.tests.VerbInfinitiveUniquenessTests -v 2
```

Vanuit de **repo-root**:

```bash
docker compose -f backend/docker-compose.yml run --rm web python manage.py test
```

## Soorten tests

- **`django.test.TestCase`** – Meest gebruikt. Elke testmethode draait in een transactie die na de test wordt teruggedraaid, dus de database is per test schoon. Ondersteunt o.a. `self.client` voor request-tests.
- **`django.test.TransactionTestCase`** – Transacties worden niet teruggedraaid; handig als je expliciet commit-gedrag of database-constraints wilt testen. Langzamer dan `TestCase`.
- **`django.test.SimpleTestCase`** – Geen database; voor pure logica, utils of code die geen DB nodig heeft.

Voor model-, serializer- en API-tests volstaat doorgaans **`TestCase`**.

## Voorbeeld: app-tests (verbs)

In `verbs/tests.py` staan onder andere:

- **FillInSentenceAnswerFormKeyTests** – `answer_form_key` op `FillInSentence` (Epic 3).
- **VerbInfinitiveUniquenessTests** – Uniciteit van de infinitief bij create en update (Epic 2).
- **SeedInitialDataCommandTests** – Management command `seed_initial_data`.

Structuur: subclasses van `TestCase`, met `setUp()` waar nodig en testmethodes die `assert*` gebruiken. Serializer-validatie wordt getest door `VerbSerializer(data=...)` te gebruiken, `is_valid()` aan te roepen en op `errors` te asserten.

## Aanpak en conventies

- **Eén gedrag per test:** Eén testmethode test één ding; naam maakt duidelijk wat er getest wordt (bijv. `test_create_rejects_duplicate_infinitive`).
- **Geen productiedata:** Gebruik in tests alleen data die je in de test (of in `setUp`) zelf aanmaakt.
- **Deterministisch:** Geen flaky tests; geen afhankelijkheid van volgorde of externe services tenzij expliciet bedoeld (bijv. geïsoleerde integratietests).
- **Bij wijzigingen in gedrag:** Voeg tests toe of pas bestaande tests aan zodat het gewenste gedrag gedekt blijft (zie ook projectregels over tests bij gedragswijzigingen).

Voor lint, typecheck en formattering van de codebase: zie [backend/README.md – Lint / format / typecheck](../backend/README.md).
