from django.db import models


class VdHulp(models.TextChoices):
    hebben = "hebben", "hebben"
    zijn = "zijn", "zijn"


class Verb(models.Model):
    infinitive = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Werkwoord"
        verbose_name_plural = "Werkwoorden"

    def __str__(self) -> str:
        return self.infinitive


class VerbForm(models.Model):
    verb = models.OneToOneField(
        Verb,
        on_delete=models.CASCADE,
        related_name="forms",
    )
    tt_ik = models.CharField(max_length=100, blank=True, default="")
    tt_jij = models.CharField(max_length=100, blank=True, default="")
    tt_hij = models.CharField(max_length=100, blank=True, default="")
    vt_ev = models.CharField(max_length=100, blank=True, default="")
    vt_mv = models.CharField(max_length=100, blank=True, default="")
    vd = models.CharField(max_length=100, blank=True, default="")
    vd_hulpwerkwoord = models.CharField(
        max_length=10,
        choices=VdHulp.choices,
        blank=True,
        default="",
    )

    class Meta:
        verbose_name = "Werkwoordsvorm"
        verbose_name_plural = "Werkwoordsvormen"

    def __str__(self) -> str:
        return f"Vormen van {self.verb.infinitive}"
