"""Unit tests for exercise generation (Epic 4, incl. Fase 1 verb selection)."""

from django.test import TestCase

from accounts.models import Role, User
from exercises.services import (
    NO_SENTENCES_FOR_VERBS_MESSAGE,
    NO_SENTENCES_MESSAGE,
    NO_VERBS_MESSAGE,
    TOO_MANY_ITEMS_VERBS_SELECTED,
    generate_exercise,
)
from exercises.models import ExerciseType
from verbs.models import FillInSentence, Verb, VerbForm


class GenerateExerciseTests(TestCase):
    """Tests for generate_exercise with and without verb_ids."""

    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username="admin",
            password="test",
            role=Role.beheerder,
        )

    def test_conjugation_without_verb_ids_uses_all_verbs(self) -> None:
        VerbForm.objects.create(verb=Verb.objects.create(infinitive="lopen"))
        VerbForm.objects.create(verb=Verb.objects.create(infinitive="zwemmen"))
        VerbForm.objects.create(verb=Verb.objects.create(infinitive="fietsen"))

        exercise = generate_exercise(
            exercise_type=ExerciseType.vervoeging,
            num_items=2,
            user=self.user,
        )
        self.assertEqual(exercise.exercise_type, ExerciseType.vervoeging)
        self.assertEqual(exercise.conjugation_items.count(), 2)
        self.assertEqual(exercise.fill_in_sentence_items.count(), 0)
        verb_ids_in_exercise = [
            item.verb_id for item in exercise.conjugation_items.order_by("order")
        ]
        self.assertEqual(len(verb_ids_in_exercise), 2)
        self.assertEqual(len(set(verb_ids_in_exercise)), 2)

    def test_conjugation_with_verb_ids_uses_only_selected(self) -> None:
        v1 = Verb.objects.create(infinitive="lopen")
        v2 = Verb.objects.create(infinitive="zwemmen")
        v3 = Verb.objects.create(infinitive="fietsen")
        for v in (v1, v2, v3):
            VerbForm.objects.create(verb=v)

        exercise = generate_exercise(
            exercise_type=ExerciseType.vervoeging,
            num_items=2,
            user=self.user,
            verb_ids=[v1.id, v2.id],
        )
        self.assertEqual(exercise.conjugation_items.count(), 2)
        ids_used = {item.verb_id for item in exercise.conjugation_items.all()}
        self.assertEqual(ids_used, {v1.id, v2.id})
        self.assertNotIn(v3.id, ids_used)

    def test_conjugation_no_verbs_raises(self) -> None:
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type=ExerciseType.vervoeging,
                num_items=1,
                user=self.user,
            )
        self.assertEqual(ctx.exception.args[0], NO_VERBS_MESSAGE)

    def test_conjugation_num_items_exceeds_available_raises(self) -> None:
        VerbForm.objects.create(verb=Verb.objects.create(infinitive="lopen"))
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type=ExerciseType.vervoeging,
                num_items=5,
                user=self.user,
            )
        self.assertIn("1 werkwoorden beschikbaar", ctx.exception.args[0])

    def test_conjugation_verb_ids_num_items_exceeds_raises(self) -> None:
        v1 = Verb.objects.create(infinitive="lopen")
        v2 = Verb.objects.create(infinitive="zwemmen")
        VerbForm.objects.create(verb=v1)
        VerbForm.objects.create(verb=v2)
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type=ExerciseType.vervoeging,
                num_items=3,
                user=self.user,
                verb_ids=[v1.id, v2.id],
            )
        self.assertEqual(
            ctx.exception.args[0],
            TOO_MANY_ITEMS_VERBS_SELECTED.format(available=2),
        )

    def test_invulzin_without_verb_ids_uses_all_sentences(self) -> None:
        v = Verb.objects.create(infinitive="lopen")
        VerbForm.objects.create(verb=v)
        FillInSentence.objects.create(
            verb=v,
            sentence_template="Ik ___ elke dag.",
            answer="loop",
        )
        FillInSentence.objects.create(
            verb=v,
            sentence_template="Hij ___ gisteren.",
            answer="liep",
        )

        exercise = generate_exercise(
            exercise_type=ExerciseType.invulzin,
            num_items=2,
            user=self.user,
        )
        self.assertEqual(exercise.exercise_type, ExerciseType.invulzin)
        self.assertEqual(exercise.fill_in_sentence_items.count(), 2)
        self.assertEqual(exercise.conjugation_items.count(), 0)

    def test_invulzin_with_verb_ids_uses_only_sentences_of_those_verbs(self) -> None:
        v1 = Verb.objects.create(infinitive="lopen")
        v2 = Verb.objects.create(infinitive="zwemmen")
        VerbForm.objects.create(verb=v1)
        VerbForm.objects.create(verb=v2)
        s1 = FillInSentence.objects.create(
            verb=v1,
            sentence_template="Ik ___ elke dag.",
            answer="loop",
        )
        FillInSentence.objects.create(
            verb=v2,
            sentence_template="Hij ___ in het zwembad.",
            answer="zwemt",
        )

        exercise = generate_exercise(
            exercise_type=ExerciseType.invulzin,
            num_items=1,
            user=self.user,
            verb_ids=[v1.id],
        )
        self.assertEqual(exercise.fill_in_sentence_items.count(), 1)
        self.assertEqual(
            exercise.fill_in_sentence_items.get().fill_in_sentence_id,
            s1.id,
        )

    def test_invulzin_no_sentences_raises(self) -> None:
        v = Verb.objects.create(infinitive="lopen")
        VerbForm.objects.create(verb=v)
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type=ExerciseType.invulzin,
                num_items=1,
                user=self.user,
            )
        self.assertEqual(ctx.exception.args[0], NO_SENTENCES_MESSAGE)

    def test_invulzin_verb_ids_no_sentences_for_verbs_raises(self) -> None:
        v = Verb.objects.create(infinitive="lopen")
        VerbForm.objects.create(verb=v)
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type=ExerciseType.invulzin,
                num_items=1,
                user=self.user,
                verb_ids=[v.id],
            )
        self.assertEqual(ctx.exception.args[0], NO_SENTENCES_FOR_VERBS_MESSAGE)

    def test_invulzin_num_items_exceeds_available_raises(self) -> None:
        v = Verb.objects.create(infinitive="lopen")
        VerbForm.objects.create(verb=v)
        FillInSentence.objects.create(
            verb=v,
            sentence_template="Ik ___.",
            answer="loop",
        )
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type=ExerciseType.invulzin,
                num_items=5,
                user=self.user,
            )
        self.assertIn("1 invulzinnen beschikbaar", ctx.exception.args[0])

    def test_empty_verb_ids_treated_as_all(self) -> None:
        v = Verb.objects.create(infinitive="lopen")
        VerbForm.objects.create(verb=v)
        FillInSentence.objects.create(
            verb=v,
            sentence_template="Ik ___.",
            answer="loop",
        )
        exercise = generate_exercise(
            exercise_type=ExerciseType.invulzin,
            num_items=1,
            user=self.user,
            verb_ids=[],
        )
        self.assertEqual(exercise.fill_in_sentence_items.count(), 1)

    def test_invalid_exercise_type_raises(self) -> None:
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type="invalid",
                num_items=1,
                user=self.user,
            )
        self.assertEqual(ctx.exception.args[0], "Ongeldig oefeningstype.")

    def test_num_items_less_than_one_raises(self) -> None:
        with self.assertRaises(ValueError) as ctx:
            generate_exercise(
                exercise_type=ExerciseType.vervoeging,
                num_items=0,
                user=self.user,
            )
        self.assertIn("minimaal 1", ctx.exception.args[0])
