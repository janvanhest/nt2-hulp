from io import StringIO

from django.core.management import call_command
from django.test import TestCase

from .models import AnswerFormKey, FillInSentence, Verb, VerbForm, VdHulp
from .serializers import VerbSerializer


class FillInSentenceAnswerFormKeyTests(TestCase):
    """Tests for answer_form_key on FillInSentence (Epic 3 extension)."""

    def setUp(self) -> None:
        self.verb = Verb.objects.create(infinitive="lopen")
        VerbForm.objects.create(verb=self.verb)

    def test_create_with_answer_form_key(self) -> None:
        sentence = FillInSentence.objects.create(
            verb=self.verb,
            sentence_template="Ik ___ elke dag.",
            answer="loop",
            answer_form_key=AnswerFormKey.tt_ik,
        )
        sentence.refresh_from_db()
        self.assertEqual(sentence.answer_form_key, AnswerFormKey.tt_ik)
        self.assertEqual(sentence.answer, "loop")

    def test_create_without_answer_form_key_blank_allowed(self) -> None:
        sentence = FillInSentence.objects.create(
            verb=self.verb,
            sentence_template="Hij ___ gisteren.",
            answer="liep",
        )
        sentence.refresh_from_db()
        self.assertEqual(sentence.answer_form_key, "")
        self.assertEqual(sentence.answer, "liep")

    def test_create_with_infinitive_form_key(self) -> None:
        sentence = FillInSentence.objects.create(
            verb=self.verb,
            sentence_template="Ik wil ___.",
            answer="lopen",
            answer_form_key=AnswerFormKey.infinitive,
        )
        sentence.refresh_from_db()
        self.assertEqual(sentence.answer_form_key, AnswerFormKey.infinitive)


class VerbInfinitiveUniquenessTests(TestCase):
    """Tests for unique infinitive (Epic 2). Create and update must reject duplicates."""

    def test_create_rejects_duplicate_infinitive(self) -> None:
        serializer = VerbSerializer(data={"infinitive": "lopen"})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        self.assertEqual(Verb.objects.count(), 1)

        duplicate = VerbSerializer(data={"infinitive": "lopen"})
        self.assertFalse(duplicate.is_valid())
        self.assertIn("infinitive", duplicate.errors)
        msg = str(duplicate.errors["infinitive"])
        self.assertTrue(
            "bestaat al" in msg or "already exists" in msg,
            f"Expected uniqueness message, got: {msg}",
        )
        self.assertEqual(Verb.objects.count(), 1)

    def test_update_rejects_changing_infinitive_to_existing_one(self) -> None:
        lopen = Verb.objects.create(infinitive="lopen")
        VerbForm.objects.create(verb=lopen)
        zwemmen = Verb.objects.create(infinitive="zwemmen")
        VerbForm.objects.create(verb=zwemmen)
        self.assertEqual(Verb.objects.count(), 2)

        serializer = VerbSerializer(
            instance=lopen,
            data={"infinitive": "zwemmen"},
            partial=True,
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("infinitive", serializer.errors)
        msg = str(serializer.errors["infinitive"])
        self.assertTrue(
            "bestaat al" in msg or "already exists" in msg,
            f"Expected uniqueness message, got: {msg}",
        )

        lopen.refresh_from_db()
        self.assertEqual(lopen.infinitive, "lopen")
        self.assertEqual(Verb.objects.get(infinitive="zwemmen").id, zwemmen.id)


class SeedInitialDataCommandTests(TestCase):
    """Tests for seed_initial_data management command."""

    def test_creates_ten_verbs_with_forms_and_sentences(self) -> None:
        out = StringIO()
        call_command("seed_initial_data", stdout=out)
        self.assertEqual(Verb.objects.count(), 10)
        expected = {
            "lopen", "zwemmen", "fietsen", "komen", "gaan", "doen",
            "zien", "maken", "lezen", "schrijven",
        }
        infinitives = {v.infinitive for v in Verb.objects.all()}
        self.assertEqual(infinitives, expected)
        for verb in Verb.objects.all():
            self.assertIsNotNone(verb.forms)
            self.assertGreater(verb.fill_in_sentences.count(), 0)
        lopen = Verb.objects.get(infinitive="lopen")
        self.assertEqual(lopen.forms.tt_ik, "loop")
        self.assertEqual(lopen.forms.vd, "gelopen")
        self.assertEqual(lopen.forms.vd_hulpwerkwoord, VdHulp.zijn.value)

    def test_idempotent_second_run_creates_nothing(self) -> None:
        call_command("seed_initial_data")
        self.assertEqual(Verb.objects.count(), 10)
        call_command("seed_initial_data")
        self.assertEqual(Verb.objects.count(), 10)
