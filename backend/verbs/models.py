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


class AnswerFormKey(models.TextChoices):
    """Werkwoordsvorm van het antwoord in een invulzin (sluit aan op VerbForm + infinitief)."""

    tt_ik = "tt_ik", "ik (tt)"
    tt_jij = "tt_jij", "jij (tt)"
    tt_hij = "tt_hij", "hij/zij/het (tt)"
    vt_ev = "vt_ev", "hij/zij/het (vt)"
    vt_mv = "vt_mv", "wij/jullie/zij (vt mv)"
    vd = "vd", "voltooid deelwoord"
    vd_hulpwerkwoord = "vd_hulpwerkwoord", "hulpwerkwoord"
    infinitive = "infinitive", "Infinitief (heel werkwoord)"


class FillInSentence(models.Model):
    """Invulzin: zin met invulplek, gekoppeld aan een werkwoord."""

    verb = models.ForeignKey(
        Verb,
        on_delete=models.CASCADE,
        related_name="fill_in_sentences",
    )
    sentence_template = models.CharField(max_length=500)
    answer = models.CharField(max_length=100)
    answer_form_key = models.CharField(
        max_length=20,
        choices=AnswerFormKey.choices,
        blank=True,
        default="",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Invulzin"
        verbose_name_plural = "Invulzinnen"

    def __str__(self) -> str:
        return (
            f"{self.sentence_template[:50]}…"
            if len(self.sentence_template) > 50
            else self.sentence_template
        )
