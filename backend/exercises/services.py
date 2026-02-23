"""Service: generate exercise (single use case). Single responsibility: create exercise + items + nakijkmodel in one transaction."""

import random
from typing import TYPE_CHECKING, Optional

from django.db import transaction

from .models import ConjugationItem, Exercise, ExerciseType, FillInSentenceItem, Nakijkmodel
from .selectors import (
    get_available_fill_in_sentence_count,
    get_available_fill_in_sentence_ids,
    get_available_verb_count,
    get_available_verb_ids,
)

if TYPE_CHECKING:
    from accounts.models import User

NO_VERBS_MESSAGE = "Er zijn geen werkwoorden beschikbaar voor een vervoegingsoefening."
NO_SENTENCES_MESSAGE = "Geen invulzinnen beschikbaar voor een invulzin-oefening."
NO_SENTENCES_FOR_VERBS_MESSAGE = "Geen invulzinnen voor de gekozen werkwoorden."
TOO_MANY_ITEMS_VERBS = "Er zijn maar {available} werkwoorden beschikbaar; kies maximaal {available} items."
TOO_MANY_ITEMS_VERBS_SELECTED = "Er zijn maar {available} werkwoorden geselecteerd; kies maximaal {available} items."
TOO_MANY_ITEMS_SENTENCES = "Er zijn maar {available} invulzinnen beschikbaar; kies maximaal {available} items."


def _normalize_verb_ids(verb_ids: Optional[list[int]]) -> Optional[list[int]]:
    """None of lege lijst = alle werkwoorden; anders de gegeven ids."""
    if verb_ids is None or len(verb_ids) == 0:
        return None
    return verb_ids


def generate_exercise(
    exercise_type: str,
    num_items: int,
    user: "User",
    verb_ids: Optional[list[int]] = None,
) -> Exercise:
    """
    Create one exercise with ordered items and nakijkmodel. Atomic.
    verb_ids: optional list of verb ids; None or empty = all verbs/sentences.
    Raises ValueError with a user-facing message when validation fails.
    """
    if exercise_type not in (ExerciseType.vervoeging, ExerciseType.invulzin):
        raise ValueError("Ongeldig oefeningstype.")
    if num_items < 1:
        raise ValueError("Aantal items moet minimaal 1 zijn.")

    filter_verbs = _normalize_verb_ids(verb_ids)

    if exercise_type == ExerciseType.vervoeging:
        return _generate_conjugation_exercise(num_items, user, filter_verbs)
    return _generate_fill_in_sentence_exercise(num_items, user, filter_verbs)


def _generate_conjugation_exercise(
    num_items: int,
    user: "User",
    verb_ids_filter: Optional[list[int]],
) -> Exercise:
    available = get_available_verb_count(verb_ids_filter)
    if available == 0:
        raise ValueError(NO_VERBS_MESSAGE)
    if num_items > available:
        msg = (
            TOO_MANY_ITEMS_VERBS_SELECTED.format(available=available)
            if verb_ids_filter
            else TOO_MANY_ITEMS_VERBS.format(available=available)
        )
        raise ValueError(msg)

    verb_ids_pool = get_available_verb_ids(verb_ids_filter)
    chosen_ids = random.sample(verb_ids_pool, num_items)

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


def _generate_fill_in_sentence_exercise(
    num_items: int,
    user: "User",
    verb_ids_filter: Optional[list[int]],
) -> Exercise:
    available = get_available_fill_in_sentence_count(verb_ids_filter)
    if available == 0:
        msg = (
            NO_SENTENCES_FOR_VERBS_MESSAGE
            if verb_ids_filter
            else NO_SENTENCES_MESSAGE
        )
        raise ValueError(msg)
    if num_items > available:
        raise ValueError(TOO_MANY_ITEMS_SENTENCES.format(available=available))

    sentence_ids = get_available_fill_in_sentence_ids(verb_ids_filter)
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
