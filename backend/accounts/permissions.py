from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

from .models import Role


class IsBeheerder(permissions.BasePermission):
    """
    Allows access only to users with role 'beheerder'.
    Use together with IsAuthenticated (e.g. via BEHEER_PERMISSION_CLASSES) so
    unauthenticated requests get 401 and non-beheerder requests get 403.
    """

    message = "Alleen beheerder kan deze actie uitvoeren."
    code = "beheerder_required"

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, "role", None) == Role.beheerder


# Single source of truth for all beheer (werkwoorden/zinnen) endpoints.
BEHEER_PERMISSION_CLASSES = (IsAuthenticated, IsBeheerder)
