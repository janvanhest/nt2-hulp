import os
from io import StringIO
from unittest.mock import patch

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

from .models import Role, User


class CreateFirstAdminCommandTests(TestCase):
    """Tests for create_first_admin management command (Epic 0)."""

    def setUp(self) -> None:
        self._saved_env_password = os.environ.pop("NT2_FIRST_ADMIN_PASSWORD", None)

    def tearDown(self) -> None:
        if self._saved_env_password is not None:
            os.environ["NT2_FIRST_ADMIN_PASSWORD"] = self._saved_env_password
        elif "NT2_FIRST_ADMIN_PASSWORD" in os.environ:
            del os.environ["NT2_FIRST_ADMIN_PASSWORD"]

    def test_creates_admin_and_can_login(self) -> None:
        os.environ["NT2_FIRST_ADMIN_PASSWORD"] = "testpass123"
        out = StringIO()
        call_command("create_first_admin", "--username", "admin1", stdout=out)
        self.assertIn("created", out.getvalue())

        user = User.objects.get(username="admin1")
        self.assertEqual(user.role, Role.beheerder)
        self.assertTrue(user.check_password("testpass123"))

    def test_existing_user_promoted_to_admin(self) -> None:
        User.objects.create_user(
            username="promo",
            password="original",
            role=Role.gebruiker,
        )
        os.environ["NT2_FIRST_ADMIN_PASSWORD"] = "ignored"
        out = StringIO()
        call_command("create_first_admin", "--username", "promo", stdout=out)
        self.assertIn("now admin", out.getvalue())

        user = User.objects.get(username="promo")
        self.assertEqual(user.role, Role.beheerder)
        self.assertTrue(user.check_password("original"))

    def test_existing_admin_idempotent(self) -> None:
        User.objects.create_user(
            username="already",
            password="pw",
            role=Role.beheerder,
        )
        os.environ["NT2_FIRST_ADMIN_PASSWORD"] = "other"
        out = StringIO()
        call_command("create_first_admin", "--username", "already", stdout=out)
        self.assertIn("already admin", out.getvalue())

        user = User.objects.get(username="already")
        self.assertEqual(user.role, Role.beheerder)
        self.assertTrue(user.check_password("pw"))

    def test_empty_username_fails(self) -> None:
        os.environ["NT2_FIRST_ADMIN_PASSWORD"] = "pw"
        with self.assertRaises(CommandError) as cm:
            call_command("create_first_admin", "--username", "")
        self.assertIn("Username", str(cm.exception))

    def test_empty_password_when_creating_fails(self) -> None:
        with patch(
            "accounts.management.commands.create_first_admin.get_password_from_env_or_prompt",
            return_value="",
        ):
            with self.assertRaises(CommandError) as cm:
                call_command(
                    "create_first_admin",
                    "--username",
                    "newuser",
                )
            self.assertIn("Password", str(cm.exception))
        self.assertFalse(User.objects.filter(username="newuser").exists())
