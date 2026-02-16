from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.TextChoices):
    gebruiker = "gebruiker", "Gebruiker"
    beheerder = "beheerder", "Beheerder"


class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.gebruiker,
    )
