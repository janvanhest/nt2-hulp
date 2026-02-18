from django.test import TestCase

from .models import AnswerFormKey, FillInSentence, Verb, VerbForm


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
