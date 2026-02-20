"""Service: generate exercise (single use case). Single responsibility: create exercise + items + nakijkmodel in one transaction."""

import random
from typing import TYPE_CHECKING

from django.db import transaction

from .models import ConjugationItem, Exercise, ExerciseType, FillInSentenceItem, Nakijkmodel
from .selectors import get_available_fill_in_sentence_count, get_available_verb_count

if TYPE_CHECKING:
    from accounts.models import User

NO_VERBS_MESSAGE = "Er zijn geen werkwoorden beschikbaar voor een vervoegingsoefening."
NO_SENTENCES_MESSAGE = "Geen invulzinnen beschikbaar voor een invulzin-oefening."
TOO_MANY_ITEMS_VERBS = "Er zijn maar {available} werkwoorden beschikbaar; kies maximaal {available} items."
TOO_MANY_ITEMS_SENTENCES = "Er zijn maar {available} invulzinnen beschikbaar; kies maximaal {available} items."


def generate_exercise(exercise_type: str, num_items: int, user: "User") -> Exercise:
    """
    Create one exercise with ordered items and nakijkmodel. Atomic.
    Raises ValueError with a user-facing message when validation fails.
    """
    if exercise_type not in (ExerciseType.vervoeging, ExerciseType.invulzin):
        raise ValueError("Ongeldig oefeningstype.")
    if num_items < 1:
        raise ValueError("Aantal items moet minimaal 1 zijn.")

    if exercise_type == ExerciseType.vervoeging:
        return _generate_conjugation_exercise(num_items, user)
    return _generate_fill_in_sentence_exercise(num_items, user)


def _generate_conjugation_exercise(num_items: int, user: "User") -> Exercise:
    from verbs.models import Verb

    available = get_available_verb_count()
    if available == 0:
        raise ValueError(NO_VERBS_MESSAGE)
    if num_items > available:
        raise ValueError(TOO_MANY_ITEMS_VERBS.format(available=available))

    verb_ids = list(Verb.objects.values_list("id", flat=True))
    chosen_ids = random.sample(verb_ids, num_items)

    with transaction.atomic():
        exercise = Exercise.objects.create(
            user=user,
            exercise_type=ExerciseType.vervoeging,
        )
        for order, verb_id in enumerate(chosen_ids, start=1):
            ConjugationItem.objects.create(
                exercise=exercise,
                verb_id=verb_id,
                order=order,
            )
        Nakijkmodel.objects.create(exercise=exercise, format="default")
    return exercise


def _generate_fill_in_sentence_exercise(num_items: int, user: "User") -> Exercise:
    from verbs.models import FillInSentence

    available = get_available_fill_in_sentence_count()
    if available == 0:
        raise ValueError(NO_SENTENCES_MESSAGE)
    if num_items > available:
        raise ValueError(TOO_MANY_ITEMS_SENTENCES.format(available=available))

    sentence_ids = list(FillInSentence.objects.values_list("id", flat=True))
    chosen_ids = random.sample(sentence_ids, num_items)

    with transaction.atomic():
        exercise = Exercise.objects.create(
            user=user,
            exercise_type=ExerciseType.invulzin,
        )
        for order, sentence_id in enumerate(chosen_ids, start=1):
            FillInSentenceItem.objects.create(
                exercise=exercise,
                fill_in_sentence_id=sentence_id,
                order=order,
            )
        Nakijkmodel.objects.create(exercise=exercise, format="default")
    return exercise
