"""
Management command to create or promote the first admin user.

Password: from environment NT2_FIRST_ADMIN_PASSWORD, or prompted interactively.
If a user with the given username already exists, their role is set to admin (idempotent).
"""

import getpass
import os
from argparse import ArgumentParser

# Pyright can miss Django if the IDE interpreter is not the backend venv.
from django.core.management.base import BaseCommand, CommandError  # pyright: ignore[reportMissingImports]

from accounts.models import Role, User


def get_password_from_env_or_prompt() -> str:
    """Return password from NT2_FIRST_ADMIN_PASSWORD or prompt. Never log or return empty."""
    pwd = os.environ.get("NT2_FIRST_ADMIN_PASSWORD", "").strip()
    if pwd:
        return pwd
    return getpass.getpass("Password for admin: ")


class Command(BaseCommand):
    help = (
        "Create the first admin user, or promote an existing user to admin. "
        "Password via env NT2_FIRST_ADMIN_PASSWORD or interactive prompt."
    )

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--username",
            default="admin",
            help="Username for the admin (default: admin).",
        )
        parser.add_argument(
            "--email",
            default="",
            help="Email address (optional).",
        )

    def handle(self, *args: object, **options: object) -> None:
        opts = {k: (v if v is None else str(v).strip()) for k, v in options.items()}
        username = opts.get("username") or ""
        email = opts.get("email") or ""
        if not username:
            raise CommandError("Username must not be empty.")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None

        if user is not None:
            if user.role == Role.beheerder:
                self.stdout.write(
                    self.style.SUCCESS(f"User '{username}' is already admin.")
                )
                return
            user.role = Role.beheerder
            if email:
                user.email = email
            user.save()
            self.stdout.write(self.style.SUCCESS(f"User '{username}' is now admin."))
            return

        password = get_password_from_env_or_prompt()
        if not password:
            raise CommandError("Password must not be empty.")

        User.objects.create_user(
            username=username,
            email=email or "",
            password=password,
            role=Role.beheerder,
        )
        self.stdout.write(self.style.SUCCESS(f"Admin '{username}' has been created."))
