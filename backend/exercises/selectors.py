"""Read-only queries for exercise generation. Single responsibility: provide counts and data for the service."""

from verbs.models import FillInSentence, Verb


def get_available_verb_count() -> int:
    """Aantal werkwoorden beschikbaar voor een vervoegingsoefening."""
    return Verb.objects.count()


def get_available_fill_in_sentence_count() -> int:
    """Aantal invulzinnen beschikbaar voor een invulzin-oefening."""
    return FillInSentence.objects.count()
