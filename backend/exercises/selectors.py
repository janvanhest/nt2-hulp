"""Read-only queries for exercise generation. Single responsibility: provide counts and data for the service."""

from typing import Optional

from verbs.models import FillInSentence, Verb


def get_available_verb_count(verb_ids: Optional[list[int]] = None) -> int:
    """Aantal werkwoorden beschikbaar voor een vervoegingsoefening (optioneel beperkt tot verb_ids)."""
    qs = Verb.objects.all()
    if verb_ids is not None and len(verb_ids) > 0:
        qs = qs.filter(id__in=verb_ids)
    return qs.count()


def get_available_fill_in_sentence_count(verb_ids: Optional[list[int]] = None) -> int:
    """Aantal invulzinnen beschikbaar (optioneel alleen voor de gegeven werkwoorden)."""
    qs = FillInSentence.objects.all()
    if verb_ids is not None and len(verb_ids) > 0:
        qs = qs.filter(verb_id__in=verb_ids)
    return qs.count()


def get_available_verb_ids(verb_ids: Optional[list[int]] = None) -> list[int]:
    """Lijst van werkwoord-ids om uit te trekken (alle of beperkt tot verb_ids)."""
    qs = Verb.objects.values_list("id", flat=True)
    if verb_ids is not None and len(verb_ids) > 0:
        qs = qs.filter(id__in=verb_ids)
    return list(qs)


def get_available_fill_in_sentence_ids(verb_ids: Optional[list[int]] = None) -> list[int]:
    """Lijst van invulzin-ids om uit te trekken (alle of alleen voor verb_ids)."""
    qs = FillInSentence.objects.values_list("id", flat=True)
    if verb_ids is not None and len(verb_ids) > 0:
        qs = qs.filter(verb_id__in=verb_ids)
    return list(qs)
