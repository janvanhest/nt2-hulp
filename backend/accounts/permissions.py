from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated

from .models import Role


class IsAdmin(permissions.BasePermission):
    """
    Allows access only to users with role 'beheerder' (admin).
    Use together with IsAuthenticated (e.g. via ADMIN_PERMISSION_CLASSES) so
    unauthenticated requests get 401 and non-admin requests get 403.
    """

    message = "Only admins can perform this action."
    code = "admin_required"

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, "role", None) == Role.beheerder


# Single source of truth for all admin (verbs/sentences) endpoints.
ADMIN_PERMISSION_CLASSES = (IsAuthenticated, IsAdmin)
