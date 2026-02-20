from django.conf import settings
from django.db import models


class ExerciseType(models.TextChoices):
    vervoeging = "vervoeging", "Vervoegingsoefening"
    invulzin = "invulzin", "Invulzin-oefening"


class Exercise(models.Model):
    """Oefening: gegenereerd door beheerder; type bepaalt of er conjugation of fill-in items zijn."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exercises",
    )
    exercise_type = models.CharField(
        max_length=20,
        choices=ExerciseType.choices,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Oefening"
        verbose_name_plural = "Oefeningen"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Oefening {self.get_exercise_type_display()} ({self.created_at.date()})"


class ConjugationItem(models.Model):
    """Item in een vervoegingsoefening: één werkwoord met vaste volgorde."""

    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="conjugation_items",
    )
    verb = models.ForeignKey(
        "verbs.Verb",
        on_delete=models.CASCADE,
        related_name="+",
    )
    order = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "Vervoeging-item"
        verbose_name_plural = "Vervoeging-items"
        ordering = ["exercise", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["exercise", "order"],
                name="exercises_conjugationitem_unique_exercise_order",
            )
        ]

    def __str__(self) -> str:
        return f"{self.exercise} – {self.verb.infinitive} (#{self.order})"


class FillInSentenceItem(models.Model):
    """Item in een invulzin-oefening: één invulzin met vaste volgorde."""

    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name="fill_in_sentence_items",
    )
    fill_in_sentence = models.ForeignKey(
        "verbs.FillInSentence",
        on_delete=models.CASCADE,
        related_name="+",
    )
    order = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "Invulzin-item"
        verbose_name_plural = "Invulzin-items"
        ordering = ["exercise", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["exercise", "order"],
                name="exercises_fillinsentenceitem_unique_exercise_order",
            )
        ]

    def __str__(self) -> str:
        return f"{self.exercise} – zin #{self.order}"


class Nakijkmodel(models.Model):
    """Nakijkmodel bij een oefening; aangemaakt bij generatie (Epic 4)."""

    exercise = models.OneToOneField(
        Exercise,
        on_delete=models.CASCADE,
        related_name="answer_key",
    )
    format = models.CharField(max_length=20, default="default")

    class Meta:
        verbose_name = "Nakijkmodel"
        verbose_name_plural = "Nakijkmodellen"

    def __str__(self) -> str:
        return f"Nakijkmodel {self.exercise_id}"
