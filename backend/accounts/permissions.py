from rest_framework import permissions

from .models import Role


class IsBeheerder(permissions.BasePermission):
    """
    Allows access only to users with role 'beheerder'.
    Requires the user to be authenticated first (use together with IsAuthenticated).
    """

    message = "Alleen beheerder kan deze actie uitvoeren."
    code = "beheerder_required"

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, "role", None) == Role.beheerder
