"""
Management command to create or promote the first beheerder (admin) user.

Password: from environment NT2_FIRST_ADMIN_PASSWORD, or prompted interactively.
If a user with the given username already exists, their role is set to beheerder (idempotent).
"""
import getpass
from django.core.management.base import BaseCommand, CommandError

from accounts.models import Role, User


def get_password_from_env_or_prompt() -> str:
    """Return password from NT2_FIRST_ADMIN_PASSWORD or prompt. Never log or return empty."""
    import os

    pwd = os.environ.get("NT2_FIRST_ADMIN_PASSWORD", "").strip()
    if pwd:
        return pwd
    return getpass.getpass("Wachtwoord voor beheerder: ")


class Command(BaseCommand):
    help = (
        "Maak een eerste beheerder aan, of zet bestaande gebruiker op rol beheerder. "
        "Wachtwoord via env NT2_FIRST_ADMIN_PASSWORD of interactieve prompt."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            default="beheerder",
            help="Gebruikersnaam voor de beheerder (default: beheerder).",
        )
        parser.add_argument(
            "--email",
            default="",
            help="E-mailadres (optioneel).",
        )

    def handle(self, *args, **options):
        username = options["username"].strip()
        email = (options["email"] or "").strip()
        if not username:
            raise CommandError("Username mag niet leeg zijn.")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None

        if user is not None:
            if user.role == Role.beheerder:
                self.stdout.write(
                    self.style.SUCCESS(f"Gebruiker '{username}' is al beheerder.")
                )
                return
            user.role = Role.beheerder
            if email:
                user.email = email
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f"Gebruiker '{username}' is nu beheerder.")
            )
            return

        password = get_password_from_env_or_prompt()
        if not password:
            raise CommandError("Wachtwoord mag niet leeg zijn.")

        User.objects.create_user(
            username=username,
            email=email or "",
            password=password,
            role=Role.beheerder,
        )
        self.stdout.write(
            self.style.SUCCESS(f"Beheerder '{username}' is aangemaakt.")
        )
